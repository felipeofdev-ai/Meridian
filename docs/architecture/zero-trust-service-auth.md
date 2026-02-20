# Zero Trust Service Authentication Model

## Principles
- No implicit trust between internal services
- Every request authenticated and authorized
- Short-lived credentials and automatic rotation

## Controls
- mTLS between services via service mesh
- Service-to-service JWT with audience and tenant claims
- Workload identity integration with cloud IAM

## Operational Requirements
- Certificate rotation ≤ 24h
- Revocation propagation < 5 minutes
- Mandatory authN/authZ checks in all internal APIs
