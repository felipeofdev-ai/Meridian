# Resilience / Chaos Checklist

- Simulate collector restart during ingress load
- Simulate postgres failover to standby
- Simulate kafka broker unavailability and recovery
- Verify policy engine recovery and backlog catch-up
- Verify no chain-integrity regression after failover
