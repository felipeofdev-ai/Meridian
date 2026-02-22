# Meridian — Codex Package

> The Fixed Point of Truth for Enterprise Engineering

## 1) Visão geral

Meridian é uma camada enterprise de compliance e governança instalada sobre a infraestrutura Git existente da organização.

Objetivo central: permitir que times de engenharia, CISO, auditoria e board respondam com evidência verificável à pergunta:

> “Temos controle real e auditável sobre nosso código?”

## 2) Estrutura de repositório alvo

```text
meridian/
├── apps/
│   ├── collector/
│   ├── engine/
│   ├── intelligence/
│   ├── dashboard/
│   └── api/
├── packages/
│   ├── sdk/
│   ├── policies/
│   └── types/
├── infrastructure/
│   ├── terraform/
│   ├── kubernetes/
│   └── policies/
├── .meridian/policies/
├── docs/
│   ├── architecture/
│   ├── governance/
│   ├── adr/
│   └── executive/
├── scripts/
├── Makefile
├── docker-compose.yml
└── README.md
```

## 3) Stack técnica recomendada

### Backend
- Node.js 20 + TypeScript (ou Go 1.22)
- Fastify (REST) + Apollo Server (GraphQL)
- OPA/Rego (policy engine)
- Kafka (streaming)
- PostgreSQL + TimescaleDB
- Redis

### Frontend
- Next.js 14 (App Router)
- Tailwind + Radix UI
- Recharts + D3
- NextAuth.js + SSO/SAML

### Infraestrutura
- Terraform (multi-cloud)
- Kubernetes + Helm
- GitHub Actions (CI/CD)
- OpenTelemetry + Prometheus + Grafana
- HashiCorp Vault

## 4) Data flow arquitetural

```text
Git Providers -> Event Collector -> Kafka (git.events.raw)
             -> Policy Engine (OPA) -> Kafka (git.events.evaluated)
             -> Intelligence + Immutable Store
             -> API Gateway -> Dashboard + Audit Exports
```

## 5) Modelo de evento canônico (resumo)

Campos obrigatórios do `MeridianEvent`:

- `event_id`
- `sequence_id`
- `timestamp`
- `platform`
- `organization`
- `repository`
- `branch`
- `actor`
- `action`
- `metadata`
- `policy_evaluation` (`status`, `violations`)
- `integrity` (`hash`, `previous_hash`, `signature?`)

## 6) Policy-as-Code

- Policies versionadas em `.meridian/policies/*.rego`
- Regras mínimas iniciais:
  - proteção de branch
  - requisito de 2 aprovações para merge em branches protegidas
  - bloqueio de dependências críticas

## 7) Estratégia de Git e qualidade

- Trunk-based development com feature flags
- Conventional Commits
- Branch protection em `main`:
  - PR obrigatório
  - 2 aprovações
  - checks obrigatórios (CI/security/policy)
  - sem force push e sem delete
  - commits assinados

## 8) Compliance scoring

Score global 0–100 com breakdown por controles:

- branch protection
- code review
- secret scanning
- dependency security
- SBOM coverage
- signed commits
- audit trail

Níveis de risco: `low`, `medium`, `high`, `critical`.

## 9) ADRs mandatórios

- **ADR-001:** armazenamento imutável append-only com hash encadeado
- **ADR-002:** OPA/Rego como motor de políticas
- **ADR-003:** multi-tenant com isolamento forte (schema-per-tenant + RLS)

## 10) Roadmap executável

### Fase 1
1. Collector
2. Immutable audit store
3. Policy engine
4. Dashboard básico
5. Compliance scoring

### Fase 2
1. Anomaly detection
2. Executive reporting
3. Multi-org support

### Fase 3
1. GRC integrations
2. Enterprise SSO
3. SLA monitoring
