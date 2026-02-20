import Fastify from 'fastify';
import sensible from '@fastify/sensible';
import crypto from 'node:crypto';
import { z } from 'zod';
import { appendEvent, getEventsForExport, getPreviousHash, verifyChainIntegrity } from './db.js';
import { config } from './config.js';
import { canonicalize, computeEventHash, sha256, validateGithubSignature } from './hashing.js';
import { signBundleHash } from './signing.js';

const app = Fastify({ logger: true });
await app.register(sensible);

app.addContentTypeParser('*', { parseAs: 'buffer' }, (_, body, done) => done(null, body));

const tenantQuery = z.object({ tenant_id: z.string().min(1) });
const exportQuery = z.object({
  tenant_id: z.string().min(1),
  from: z.string().optional(),
  to: z.string().optional()
});
const metrics = {
  webhookRequestsTotal: 0,
  githubSignatureFailures: 0,
  gitlabTokenFailures: 0,
  eventsPersisted: 0
};

function parseJsonBody(body: unknown): unknown {
  if (Buffer.isBuffer(body)) return JSON.parse(body.toString('utf8'));
  return body;
}

function resolveTenantSecret(tenantId: string, provider: 'github' | 'gitlab'): string {
  if (provider === 'github') {
    return config.tenantGithubSecrets[tenantId] ?? config.githubSecret;
  }
  return config.tenantGitlabTokens[tenantId] ?? config.gitlabToken;
}

function validateTenantApiKey(tenantId: string, apiKey: string | undefined): boolean {
  const expected = config.tenantApiKeys[tenantId];
  if (!expected) return true;
  return apiKey === expected;
}


app.addHook('onRequest', async (req, reply) => {
  const tenantId = (req.headers['x-tenant-id'] as string | undefined) ?? 'default';
  const correlationId = (req.headers['x-correlation-id'] as string | undefined) ?? crypto.randomUUID();
  req.headers['x-correlation-id'] = correlationId;
  reply.header('x-correlation-id', correlationId);

  const apiKey = req.headers['x-api-key'] as string | undefined;
  if (!validateTenantApiKey(tenantId, apiKey)) {
    return reply.unauthorized('invalid tenant api key');
  }
});

app.post('/webhooks/github', async (req, reply) => {
  metrics.webhookRequestsTotal += 1;
  const raw = req.body as Buffer;
  const payload = parseJsonBody(raw) as Record<string, unknown>;
  const tenantId = String(req.headers['x-tenant-id'] ?? payload.organization ?? 'default');
  const secret = resolveTenantSecret(tenantId, 'github');
  const signature = req.headers['x-hub-signature-256'] as string | undefined;
  const eventType = (req.headers['x-github-event'] as string | undefined) ?? 'unknown';

  if (!validateGithubSignature(raw, signature, secret)) {
    metrics.githubSignatureFailures += 1;
    return reply.unauthorized('invalid signature');
  }

  const previousHash = await getPreviousHash(tenantId);
  const occurredAt = new Date().toISOString();
  const eventHash = computeEventHash({ tenantId, provider: 'github', eventType, occurredAt, payload, previousHash });

  await appendEvent({
    id: crypto.randomUUID(),
    tenant_id: tenantId,
    provider: 'github',
    event_type: eventType,
    previous_hash: previousHash,
    event_hash: eventHash,
    payload
  });

  metrics.eventsPersisted += 1;
  return reply.code(202).send({ status: 'accepted', provider: 'github' });
});

app.post('/webhooks/gitlab', async (req, reply) => {
  metrics.webhookRequestsTotal += 1;
  const payload = parseJsonBody(req.body) as Record<string, unknown>;
  const tenantId = String(req.headers['x-tenant-id'] ?? payload.organization ?? payload.group ?? 'default');
  const token = req.headers['x-gitlab-token'] as string | undefined;
  const expected = resolveTenantSecret(tenantId, 'gitlab');

  if (!token || token !== expected) {
    metrics.gitlabTokenFailures += 1;
    return reply.unauthorized('invalid token');
  }

  const eventType = (req.headers['x-gitlab-event'] as string | undefined) ?? 'unknown';
  const previousHash = await getPreviousHash(tenantId);
  const occurredAt = new Date().toISOString();
  const eventHash = computeEventHash({ tenantId, provider: 'gitlab', eventType, occurredAt, payload, previousHash });

  await appendEvent({
    id: crypto.randomUUID(),
    tenant_id: tenantId,
    provider: 'gitlab',
    event_type: eventType,
    previous_hash: previousHash,
    event_hash: eventHash,
    payload
  });

  metrics.eventsPersisted += 1;
  return reply.code(202).send({ status: 'accepted', provider: 'gitlab' });
});

app.get('/audit/integrity', async (req, reply) => {
  const parsed = tenantQuery.safeParse(req.query);
  if (!parsed.success) {
    return reply.badRequest(parsed.error.message);
  }
  const result = await verifyChainIntegrity(parsed.data.tenant_id);
  return reply.send({ tenant_id: parsed.data.tenant_id, ...result });
});

app.get('/audit/export', async (req, reply) => {
  const parsed = exportQuery.safeParse(req.query);
  if (!parsed.success) {
    return reply.badRequest(parsed.error.message);
  }

  const events = await getEventsForExport({
    tenantId: parsed.data.tenant_id,
    from: parsed.data.from,
    to: parsed.data.to
  });

  const unsignedBundle = {
    format_version: '1.0.0',
    tenant_id: parsed.data.tenant_id,
    from: parsed.data.from ?? null,
    to: parsed.data.to ?? null,
    generated_at: new Date().toISOString(),
    events
  };

  const bundleHash = sha256(canonicalize(unsignedBundle));
  const signatureInfo = signBundleHash(bundleHash);

  return reply.send({
    ...unsignedBundle,
    bundle_hash: bundleHash,
    ...signatureInfo
  });
});

app.get('/metrics', async () => {
  return [
    '# TYPE collector_webhook_requests_total counter',
    `collector_webhook_requests_total ${metrics.webhookRequestsTotal}`,
    '# TYPE collector_signature_failures_total counter',
    `collector_signature_failures_total ${metrics.githubSignatureFailures + metrics.gitlabTokenFailures}`,
    '# TYPE collector_events_persisted_total counter',
    `collector_events_persisted_total ${metrics.eventsPersisted}`
  ].join('\n');
});

if (process.env.NODE_ENV !== 'test') {
  await app.listen({ host: config.host, port: config.port });
}

export default app;
