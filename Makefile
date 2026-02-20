.PHONY: setup dev test lint up down load-test up-minimal validate-local

setup:
	npm install

dev:
	npm run dev

test:
	npm run test

lint:
	npm run lint

up:
	docker compose up -d --build

down:
	docker compose down -v

load-test:
	k6 run tests/load/k6-script.js

up-minimal:
	docker compose -f docker-compose.minimal.yml up -d --build

validate-local:
	./scripts/validate-local.sh
