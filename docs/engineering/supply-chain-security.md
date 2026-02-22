# Supply Chain Security Controls

## Release Integrity
- Container signing with Cosign (keyless)
- Build provenance attestation in release workflow

## Artifact Transparency
- CycloneDX SBOM generated and uploaded per release
- Vulnerability scanning gate via Trivy

## Dependency Hygiene
- Dependabot weekly updates for npm and GitHub Actions
- Security triage SLA for HIGH/CRITICAL findings
