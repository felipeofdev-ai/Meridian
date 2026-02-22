import { Pool, PoolClient } from 'pg';
import { config } from './config.js';
import { CanonicalEvent } from './types.js';

const pool = new Pool({ connectionString: config.databaseUrl });

async function withTenantClient<T>(tenantId: string, fn: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query("SELECT set_config('app.tenant_id', $1, true)", [tenantId]);
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function getPreviousHash(tenantId: string): Promise<string> {
  return withTenantClient(tenantId, async (client) => {
    const result = await client.query(
      'SELECT event_hash FROM audit_events WHERE tenant_id = $1 ORDER BY created_at DESC LIMIT 1',
      [tenantId]
    );
    return result.rows[0]?.event_hash ?? 'GENESIS';
  });
}

export async function appendEvent(event: CanonicalEvent): Promise<void> {
  await withTenantClient(event.tenant_id, async (client) => {
    await client.query(
      `INSERT INTO audit_events
        (id, tenant_id, provider, event_type, previous_hash, event_hash, payload)
       VALUES ($1,$2,$3,$4,$5,$6,$7::jsonb)`,
      [event.id, event.tenant_id, event.provider, event.event_type, event.previous_hash, event.event_hash, JSON.stringify(event.payload)]
    );
  });
}

export async function verifyChainIntegrity(tenantId: string): Promise<{ valid: boolean; checked: number; breakAt?: string }> {
  return withTenantClient(tenantId, async (client) => {
    const result = await client.query(
      `SELECT id, previous_hash, event_hash, created_at
         FROM audit_events
        WHERE tenant_id = $1
        ORDER BY created_at ASC, id ASC`,
      [tenantId]
    );

    let prev = 'GENESIS';
    for (const row of result.rows) {
      if (row.previous_hash !== prev) {
        return { valid: false, checked: result.rows.length, breakAt: row.id };
      }
      prev = row.event_hash;
    }

    return { valid: true, checked: result.rows.length };
  });
}

export async function getEventsForExport(params: {
  tenantId: string;
  from?: string;
  to?: string;
}): Promise<Array<{ id: string; created_at: string; event_type: string; provider: string; previous_hash: string; event_hash: string; payload: unknown }>> {
  return withTenantClient(params.tenantId, async (client) => {
    const result = await client.query(
      `SELECT id, created_at, event_type, provider, previous_hash, event_hash, payload
         FROM audit_events
        WHERE tenant_id = $1
          AND ($2::timestamptz IS NULL OR created_at >= $2::timestamptz)
          AND ($3::timestamptz IS NULL OR created_at <= $3::timestamptz)
        ORDER BY created_at ASC, id ASC`,
      [params.tenantId, params.from ?? null, params.to ?? null]
    );
    return result.rows;
  });
}

export async function closeDb(): Promise<void> {
  await pool.end();
}
