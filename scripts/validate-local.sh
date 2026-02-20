#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

REPORT_DIR="reports"
mkdir -p "$REPORT_DIR"
REPORT_FILE="$REPORT_DIR/local-validation-report.md"

pass() { echo "✅ $1" | tee -a "$REPORT_FILE"; }
warn() { echo "⚠️ $1" | tee -a "$REPORT_FILE"; }
fail() { echo "❌ $1" | tee -a "$REPORT_FILE"; exit 1; }

: > "$REPORT_FILE"
echo "# Local Validation Report" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"
echo "Generated at: $(date -u +%Y-%m-%dT%H:%M:%SZ)" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

if command -v npm >/dev/null 2>&1; then
  if npm install; then
    pass "npm install"
  else
    warn "npm install failed (check registry/network/proxy)"
  fi
else
  warn "npm not found"
fi

if command -v docker >/dev/null 2>&1; then
  if docker compose up -d --build postgres collector; then
    pass "docker compose up -d --build postgres collector"
  else
    fail "docker compose up failed"
  fi
else
  fail "docker CLI not found"
fi

sleep 5

if curl -fsS "http://localhost:8080/metrics" >/tmp/meridian-metrics.out; then
  pass "GET /metrics"
else
  fail "Collector /metrics unavailable"
fi

PAYLOAD='{"organization":"acme","action":"push","branch":"main"}'
if curl -fsS -X POST "http://localhost:8080/webhooks/gitlab" \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Id: acme" \
  -H "X-Api-Key: acme-key" \
  -H "X-Gitlab-Event: Push Hook" \
  -H "X-Gitlab-Token: dev-gitlab-token" \
  -d "$PAYLOAD" >/tmp/meridian-webhook.out; then
  pass "POST /webhooks/gitlab"
else
  fail "Webhook ingest failed"
fi

if curl -fsS "http://localhost:8080/audit/integrity?tenant_id=acme" >/tmp/meridian-integrity.out; then
  pass "GET /audit/integrity?tenant_id=acme"
else
  fail "Integrity endpoint failed"
fi

if curl -fsS "http://localhost:8080/audit/export?tenant_id=acme" >/tmp/meridian-export.json; then
  pass "GET /audit/export?tenant_id=acme"
else
  fail "Audit export failed"
fi

if node apps/cli/meridian.js verify --bundle /tmp/meridian-export.json --key dev-export-signing-key >/tmp/meridian-verify.out; then
  pass "CLI verify audit export"
else
  fail "CLI verification failed"
fi

echo "" >> "$REPORT_FILE"
echo "## Artifacts" >> "$REPORT_FILE"
echo "- /tmp/meridian-metrics.out" >> "$REPORT_FILE"
echo "- /tmp/meridian-webhook.out" >> "$REPORT_FILE"
echo "- /tmp/meridian-integrity.out" >> "$REPORT_FILE"
echo "- /tmp/meridian-export.json" >> "$REPORT_FILE"
echo "- /tmp/meridian-verify.out" >> "$REPORT_FILE"

pass "Local validation flow complete"
