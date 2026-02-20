# SLA / SLO Definition

## External SLA Targets
- Platform availability: **99.9%** (base tier)
- Premium availability option: **99.99%**

## Service SLOs
- Webhook ingestion success: 99.95% (5-min windows)
- p95 ingest latency: < 2 seconds
- Policy evaluation latency p95: < 3 seconds
- Integrity verification job success: 99.9% daily

## Incident Severity Model
- **SEV-1:** customer-wide outage or integrity compromise
- **SEV-2:** major feature degradation across tenants
- **SEV-3:** partial degradation with workaround
- **SEV-4:** minor defect with low operational impact

## Error Budget Policy
- Monthly error budget tracked per SLO
- Freeze non-critical releases if budget exhausted
