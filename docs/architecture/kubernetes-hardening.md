# Kubernetes Runtime Hardening

## Container Baseline
- Distroless base images for production workloads
- Run as non-root (`runAsNonRoot: true`, explicit UID/GID)
- Read-only root filesystem
- Drop all Linux capabilities except explicitly required

## Kernel / Runtime Controls
- Seccomp profile: `RuntimeDefault` (or stricter custom profile)
- AppArmor profile enforced on all workloads
- Disable privilege escalation

## Pod Security Context Example
```yaml
securityContext:
  runAsNonRoot: true
  runAsUser: 10001
  runAsGroup: 10001
  fsGroup: 10001
  seccompProfile:
    type: RuntimeDefault
containers:
  - name: collector
    securityContext:
      readOnlyRootFilesystem: true
      allowPrivilegeEscalation: false
      capabilities:
        drop: ["ALL"]
```

## Network Controls
- Default deny NetworkPolicy per namespace
- Explicit egress allow-list for dependencies
- Ingress restricted to API gateway/load balancer paths
