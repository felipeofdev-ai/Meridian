# Adversarial Scenarios

## 1) Insider Attempt
- Scenario: privileged user tries policy bypass.
- Control: protected branches, audit logs, approval workflow evidence.

## 2) DB Tampering
- Scenario: attempt UPDATE/DELETE in audit table.
- Control: append-only trigger + chain verification + RLS isolation.

## 3) Replay Attack
- Scenario: repeated webhook delivery replay.
- Control: delivery-id tracking (planned), signature/timestamp checks, rate limiting.

## 4) Signature Forgery
- Scenario: forged webhook signature.
- Control: HMAC verification with tenant-bound secret.

## 5) Tenant Breakout Attempt
- Scenario: cross-tenant query access.
- Control: tenant context + RLS + API-level tenant checks.
