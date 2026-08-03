<div align="center">

# Meridian

### Append-only engineering governance — the fixed point of truth

[![TypeScript](https://img.shields.io/badge/TypeScript-Fastify-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://github.com/felipeofdev-ai/Meridian)
[![Orbit](https://img.shields.io/badge/Portfolio-Orbit-5EC8C0?style=for-the-badge)](https://felipeofdev-ai.github.io/)

Immutable audit trail + policy-as-code for Git-based engineering workflows.  
Webhook events → hash-chained ledger → real-time policy → Ed25519 signed export.

</div>

## What it does

- **Webhook collector** — GitHub/GitLab events, append-only SHA-256 chain per tenant  
- **Policy engine** — configurable rules, critical violation flags  
- **Signed export** — audit bundles with Ed25519; offline CLI verify  
- **Multi-tenant isolation** — PostgreSQL RLS  

## Stack

TypeScript · Fastify · PostgreSQL (RLS + append-only) · Docker · Ed25519 · SBOM/Cosign release path

## Quickstart

```bash
make setup && make up
# Collector :8080 · Policy :8081
```

```
POST /webhooks/github
POST /webhooks/gitlab
GET  /audit/integrity?tenant_id=...
GET  /audit/export?tenant_id=...&from=...&to=...
GET  /metrics
```

```bash
node apps/cli/meridian.js verify --bundle audit-export.json --key <export_signing_key>
```

## Why this matters to hiring managers

Governance and auditability are table stakes for regulated / enterprise engineering. Meridian shows **tamper-evident design**, not slides.

Author: [Felipe Fernandes](https://github.com/felipeofdev-ai) · [Orbit portfolio](https://felipeofdev-ai.github.io/)
