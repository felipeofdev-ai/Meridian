# Reference Deployment — AWS

- VPC with public/private subnets across 2+ AZs
- Private subnets for data plane (PostgreSQL, Kafka, Redis)
- Security groups with least-privilege ingress
- Isolated tenant workloads via namespace and IAM boundaries
- Bastion or SSM Session Manager access model
