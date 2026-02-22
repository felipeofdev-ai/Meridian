# Prompt — Meridian Bootstrap (Codex)

```text
Create a production-ready monorepo called "meridian" — an enterprise
Git compliance and governance platform (Fortune 500 tier).

Tech stack:
- TypeScript throughout
- Node.js 20 (Fastify) for backend services
- Next.js 14 (App Router) for the dashboard
- PostgreSQL + TimescaleDB for immutable event storage
- Apache Kafka for event streaming
- Open Policy Agent (OPA) with Rego for policy engine
- Redis for caching
- Docker Compose for local development
- GitHub Actions for CI/CD
- Helm + Kubernetes for production deployment

Start with:
1. Root package.json (npm workspaces monorepo)
2. apps/collector — Fastify service that receives GitHub/GitLab webhooks,
   validates payload, hashes events with SHA-256 chaining, and publishes
   to Kafka topic "git.events.raw"
3. apps/engine — OPA-based policy evaluation service that consumes
   "git.events.raw", evaluates policies from .meridian/policies/*.rego,
   and publishes to "git.events.evaluated"
4. apps/api — GraphQL + REST gateway with authentication (JWT + API keys)
5. apps/dashboard — Next.js executive dashboard showing compliance scores,
   event timeline, and policy violation alerts
6. packages/types — shared TypeScript interfaces for MeridianEvent schema
7. packages/policies — standard OPA policy library (branch protection,
   dependency security, approval requirements)
8. docker-compose.yml — full local stack (postgres, kafka, redis, all apps)
9. .github/workflows/ci.yml — CI with lint, test, security scan, OPA validation
10. Makefile with: setup, dev, build, test, security, audit-report targets
11. .meridian/policies/ — Meridian auditing itself (dogfooding)

The MeridianEvent schema must include: event_id, sequence_id, timestamp,
platform, organization, repository, branch, actor, action, metadata,
policy_evaluation (status, violations), and integrity (hash, previous_hash).

Use Conventional Commits, implement proper error handling, structured
logging (pino), and OpenTelemetry instrumentation throughout.
```
