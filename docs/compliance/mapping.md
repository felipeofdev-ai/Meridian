# Compliance Mapping

## SOC 2
| Control | Meridian Capability | Evidence Artifact |
|---|---|---|
| CC6.1 Logical access | SSO/RBAC + tenant-scoped authorization | Access logs, IAM policy snapshots |
| CC7.2 Monitoring | Telemetry, alerting, integrity checks | Metrics dashboards, incident alerts |
| CC8.1 Change management | Policy-as-code + protected branches + PR approvals | PR history, release logs |

## ISO 27001
| Control | Meridian Capability | Evidence Artifact |
|---|---|---|
| A.12.4 Logging & monitoring | Immutable audit trail + centralized logs | Audit event exports, log retention settings |
| A.14.2 Secure development | CI checks, policy tests, signed releases | CI pipeline runs, SBOM, release attestations |
| A.16 Incident management | Severity model + IR workflow + postmortems | Incident tickets, timelines, remediation records |

## DORA (EU)
| Domain | Meridian Capability | Evidence Artifact |
|---|---|---|
| ICT risk management | Continuous policy evaluation + risk scoring | Score history, control drift reports |
| Incident reporting | Structured incident severity and auditability | Incident reports and export logs |
| Operational resilience | DR plans, RTO/RPO targets, failover testing | DR drill reports and recovery evidence |
