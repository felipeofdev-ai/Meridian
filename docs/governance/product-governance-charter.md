# Product Governance Charter

## 1. Mission
Meridian exists to provide enterprise-grade, tamper-evident governance for software delivery events across Git providers, enabling auditable control evidence for engineering, security, and regulatory stakeholders.

## 2. Scope
### In scope
- Git event ingestion and normalization
- Immutable audit trail and integrity verification
- Policy-as-code enforcement evidence
- Compliance scoring and executive reporting artifacts

### Out of scope
- Source-code hosting replacement
- CI/CD orchestration replacement
- GRC suite replacement

## 3. Governance Principles
1. Evidence over assertion.
2. Security and privacy by default.
3. Tenant isolation as a first-order concern.
4. Change management through version-controlled workflows.
5. Verifiable controls aligned to enterprise frameworks.

## 4. RACI Matrix
| Domain | Responsible | Accountable | Consulted | Informed |
|---|---|---|---|---|
| Product roadmap | Product Management | CEO/GM | CISO, Engineering | Sales, CS |
| Security controls | Security Engineering | CISO | Platform, Legal | Product |
| Policy library changes | Governance Engineering | Head of Governance | Security, Audit | Customer Success |
| Runtime operations | SRE | VP Engineering | Security, Product | All customers |
| Compliance mappings | Compliance Lead | CISO | External auditor, Legal | GTM leadership |

## 5. Policy Change Process
1. Propose change via PR with rationale and control mapping.
2. Require two approvals (Security + Governance owner).
3. Run policy tests and impact checks in CI.
4. Release with semantic versioning and changelog entry.
5. Record effective date and affected tenants.
6. Preserve full history for external audit evidence.

## 6. Governance Cadence
- Weekly risk triage
- Bi-weekly control drift review
- Monthly executive governance review
- Quarterly control effectiveness attestation
