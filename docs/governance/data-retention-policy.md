# Data Retention & Legal Hold Policy

## Retention Baseline
- Audit events retained for 7 years by default (SOX-aligned)
- Tenant-configurable retention above baseline where required

## Legal Hold Mode
- Legal hold can suspend deletion/archival for scoped tenants/time windows
- Activation requires dual authorization (Security + Compliance)

## Immutability Override
- Any exceptional override requires quorum approval (minimum 2-of-3: CISO, Compliance Lead, VP Engineering)
- All override actions are logged and included in audit evidence

## Deletion and Archival
- Archival to immutable storage tiers
- Cryptographic chain continuity retained across active/archive boundaries
