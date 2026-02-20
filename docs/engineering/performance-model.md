# Performance & Scalability Model

## Target Throughput
- Baseline: 200 events/sec sustained
- Burst: 1,000 events/sec for 5-minute windows

## Latency SLO
- p95 ingest latency < 2s
- p99 policy evaluation latency < 5s

## Horizontal Scaling
- Collector scales statelessly behind load balancer
- Kafka partitions scale ingestion fan-out
- Read replicas scale reporting workloads

## Load Testing Methodology
1. Warm-up phase (5 min) with representative payloads
2. Sustained phase (30 min) at baseline load
3. Stress phase (10x spike) for burst validation
4. Cooldown and recovery measurement

## Required Outputs
- Throughput sustained (events/sec)
- p50/p95/p99 latency
- Error rate and retry rate
- Resource usage profile (CPU/memory)

## Runbooks
- `k6 run tests/load/k6-script.js`
- Archive run report under `reports/` with timestamp
