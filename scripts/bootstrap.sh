#!/usr/bin/env bash
set -euo pipefail
npm install
docker compose up -d postgres redis kafka opa collector policy-engine
