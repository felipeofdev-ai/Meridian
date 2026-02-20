# Meridian Event Collector Blueprint (MVP Fase 1)

## 1. Objetivo

O **Event Collector** é a porta de entrada de eventos de Git providers (GitHub/GitLab) no Meridian.
Ele precisa garantir:

- ingestão confiável de webhooks;
- normalização em um formato canônico;
- trilha imutável com hash encadeado;
- persistência append-only;
- verificabilidade criptográfica para auditoria.

---

## 2. Escopo do MVP

### Incluído

- `POST /webhooks/github`
- `POST /webhooks/gitlab`
- validação de assinatura dos providers
- normalizador universal (`CanonicalEvent`)
- cálculo de hash de evento
- encadeamento por `previous_hash`
- persistência no `audit_events`
- endpoint de verificação de integridade

### Fora do escopo inicial

- Kafka / filas distribuídas
- deduplicação global multi-região
- assinatura assimétrica por HSM
- replay/backfill massivo

---

## 3. Arquitetura lógica

```text
GitHub/GitLab Webhook
        |
        v
+--------------------------+
| FastAPI Collector        |
| - Signature Validator    |
| - Provider Adapter       |
| - Canonical Normalizer   |
+--------------------------+
        |
        v
+--------------------------+
| Chain Hasher             |
| - previous_hash lookup   |
| - event_hash generation  |
+--------------------------+
        |
        v
+--------------------------+
| Immutable Audit Store    |
| PostgreSQL append-only   |
+--------------------------+
        |
        v
+--------------------------+
| Integrity Verifier API   |
+--------------------------+
```

---

## 4. Contratos de API

### 4.1 GitHub webhook

- **Endpoint:** `POST /webhooks/github`
- **Headers obrigatórios:**
  - `X-GitHub-Event`
  - `X-GitHub-Delivery`
  - `X-Hub-Signature-256`
- **Validação:** HMAC SHA-256 com segredo por tenant

Resposta:

- `202 Accepted` quando persistido
- `401 Unauthorized` para assinatura inválida
- `422 Unprocessable Entity` para payload inválido

### 4.2 GitLab webhook

- **Endpoint:** `POST /webhooks/gitlab`
- **Headers obrigatórios:**
  - `X-Gitlab-Event`
  - `X-Gitlab-Token`
- **Validação:** token compartilhado por tenant

Resposta:

- `202 Accepted` quando persistido
- `401 Unauthorized` para token inválido
- `422 Unprocessable Entity` para payload inválido

### 4.3 Integridade

- **Endpoint:** `GET /audit/integrity?tenant_id=...&from=...&to=...`
- **Função:** valida sequência de hashes no intervalo

Resposta exemplo:

```json
{
  "tenant_id": "acme",
  "checked_events": 12453,
  "valid": true,
  "first_event_id": "...",
  "last_event_id": "..."
}
```

---

## 5. Modelo canônico de evento

```json
{
  "event_id": "uuid-v7",
  "tenant_id": "string",
  "provider": "github|gitlab",
  "event_type": "push|pull_request|merge_request|...",
  "occurred_at": "RFC3339",
  "received_at": "RFC3339",
  "repository": {
    "id": "string",
    "name": "string",
    "full_name": "org/repo",
    "default_branch": "main"
  },
  "actor": {
    "id": "string",
    "username": "string",
    "email": "optional"
  },
  "raw_payload": {"...": "original provider payload"},
  "metadata": {
    "delivery_id": "provider delivery id",
    "source_ip": "ip",
    "headers": {"...": "subset non-sensitive"}
  }
}
```

### Regras de normalização

1. Preservar payload original (`raw_payload`) para auditoria forense.
2. Converter datas para UTC (`RFC3339`).
3. Definir chaves estáveis para hashing (JSON canônico com ordenação determinística).
4. Não descartar campos críticos de segurança (ator, repo, tipo de evento, origem).

---

## 6. Audit Store imutável

### 6.1 Tabela base

```sql
CREATE TABLE audit_events (
  id UUID PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  provider TEXT NOT NULL,
  event_type TEXT NOT NULL,
  previous_hash TEXT,
  event_hash TEXT NOT NULL,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 6.2 Regras de imutabilidade

- Sem `UPDATE` e sem `DELETE` para `audit_events` (somente `INSERT`).
- Trigger bloqueando mutações.
- Permissões separadas:
  - role `collector_writer`: apenas `INSERT`
  - role `auditor_reader`: apenas `SELECT`

---

## 7. Hash chain (block-like)

### 7.1 Algoritmo

Para cada novo evento `E_n`:

1. Buscar o último `event_hash` do tenant (`H_{n-1}`).
2. Canonicalizar payload para string determinística `P_n`.
3. Calcular `H_n = SHA256(tenant_id || provider || event_type || occurred_at || P_n || H_{n-1})`.
4. Persistir `previous_hash = H_{n-1}` e `event_hash = H_n`.

### 7.2 Verificação

`verify_chain_integrity(tenant_id, from, to)`:

- ordena eventos por `created_at, id`;
- recalcula cada hash;
- compara com `event_hash` armazenado;
- valida vínculo com `previous_hash` do próximo.

Se qualquer divergência: `valid = false` e reporta primeiro ponto de quebra.

---

## 8. Implementação FastAPI (estrutura sugerida)

```text
apps/collector/
  app/
    main.py
    api/
      webhooks.py
      integrity.py
    domain/
      canonical_event.py
      normalizers/
        github.py
        gitlab.py
      hashing.py
      integrity.py
    infrastructure/
      db.py
      repositories/
        audit_repository.py
      security/
        signatures.py
```

---

## 9. Segurança mínima obrigatória

- TLS obrigatório em trânsito.
- Segredos por tenant (GitHub/GitLab webhook secret/token).
- Rotação de segredos sem downtime.
- Sanitização de headers sensíveis antes de persistir metadados.
- Rate limiting por tenant e por IP.
- Logs estruturados com `trace_id`.

---

## 10. Observabilidade

Métricas recomendadas:

- `collector_webhook_requests_total{provider,status}`
- `collector_webhook_latency_ms{provider}`
- `collector_signature_failures_total{provider}`
- `collector_chain_integrity_failures_total{tenant}`
- `collector_persist_errors_total`

Tracing:

- span por requisição de webhook
- span de validação
- span de normalização
- span de persistência

---

## 11. Critérios de aceite do MVP

1. Receber eventos de GitHub e GitLab com autenticação válida.
2. Persistir todos os eventos aceitos em tabela append-only.
3. Encadear hashes por tenant sem lacunas.
4. Detectar adulteração via `verify_chain_integrity`.
5. Expor evidência auditável do status da cadeia.

---

## 12. Próximo passo recomendado

Após concluir o Collector MVP:

1. Implementar `Immutable Audit Store` com hardening SQL (trigger + roles + backup WORM).
2. Integrar `Policy Engine` (OPA) consumindo `CanonicalEvent`.
3. Persistir decisão de policy e alimentar `Compliance Scoring Engine`.
