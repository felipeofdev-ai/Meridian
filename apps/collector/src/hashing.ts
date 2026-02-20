import crypto from 'node:crypto';

export function canonicalize(input: unknown): string {
  if (input === null || typeof input !== 'object') {
    return JSON.stringify(input);
  }

  if (Array.isArray(input)) {
    return `[${input.map((v) => canonicalize(v)).join(',')}]`;
  }

  const obj = input as Record<string, unknown>;
  const keys = Object.keys(obj).sort();
  const body = keys
    .map((k) => `${JSON.stringify(k)}:${canonicalize(obj[k])}`)
    .join(',');
  return `{${body}}`;
}

export function sha256(value: string): string {
  return crypto.createHash('sha256').update(value).digest('hex');
}

export function computeEventHash(params: {
  tenantId: string;
  provider: 'github' | 'gitlab';
  eventType: string;
  occurredAt: string;
  payload: unknown;
  previousHash: string;
}): string {
  const canonical = canonicalize(params.payload);
  const base = [params.tenantId, params.provider, params.eventType, params.occurredAt, canonical, params.previousHash].join('|');
  return sha256(base);
}

export function validateGithubSignature(rawBody: Buffer, signatureHeader: string | undefined, secret: string): boolean {
  if (!signatureHeader?.startsWith('sha256=')) return false;
  const expected = `sha256=${crypto.createHmac('sha256', secret).update(rawBody).digest('hex')}`;
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signatureHeader));
}
