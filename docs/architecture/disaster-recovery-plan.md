# Disaster Recovery Plan

## Objectives
- **RPO:** 15 minutes
- **RTO:** 4 hours

## Backup Policy
- Continuous WAL archiving for PostgreSQL
- Hourly incremental backups
- Daily full backups
- Immutable offsite storage retention policy

## Recovery Procedures
1. Incident declaration and severity assignment
2. Failover to warm standby region
3. Restore data plane from latest consistent checkpoint
4. Rebuild service plane via IaC + GitOps
5. Verify chain integrity and tenant accessibility

## Testing Cadence
- Quarterly restore drills
- Semiannual regional failover simulations
- Annual game-day across all critical services
