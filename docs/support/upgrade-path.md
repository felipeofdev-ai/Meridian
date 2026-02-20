# Upgrade Path

1. Review release notes and compatibility matrix.
2. Run pre-upgrade validation (config schema, DB backup, policy bundle validation).
3. Perform staged rollout (canary -> partial -> full).
4. Run post-upgrade checks (integrity verifier, policy evaluation health, metrics baseline).
5. Keep rollback package for one full release cycle.
