# Data Protection Impact Assessment (DPIA)

## Processing Context
Meridian processes repository event metadata for governance and compliance purposes.

## Data Categories
- User identifiers (username/email)
- Repository metadata
- Security/compliance events

## Risks
- Unauthorized disclosure of personal data
- Excessive retention of identifiable event data

## Mitigations
- Data minimization and pseudonymization where feasible
- Encryption at rest and in transit
- Tenant isolation and strict RBAC
- Retention and deletion policies by jurisdiction
