# SBOM and Release Security Baseline

## SBOM
- Generate SBOM on every release build (CycloneDX or SPDX)
- Store SBOM artifact alongside release metadata
- Associate SBOM with commit SHA and container digest

## Release Security
- Signed release artifacts (Sigstore/Cosign or equivalent)
- Dependency vulnerability scanning gates
- License policy checks in CI
- Provenance attestation attached to release pipeline
