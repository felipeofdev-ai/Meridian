<div align="center">

# Meridian

### Append-only engineering governance â€” the fixed point of truth

[![TypeScript](https://img.shields.io/badge/TypeScript-Fastify-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://github.com/felipeofdev-ai/Meridian)
[![Orbit](https://img.shields.io/badge/Portfolio-Orbit-5EC8C0?style=for-the-badge)](https://felipeofdev-ai.github.io/)
[![Live Demo](https://img.shields.io/badge/Live_Demo-Labs-5EC8C0?style=for-the-badge)](https://felipeofdev-ai.github.io/labs/meridian/)


Immutable audit trail + policy-as-code for Git-based engineering workflows.  
Webhook events â†’ hash-chained ledger â†’ real-time policy â†’ Ed25519 signed export.

</div>

## What it does

- **Webhook collector** â€” GitHub/GitLab events, append-only SHA-256 chain per tenant  
- **Policy engine** â€” configurable rules, critical violation flags  
- **Signed export** â€” audit bundles with Ed25519; offline CLI verify  
- **Multi-tenant isolation** â€” PostgreSQL RLS  

## Stack

TypeScript Â· Fastify Â· PostgreSQL (RLS + append-only) Â· Docker Â· Ed25519 Â· SBOM/Cosign release path

## Quickstart

```bash
make setup && make up
# Collector :8080 Â· Policy :8081
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

Author: [Felipe Fernandes](https://github.com/felipeofdev-ai) Â· [Orbit portfolio](https://felipeofdev-ai.github.io/)

---

## Live demo

**Try it in the browser (no clone):** see badge / homepage above, or the [Labs hub](https://felipeofdev-ai.github.io/labs/).

## Constellation

| Project | Demo |
|---------|------|
| [CardOpsAI](https://github.com/felipeofdev-ai/CardOpsAI) | [lab](https://felipeofdev-ai.github.io/labs/cardopsai/) |
| [BridgeTrace-AI](https://github.com/felipeofdev-ai/BridgeTrace-AI) | [lab](https://felipeofdev-ai.github.io/labs/bridgetrace/) |
| [Meridian](https://github.com/felipeofdev-ai/Meridian) | [lab](https://felipeofdev-ai.github.io/labs/meridian/) |
| [TrustHire](https://github.com/felipeofdev-ai/trusthire) | [lab](https://felipeofdev-ai.github.io/labs/trusthire/) |
| [secure-ship-kit](https://github.com/felipeofdev-ai/secure-ship-kit) | [lab](https://felipeofdev-ai.github.io/labs/secure-ship-kit/) |
| [agentic-rag-cite](https://github.com/felipeofdev-ai/agentic-rag-cite) | [lab](https://felipeofdev-ai.github.io/labs/agentic-rag-cite/) |
| [hitl-langgraph-kit](https://github.com/felipeofdev-ai/hitl-langgraph-kit) | [lab](https://felipeofdev-ai.github.io/labs/hitl-langgraph-kit/) |
| [forge-mcp-server](https://github.com/felipeofdev-ai/forge-mcp-server) | [lab](https://felipeofdev-ai.github.io/labs/forge-mcp-server/) |
| [agent-eval-harness](https://github.com/felipeofdev-ai/agent-eval-harness) | [lab](https://felipeofdev-ai.github.io/labs/agent-eval-harness/) |
| [lgpd-checklist-agent](https://github.com/felipeofdev-ai/lgpd-checklist-agent) | [lab](https://felipeofdev-ai.github.io/labs/lgpd-checklist-agent/) |
| [hiring-packet](https://github.com/felipeofdev-ai/hiring-packet) | [lab](https://felipeofdev-ai.github.io/labs/hiring-packet/) |
| [philo-ai-os](https://github.com/felipeofdev-ai/philo-ai-os) | [lab](https://felipeofdev-ai.github.io/labs/philo-ai-os/) |
| [balcaoia-local](https://github.com/felipeofdev-ai/balcaoia-local) | [studio](https://balcaoia-studio.vercel.app) |

Portfolio: [felipeofdev-ai.github.io](https://felipeofdev-ai.github.io/) · Author: Felipe Fernandes · `felipe.of.dev@gmail.com`

> If this helped you, **star this repo** — organic only. No bots, no paid stars.