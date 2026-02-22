# Threat Model (STRIDE)

## 1. System Components
- Event Collector
- Policy Engine
- Immutable Audit Store
- API Gateway
- Dashboard
- Integrations (Git providers, IdP, SIEM)

## 2. Trust Boundaries
1. External Git provider to Collector
2. Internal service mesh boundary
3. Data plane (DB/Kafka/Redis) boundary
4. Tenant boundary in query and storage layers
5. Admin/operator boundary

## 3. STRIDE Analysis

## Event Collector
- **Spoofing:** forged webhook sender identity.
  - Mitigations: provider signature verification, nonce/replay detection, ingress ACL.
- **Tampering:** modified payload in transit.
  - Mitigations: TLS 1.2+, HMAC verification before processing.
- **Repudiation:** sender denies action.
  - Mitigations: store delivery ID, source metadata, signed ingest record.
- **Information Disclosure:** sensitive payload leakage.
  - Mitigations: header redaction, field-level filtering, encryption at rest.
- **Denial of Service:** webhook flooding.
  - Mitigations: rate limiting, autoscaling, queue buffering.
- **Elevation of Privilege:** malformed event triggers privileged code path.
  - Mitigations: strict schema validation, least-privilege service accounts.

## Policy Engine
- **Spoofing:** unauthorized policy publisher.
  - Mitigations: signed commits, CODEOWNERS, protected branches.
- **Tampering:** policy bundle modification.
  - Mitigations: checksum verification, immutable artifact storage.
- **Repudiation:** policy decision denied later.
  - Mitigations: decision logs with policy version hash.
- **Information Disclosure:** decision traces expose secrets.
  - Mitigations: redact sensitive fields before logging.
- **Denial of Service:** expensive policy evaluation payloads.
  - Mitigations: evaluation timeouts, input size bounds.
- **Elevation of Privilege:** policy bypass via fallback behavior.
  - Mitigations: fail-closed strategy.

## Immutable Audit Store
- **Spoofing:** unauthorized writer role.
  - Mitigations: IAM-bound DB auth, short-lived credentials.
- **Tampering:** update/delete on historical events.
  - Mitigations: append-only triggers, restricted roles, chain verification.
- **Repudiation:** actor disputes writes.
  - Mitigations: signed write envelopes, append-only write logs.
- **Information Disclosure:** cross-tenant reads.
  - Mitigations: schema isolation, RLS, encryption keys per tenant.
- **Denial of Service:** DB saturation.
  - Mitigations: partitioning, replicas, write shedding.
- **Elevation of Privilege:** SQL injection path.
  - Mitigations: parameterized queries, DB firewall policies.

## API Gateway and Dashboard
- **Spoofing:** session/token impersonation.
  - Mitigations: SSO (SAML/OIDC), MFA, token rotation.
- **Tampering:** API request manipulation.
  - Mitigations: signed JWT validation, strict authorization checks.
- **Repudiation:** admin action denial.
  - Mitigations: immutable admin audit log.
- **Information Disclosure:** insecure endpoints.
  - Mitigations: RBAC/ABAC, tenant-scoped authorization.
- **Denial of Service:** API burst traffic.
  - Mitigations: WAF, rate limits, autoscaling.
- **Elevation of Privilege:** broken access control.
  - Mitigations: centralized authz layer, regression tests.
