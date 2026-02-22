# Risk Register

| ID | Risk | Impact | Likelihood | Mitigation | Owner | Status |
|---|---|---|---|---|---|---|
| R-001 | Webhook spoofing bypasses ingestion trust | High | Medium | HMAC/signature validation, source allowlists, replay protection | Security Eng | Open |
| R-002 | Hash-chain tampering in audit store | Critical | Low | Append-only constraints, integrity verifier job, cryptographic signatures | Platform Eng | Open |
| R-003 | Tenant data leakage via query path | Critical | Medium | Schema-per-tenant + RLS + per-tenant encryption keys | Platform Eng | Open |
| R-004 | Policy regression causes false pass | High | Medium | Mandatory policy tests, staged rollout, canary evaluation | Governance Eng | Open |
| R-005 | Event backlog causes delayed evidence | Medium | Medium | Queue backpressure controls, autoscaling, SLO alerts | SRE | Open |
| R-006 | Key compromise for signing/integrity | Critical | Low | KMS/HSM-backed keys, rotation, key usage audit trails | Security Eng | Open |
| R-007 | Insufficient backup/restore readiness | High | Medium | DR drills, immutable backups, cross-region restore tests | SRE | Open |
| R-008 | Compliance claims drift from implementation | High | Medium | Control owner attestations, quarterly mapping review | Compliance Lead | Open |
