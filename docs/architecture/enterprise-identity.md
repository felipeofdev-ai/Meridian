# Enterprise Identity Federation

## Supported Federation Patterns
- OIDC (Okta, Azure AD, Ping Identity)
- SAML 2.0 for enterprise SSO compatibility

## Claim Mapping
- `sub` / `email` -> user identity
- `groups` / `roles` -> Meridian role mapping
- `tenant_id` (or mapped org claim) -> tenant context

## SCIM Provisioning Model
- SCIM used for user/group lifecycle synchronization
- Deprovisioning SLA: immediate revocation on sync

## Role Mapping
- `MeridianAdmin`: tenant-wide administration
- `SecurityAnalyst`: read + investigation + export
- `Auditor`: read-only evidence access
- `Operator`: operational actions without policy override
