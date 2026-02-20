# Data Flow Diagram (DFD)

## Level 1
```text
[GitHub/GitLab/Bitbucket]
          |
          | Webhooks/API
          v
+--------------------+      +------------------+
| Event Collector    | ---> | Kafka Topics     |
+--------------------+      +------------------+
          |                            |
          v                            v
+--------------------+        +------------------+
| Immutable Audit DB | <----  | Policy Engine    |
+--------------------+        +------------------+
          |
          v
+--------------------+      +------------------+
| API Gateway        | ---> | Executive UI      |
+--------------------+      +------------------+
          |
          v
 [Audit Exports / SIEM / GRC]
```

## Trust Boundaries
- TB1: External provider network -> Meridian ingress
- TB2: Service runtime -> Data stores
- TB3: Tenant A -> Tenant B isolation boundary
- TB4: Admin plane -> Customer plane
