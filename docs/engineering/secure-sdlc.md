# Secure SDLC

## Code Review Policy
- Two approvals mandatory for protected branches.
- Security-sensitive changes require Security Engineering approval.

## Mandatory Security Review
- Required for auth, crypto, tenancy, and audit log changes.

## Static Analysis
- SAST in CI for all pull requests.

## Dependency Scanning
- Dependency vulnerability scan on every PR and release.

## Signed Commits and Releases
- Signed commits required on protected branches.
- Release artifacts must be cryptographically signed.
