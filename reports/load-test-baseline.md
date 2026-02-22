# Load Test Baseline Report

- Tool: k6
- Script: `tests/load/k6-script.js`
- Target: Collector webhook ingestion endpoint

## Planned thresholds
- p95 < 2s
- p99 < 5s
- error rate < 1%

## Run command
```bash
k6 run tests/load/k6-script.js
```

## Notes
Populate this report with measured values after executing in an environment with Docker + dependencies available.
