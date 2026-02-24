# Meridian

Immutable audit trail and policy-as-code engine for Git-based engineering workflows.

Meridian collects events from GitHub and GitLab webhooks, stores them in an append-only PostgreSQL ledger with hash chaining, evaluates policy violations in real time, and lets you export cryptographically signed audit bundles for offline verification.

---

## What it does

- **Webhook collector** — receives GitHub/GitLab events, persists them append-only with SHA-256 hash chain per tenant
- **Policy engine** — evaluates incoming events against configurable rules, flags critical violations
- **Signed export** — generates audit bundles signed with Ed25519; verifiable offline via CLI
- **Multi-tenant isolation** — Row-Level Security in PostgreSQL; each tenant sees only its own data

---

## Stack

TypeScript · Fastify · PostgreSQL (RLS + append-only) · Docker · Ed25519 signing · SBOM/Cosign in release pipeline

---

## Quickstart

```bash
make setup
make up
# Collector: http://localhost:8080
# Policy engine: http://localhost:8081
```

**Active endpoints:**
```
POST /webhooks/github
POST /webhooks/gitlab
GET  /audit/integrity?tenant_id=...
GET  /audit/export?tenant_id=...&from=...&to=...
GET  /metrics
```

**Verify an exported bundle offline:**
```bash
node apps/cli/meridian.js verify --bundle audit-export.json --key <export_signing_key>
# Ed25519 mode:
node apps/cli/meridian.js verify --bundle audit-export.json --public-key ./export-public.pem
```

**Run end-to-end local validation:**
```bash
make validate-local
# generates reports/local-validation-report.md
```

**Minimal stack (Postgres + Collector only):**
```bash
make up-minimal
```

---

## Security

- Row-Level Security per tenant in PostgreSQL
- Per-tenant secrets via env config (`TENANT_GITHUB_SECRETS`, `TENANT_GITLAB_TOKENS`, `TENANT_API_KEYS`)
- Release pipeline: SBOM generation, Trivy scan, Cosign signing, provenance attestation
- Weekly Dependabot for npm and GitHub Actions
- Responsible disclosure policy at `.well-known/security.txt`

---

## Project structure

```
apps/
  collector/      # Fastify webhook receiver, PostgreSQL append-only writer
  policy-engine/  # Rule evaluation, violation detection
  cli/            # Offline bundle verification
docs/
  governance/
  security/
  compliance/
  architecture/   # AWS and Azure reference deployments
tests/
  load/           # k6 load scripts
  resilience/
.meridian/policies/
```

---

## Status

Active development. Core collector, policy engine, and signed export are functional.
See [SECURITY.md](SECURITY.md) for responsible disclosure.

---

MIT License · [@felipeofdev-ai](https://github.com/felipeofdev-ai)
