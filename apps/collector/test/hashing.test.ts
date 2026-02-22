import { describe, expect, it } from 'vitest';
import { canonicalize, computeEventHash, validateGithubSignature } from '../src/hashing.js';
import crypto from 'node:crypto';

describe('hashing', () => {
  it('canonicalize sorts object keys', () => {
    const a = canonicalize({ b: 1, a: 2 });
    const b = canonicalize({ a: 2, b: 1 });
    expect(a).toBe(b);
  });

  it('computeEventHash is deterministic', () => {
    const params = {
      tenantId: 'acme',
      provider: 'github' as const,
      eventType: 'push',
      occurredAt: '2025-01-01T00:00:00Z',
      payload: { x: 1 },
      previousHash: 'GENESIS'
    };
    expect(computeEventHash(params)).toBe(computeEventHash(params));
  });

  it('validates github hmac signature', () => {
    const raw = Buffer.from('{"hello":"world"}');
    const secret = 'test-secret';
    const sig = `sha256=${crypto.createHmac('sha256', secret).update(raw).digest('hex')}`;
    expect(validateGithubSignature(raw, sig, secret)).toBe(true);
    expect(validateGithubSignature(raw, sig, 'wrong')).toBe(false);
  });
});
