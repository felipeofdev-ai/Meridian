# Architecture Overview (Procurement Package)

Meridian operates as an overlay control plane on existing Git infrastructure, ingesting events from Git providers, evaluating controls, and producing tamper-evident governance evidence.

## Deployment Modes
- SaaS managed
- Customer-hosted on-prem
- Hybrid control/data plane split

## Security Controls Summary
- Tenant isolation (RLS + tenant-bound context)
- Immutable append-only audit store
- Signed release pipeline and SBOM
- SSO-ready integration path (OIDC/SAML)
