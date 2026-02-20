# Meridian

**The Fixed Point of Truth for Enterprise Engineering**

Meridian é uma plataforma de governança e compliance para Git enterprise com trilha de auditoria imutável, policy-as-code e inteligência de conformidade.

## Estado atual (entregável executável)

- Collector funcional em TypeScript/Fastify (`apps/collector`)
- Policy Engine inicial (`apps/policy-engine`) com avaliação de violações críticas
- Persistência de eventos em PostgreSQL append-only com hash chain e RLS por tenant
- Endpoints ativos:
  - `POST /webhooks/github`
  - `POST /webhooks/gitlab`
  - `GET /audit/integrity?tenant_id=...`
  - `GET /audit/export?tenant_id=...&from=...&to=...` (includes `key_id`, signature metadata)
  - `GET /metrics`
- Verificação offline de export via CLI:
  - `node apps/cli/meridian.js verify --bundle audit-export.json --key <export_signing_key>`
  - Ed25519 mode: `node apps/cli/meridian.js verify --bundle audit-export.json --public-key ./export-public.pem`

## Quickstart

```bash
make setup
make up
```

Collector em `http://localhost:8080` e Policy Engine em `http://localhost:8081`.

## Segurança e Trust Signals

- Row-Level Security por tenant no banco
- Chaves/segredos por tenant via configuração (`TENANT_GITHUB_SECRETS`, `TENANT_GITLAB_TOKENS`, `TENANT_API_KEYS`)
- Release security pipeline com SBOM, Trivy, Cosign e provenance attestation
- Dependabot semanal para npm e GitHub Actions
- Responsible disclosure policy + `.well-known/security.txt`

## Estrutura-chave

- Código: `apps/collector/`, `apps/policy-engine/`, `apps/cli/`
- SQL append-only + RLS: `apps/collector/sql/001_init.sql`
- CI/CD: `.github/workflows/ci.yml`, `.github/workflows/release-security.yml`
- OpenAPI: `docs/api/openapi.yaml`
- Governança: `docs/governance/`
- Segurança: `docs/security/`
- Compliance: `docs/compliance/`
- Support/LTS: `docs/support/`
- Procurement: `docs/procurement/`
- Pilot package: `docs/pilot/`
- Integrações enterprise: `docs/integrations/`
- Arquitetura de referência: `docs/architecture/reference-deployment-aws.md`, `docs/architecture/reference-deployment-azure.md`
- Performance e resiliência: `tests/load/k6-script.js`, `tests/resilience/`, `reports/`
- Validação local ponta a ponta: `make validate-local` (gera `reports/local-validation-report.md`)
- Stack mínima (Postgres + Collector): `make up-minimal`
