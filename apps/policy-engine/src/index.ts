import Fastify from 'fastify';
import { z } from 'zod';

const app = Fastify({ logger: true });
const port = Number(process.env.PORT ?? 8081);
const host = process.env.HOST ?? '0.0.0.0';

const InputSchema = z.object({
  tenant_id: z.string(),
  action: z.string(),
  branch: z.string().optional(),
  metadata: z.record(z.any()).optional()
});

app.post('/evaluate', async (req, reply) => {
  const parsed = InputSchema.safeParse(req.body);
  if (!parsed.success) {
    return reply.code(400).send({ error: parsed.error.message });
  }

  const input = parsed.data;
  const violations: string[] = [];

  if (input.action === 'push' && (input.branch === 'main' || input.branch === 'master')) {
    const viaPr = Boolean(input.metadata?.via_pull_request);
    if (!viaPr) violations.push('Direct push to protected branch is not allowed');
  }

  const approvedReviews = Number(input.metadata?.approved_reviews ?? 0);
  if (input.action === 'pr_merge' && (input.branch === 'main' || input.branch === 'master') && approvedReviews < 2) {
    violations.push('Protected branch merge requires at least 2 approvals');
  }

  const hasSecrets = Boolean(input.metadata?.secret_exposure_detected);
  if (hasSecrets) violations.push('Secret exposure detected in commit payload');

  return reply.send({
    tenant_id: input.tenant_id,
    status: violations.length ? 'fail' : 'pass',
    violations
  });
});

app.get('/health', async () => ({ status: 'ok' }));

if (process.env.NODE_ENV !== 'test') {
  await app.listen({ host, port });
}

export default app;
