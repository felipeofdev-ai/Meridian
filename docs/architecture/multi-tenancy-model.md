# Multi-Tenancy Model

## Isolation Strategy
- Primary: schema-per-tenant in PostgreSQL
- Secondary: row-level security enforcement
- Tertiary: tenant-aware service authorization context

## Data Protection
- Per-tenant encryption key namespaces
- Tenant-scoped object prefixes for exports/backups
- No cross-tenant joins in application query layer

## Operational Controls
- Tenant-scoped quotas and rate limits
- Tenant-specific audit export pipelines
- Tenant isolation checks in CI and integration tests
