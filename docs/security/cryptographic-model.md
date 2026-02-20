# Cryptographic Model

## 1. Integrity
- Event chain hash algorithm: **SHA-256**
- Canonical serialization: deterministic JSON ordering
- Chain rule: `event_hash = SHA256(canonical_event || previous_hash)`

## 2. Signatures
- Preferred event signature algorithm: **Ed25519**
- Signature scope: event hash + timestamp + tenant_id
- Verification required for external audit exports

## 3. Key Management
- Keys stored in KMS/HSM (cloud KMS or dedicated HSM)
- No plaintext key material in application config
- Per-tenant key namespace
- Access through short-lived credentials only

## 4. Rotation Policy
- Regular rotation every 90 days (or stricter by tenant policy)
- Immediate rotation on compromise indicators
- Versioned key IDs attached to signatures
- Backward verification support for retired keys

## 5. Encryption
- At rest: AES-256 via managed storage encryption
- In transit: TLS 1.2+ (TLS 1.3 preferred)
