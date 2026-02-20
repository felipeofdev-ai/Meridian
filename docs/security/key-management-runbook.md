# Key Management Runbook

## Provider Model
- Primary: cloud-managed KMS/HSM (`KEY_PROVIDER=aws-kms|azure-keyvault`)
- Fallback/dev: environment-provided keys (`KEY_PROVIDER=env`)
- Every signature includes `key_id` and `key_reference`

## Rotation Procedure (Automated)
1. Provision new key version in KMS/Key Vault.
2. Update active alias to new key (`alias/meridian-export-signing`).
3. Deploy signing service with new `EXPORT_SIGNING_KEY_ID` and `KEY_REFERENCE`.
4. Keep verification support for N-1 key versions during grace window.
5. Record rotation event in governance log.

## Revocation Procedure
1. Disable compromised key version at KMS layer.
2. Roll alias to emergency key version.
3. Trigger SEV-1 and notify affected customers.
4. Reissue signed exports for impacted periods if needed.

## Compromise Response
1. Contain key usage via IAM deny policy.
2. Rotate and re-attest signing chain.
3. Run forensic review on signing events.
4. Publish incident summary and remediation evidence.
