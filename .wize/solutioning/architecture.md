---
status: ready-for-stories
owner: Tony Stark
created: 2026-07-27
updated: 2026-07-27
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
workflowType: architecture
lastStep: 8
inputDocuments:
  - .wize/planning/brief.md
  - .wize/planning/prd.md
  - .wize/planning/ux/trigger-map.md
  - .wize/planning/ux/ux-scenarios.md
  - .wize/planning/ux/ux-design/index.md
  - .wize/planning/ux/ux-design/dashboard.md
  - .wize/planning/ux/ux-design/novo-orcamento.md
  - .wize/planning/ux/ux-design/selecionar-material.md
  - .wize/planning/ux/ux-design/visualizar-orcamento.md
  - .wize/planning/ux/ux-design/lista-orcamentos.md
  - .wize/planning/ux/ux-design/detalhes-orcamento.md
  - .wize/planning/ux/ux-design/converter-pedido.md
  - .wize/planning/ux/ux-design/lista-pedidos.md
  - .wize/planning/ux/ux-design/detalhes-pedido.md
  - .wize/planning/ux/ux-design/foto-anotacao.md
  - .wize/planning/ux/ux-design/tabela-precos.md
  - .wize/knowledge/document-project/overview.md
  - .wize/knowledge/document-project/architecture-snapshot.md
  - .wize/knowledge/document-project/conventions.md
  - .wize/knowledge/document-project/dependencies.md
  - .wize/knowledge/document-project/risk-spots.md
  - .wize/knowledge/document-project/open-questions.md
  - .wize/solutioning/adrs/ADR-001-backend-e-auth.md
---

# Architecture — Marmu

## Summary

React Native Android app (Expo SDK 53+) com backend Node.js + Express + TypeScript (API REST), autenticação JWT, PostgreSQL na nuvem, SQLite local como cache offline-first. Geração de PDF no device, compartilhamento WhatsApp, notificações push locais, foto-anotação com canvas. Arquitetura alterada por decisão do PO (ADR-001): adicionado backend e auth ao escopo original.

## Project Context Analysis

### Requirements Overview

**Functional Requirements (7 Épicos):**
- E01: Orçamento no local (medidas × material = preço calculado)
- E02: Tabela de preços configurável (CRUD de materiais)
- E03: Compartilhamento PDF/WhatsApp
- E04: Pedido e lembrete automático (push notification 2 dias antes)
- E05: Foto-anotação do projeto (canvas sobre imagem)
- E06: Histórico e busca de orçamentos
- E07: Dashboard resumido
- **E08 (novo):** Autenticação e perfil do gestor
- **E09 (novo):** Sincronização backend ↔ app

**Non-Functional Requirements:**
- Performance: startup ≤ 2s, cálculos ≤ 500ms
- Offline-first: 100% dos fluxos sem internet (com sync posterior)
- Segurança: SQLite criptografado (SQLCipher), HTTPS, JWT, bcrypt
- Acessibilidade: Material Design 3, touch targets ≥ 48dp
- LGPD: consentimento implícito, exportação/deleção de dados, criptografia em trânsito e repouso

**Scale & Complexity:**
- Primary domain: Mobile app (Android) + Backend API
- Complexity level: Medium-High (adicionou infraestrutura, auth, sync)
- Estimated architectural components: 12–15

### Technical Constraints & Dependencies
- Backend API REST (Node.js/Python — a definir)
- Banco de dados PostgreSQL (cloud)
- Autenticação JWT + refresh tokens
- React Native com SQLite local (cache offline)
- Sincronização: app funciona offline, sync quando online
- WhatsApp via Android Sharesheet/Intent
- PDF generation nativo no device
- Notificações locais via AlarmManager/WorkManager
- Hospedagem: Railway, Render, ou VPS (a definir)

### Cross-Cutting Concerns Identified
- Offline-first / sincronização (todos os fluxos)
- Autenticação e autorização (JWT)
- Criptografia de dados pessoais (LGPD) — local + cloud
- Geração e compartilhamento de PDF
- Notificações push locais agendadas
- Canvas de anotações sobre foto
- Backup automático na nuvem

## Starter Template Evaluation

### Primary Technology Domain
Full-stack mobile app: React Native (Android) + Node.js REST API + PostgreSQL

### Starter Options Considered

**Mobile (React Native):**
- **Expo Managed Workflow** (recomendado) — `npx create-expo-app@latest`
  - New Architecture ativada por padrão (JSI, Fabric, TurboModules)
  - Expo Router v3, EAS Build/Update/Submit
  - Config plugins (sem ejetar)
- **React Native CLI** — descartado; CLI é para casos edge (IoT, brownfield). Expo cobre 95% dos projetos em 2026.

**Backend (Node.js):**
- `KhaledSaeed18/node-express-boilerplate` — **SELECIONADO**
  - Node 22 + Express 5 + TypeScript 6 + Prisma 7 + PostgreSQL 16
  - JWT + refresh tokens + bcrypt + CSRF protection
  - Clean architecture com DI container
  - Docker + GitHub Actions CI/CD
  - Inclui `AGENTS.md` (AI-compatible)
- `haykal-fe-verd/express-starter` — alternativa com Redis e Scalar docs
- `sergiogalici/express_typescript_boilerplate` — opção mais leve

**Database:**
- **PostgreSQL** (selecionado) — dados estruturados (orçamentos, pedidos, materiais), JOINs nativos, relatórios fáceis
- MongoDB descartado — Marmu tem schema fixo; PostgreSQL evita inconsistências

**Hosting:**
- **Render** (recomendado para MVP) — free tier generoso, PostgreSQL incluso, deploy via Git
- Railway — alternativa simples
- AWS/GCP — descartado para MVP (complexidade desnecessária)

### Selected Starter

**Mobile:** `npx create-expo-app@latest marmu-app --template blank`
**Backend:** Fork de `KhaledSaeed18/node-express-boilerplate`

**Rationale:** Cavalcante já tem experiência com Node.js/Express — mesma linguagem (TypeScript) para app e backend. Prisma fornece type-safe ORM e migrações automáticas. PostgreSQL é robusto para dados estruturados de orçamentos e pedidos. Render oferece deploy zero-config para validar rapidamente com a CNC Mármores e Granitos.

**Initialization Commands:**
```bash
# Mobile
npx create-expo-app@latest marmu-app --template blank

# Backend
git clone https://github.com/KhaledSaeed18/node-express-boilerplate.git marmu-api
cd marmu-api && npm install
```

**Architectural Decisions Provided by Starter:**
- Language & Runtime: TypeScript 6 + Node.js 22 (LTS)
- API Framework: Express 5 com middleware pattern
- ORM: Prisma 7 com PostgreSQL driver
- Auth: JWT (access + refresh) + bcrypt hashing + CSRF tokens
- Architecture: Clean/Layered com DI container (Inversify)
- Validation: Zod 4 (runtime schema validation)
- Logging: Pino (structured logging)
- Testing: Vitest + Supertest
- Docs: Swagger/OpenAPI auto-generated
- Security: Helmet, CORS, rate limiting, CSRF protection
- Build: Docker multi-stage + GitHub Actions CI/CD

## Stack (Confirmado)

- Language: TypeScript (React Native + Node.js)
- Front-end: React Native (Expo SDK 53+, Android foco)
- Back-end: Node.js + Express 5 + TypeScript 6
- ORM: Prisma 7
- DB Local: SQLite (react-native-sqlite-storage) + SQLCipher
- DB Cloud: PostgreSQL 16 (Render)
- Auth: JWT (access + refresh tokens) + bcrypt
- Hosting: Render (backend) + EAS (mobile builds)
- Observability: Pino (backend) + A definir (mobile)
- Test: Vitest + Supertest (backend) + Jest (mobile)

## Components

| Component | Responsibility | Boundary |
|---|---|---|

## Data model

{{A preencher nos próximos passos}}

## Sequences

{{A preencher nos próximos passos}}

## Cross-cutting concerns

{{A preencher nos próximos passos}}

## NFR check

{{A preencher nos próximos passos — referenciar nfr-principles.md quando criado por Fury}}

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (block implementation):**
- Data Architecture: PostgreSQL (cloud) + SQLite (local) + Prisma ORM
- Authentication: JWT (access + refresh) + bcrypt
- Offline-first strategy: SQLite cache + sync queue

**Important Decisions (shape architecture):**
- API style: REST + JSON
- State management: Zustand (local) + TanStack Query (server)
- Storage: MMKV (app) + SQLCipher (SQLite)
- PDF generation: react-native-html-to-pdf (device-native)
- Notifications: Notifee (local scheduled)

**Deferred Decisions (post-MVP):**
- Monitoring/observability (Datadog, Sentry)
- Scaling strategy (load balancing, read replicas)
- Dark mode / theming
- iOS support
- Multi-user / team accounts

### Data Architecture

| Decision | Choice | Version | Rationale | Affects |
|---|---|---|---|---|
| Database (cloud) | PostgreSQL | 16 | Structured data, relational integrity, reporting | Backend, migrations |
| Database (local) | SQLite | 3 | Offline-first cache, zero-config | Mobile app |
| Local encryption | SQLCipher | 4 | LGPD compliance, data-at-rest protection | Mobile app |
| ORM | Prisma | 7 | Type-safe, auto-migrations | Backend |
| Validation | Zod | 4 | Runtime schema validation | Backend + Mobile |
| Migrations | Prisma Migrate | — | Versioned schema changes | Backend |
| Caching | SQLite read-through | — | Offline-first, sync when online | Mobile app |

### Authentication & Security

| Decision | Choice | Version | Rationale | Affects |
|---|---|---|---|---|
| Auth method | JWT | RFC 7519 | Stateless, mobile-friendly | API, Mobile |
| Token types | Access + Refresh | — | Security + UX balance | API, Mobile |
| Password hashing | bcrypt | cost 12 | Industry standard | Backend |
| Transport | HTTPS | TLS 1.3 | Required by LGPD | All communication |
| API security | Helmet + CORS + rate limiting | — | OWASP protection | Backend |
| CSRF protection | CSRF tokens | — | Starter-provided | Backend |

### API & Communication Patterns

| Decision | Choice | Version | Rationale | Affects |
|---|---|---|---|---|
| API style | REST + JSON | — | Simple, universal, well-supported | Backend, Mobile |
| Error format | RFC 7807 Problem Details | — | Standardized error responses | Backend |
| Rate limiting | 100 req/min per IP | — | Abuse prevention | Backend |
| Offline sync | Local queue + background sync | — | UX-first, data integrity | Mobile |
| Real-time | Polling (deferred to post-MVP) | — | WebSocket not needed for MVP | — |

### Frontend Architecture

| Decision | Choice | Version | Rationale | Affects |
|---|---|---|---|---|
| Framework | React Native (Expo) | SDK 53+ | Rapid setup, OTA updates | Mobile app |
| Router | Expo Router | v3 | File-system based | Mobile navigation |
| Local state | Zustand | — | Lightweight, performant | Mobile app |
| Server state | TanStack Query (React Query) | v5 | Intelligent caching, sync | Mobile app |
| Local storage | MMKV | — | Sync via JSI, faster than AsyncStorage | Mobile app |
| PDF generation | react-native-html-to-pdf | — | Device-native, offline capable | Mobile app |
| Notifications | Notifee | — | Local scheduling, Android-native | Mobile app |
| Photo annotation | react-native-svg + image-picker | — | Simple canvas over photo | Mobile app |

### Infrastructure & Deployment

| Decision | Choice | Version | Rationale | Affects |
|---|---|---|---|---|
| Backend hosting | Render | — | Generous free tier, Git-based deploy | Backend |
| Mobile builds | EAS (Expo) | — | Cloud CI/CD, OTA updates | Mobile app |
| CI/CD | GitHub Actions | — | Starter-provided pipelines | All |
| Logging | Pino | — | Structured, JSON logs | Backend |
| Monitoring | Deferred | — | MVP focus on features | — |

### Decision Impact Analysis

**Implementation Sequence:**
1. Backend: Setup Express + Prisma + PostgreSQL + JWT auth
2. Mobile: Setup Expo + SQLite + offline-first structure
3. Integration: Login + basic sync
4. Feature: E01 (Orçamento no local)
5. Feature: E02 (Tabela de preços)
6. Feature: E03 (Compartilhamento)
7. Feature: E04 (Pedido + lembrete)
8. Feature: E05 (Foto-anotação)
9. Feature: E06 (Histórico + busca)
10. Feature: E07 (Dashboard)
11. Polish: Tests, performance, UX refinements

**Cross-Component Dependencies:**
- SQLite local must be ready before any offline-first feature can be tested
- JWT auth must be implemented before any protected endpoint
- Sync mechanism depends on both SQLite (mobile) and REST API (backend)
- PDF generation and photo annotation are device-native and can be developed in parallel

## Implementation Patterns & Consistency Rules

### Naming Patterns

| Scope | Pattern | Example |
|---|---|---|
| DB tables | snake_case, plural | `orcamentos`, `materiais`, `pedidos`, `usuarios` |
| DB columns | snake_case | `preco_por_m2`, `data_entrega`, `created_at` |
| API endpoints | kebab-case, REST plural | `GET /api/v1/orcamentos`, `POST /api/v1/materiais` |
| Files (backend) | camelCase/PascalCase (classes) | `orcamentoService.ts`, `AuthController.ts` |
| Files (mobile) | PascalCase (components), camelCase (utils) | `NovoOrcamento.tsx`, `calcularArea.ts` |
| Variables | camelCase | `precoSugerido`, `dataEntrega` |
| Constants | UPPER_SNAKE_CASE | `MAX_RETRIES`, `DEFAULT_VALIDADE_DIAS` |
| Route params | camelCase | `/orcamentos/:orcamentoId` |
| Event names | camelCase, domain:action | `orcamento:saved`, `pedido:entregue`, `sync:completed` |

### Structure Patterns

**Backend (`marmu-api/`):**
```
src/
├── controllers/      # Request/response handlers
├── services/         # Business logic
├── repositories/     # DB access (Prisma)
├── middlewares/      # Auth, validation, error handling
├── routes/           # Route definitions
├── models/           # TypeScript types/interfaces
├── utils/            # Helpers (formatters, validators)
├── config/           # Environment, DB connection
└── tests/            # Mirror src/ structure
```

**Mobile (`marmu-app/`):**
```
src/
├── screens/          # One per UX spec
├── components/       # Reusable UI components
├── hooks/            # Custom React hooks
├── stores/           # Zustand stores
├── services/         # API calls (TanStack Query)
├── db/               # SQLite schema, migrations, queries
├── utils/            # Helpers (formatters, validators)
├── types/            # TypeScript types
└── assets/           # Images, fonts
```

### Format Patterns

**API Response Wrapper:**
```json
{
  "success": true,
  "data": { ... },
  "meta": { "timestamp": "2026-07-27T10:00:00Z" }
}
```

**API Error Response (RFC 7807):**
```json
{
  "type": "https://api.marmu.app/errors/validation-failed",
  "title": "Validation Failed",
  "status": 400,
  "detail": "Medida deve ser maior que zero",
  "instance": "/api/v1/orcamentos",
  "errors": { "comprimento": "Deve ser > 0" }
}
```

**Date/Time:**
- Backend: ISO 8601 UTC (`2026-07-27T10:00:00Z`)
- Mobile display: Brazilian format (`27/07/2026`)
- Storage: always UTC; conversion at UI layer

**JSON Field Naming:**
- API: snake_case (`preco_por_m2`)
- Mobile: camelCase (`precoPorM2`)
- Conversion in service layer (axios interceptor)

### Communication Patterns

**Event Naming:**
- Format: `domain:action:status`
- Examples: `orcamento:saved:success`, `sync:started`, `auth:login:failed`

**Event Payload:**
```typescript
interface AppEvent {
  type: string;
  payload: unknown;
  timestamp: number;
  correlationId: string;
}
```

**State Update (Zustand):**
```typescript
// Actions always named with verb
setPrecoSugerido(preco: number)     // ✅
updateOrcamento(orcamento)          // ✅
// Anti-pattern: direct mutation
// orcamento.preco = 420           // ❌
```

**Logging (Backend — Pino):**
```json
{
  "level": "info",
  "msg": "Orçamento criado",
  "orcamento_id": "uuid",
  "usuario_id": "uuid",
  "timestamp": "2026-07-27T10:00:00Z"
}
```

### Process Patterns

**Loading States:**
- Skeleton screens for lists (never standalone spinner)
- Inline spinners for buttons (CTA disabled during submit)
- Toast "Sincronizando..." for background sync

**Error Recovery:**
- Automatic retry: 3 attempts with exponential backoff (1s, 2s, 4s)
- Offline fallback: use local data if API fails
- Toast/snackbar for non-fatal errors; modal for fatal errors

**Validation Timing:**
- Numeric fields: validate onBlur (not onChange, to avoid flashes)
- Required fields: validate onSubmit
- Backend: ALWAYS validate (Zod), even if frontend validated

**Authentication Flow:**
```
1. App: POST /auth/login {email, senha}
2. Backend: returns {accessToken, refreshToken}
3. App: stores tokens in MMKV (encrypted)
4. App: sends accessToken in Authorization: Bearer {token}
5. App: automatic refresh when accessToken expires (401)
6. Logout: clears local tokens + calls POST /auth/logout
```

**Sync Offline→Online:**
```
1. App detects connection (NetInfo)
2. Fetches pending records from SQLite (status: 'pending_sync')
3. Sends to API in batch
4. API returns success/error per record
5. App updates local status
6. If error: keeps 'pending_sync', retry on next connection
```

### Enforcement Guidelines

**All AI agents MUST:**
- Use TypeScript strict mode (`strict: true` in tsconfig)
- Follow naming conventions defined above
- Never expose tokens/secrets in logs
- Always validate inputs on backend (even if frontend validates)
- Never mutate state directly (use setters/actions)
- Write tests for services and repositories
- Document technical decisions in ADRs if deviating from standard

### Pattern Examples

**Good:**
```typescript
// Backend
const orcamento = await orcamentoRepository.create({
  clienteNome: body.cliente_nome,
  comprimento: body.comprimento,
});

// Mobile
const useOrcamentoStore = create<OrcamentoStore>((set) => ({
  orcamentos: [],
  adicionarOrcamento: (orcamento) =>
    set((state) => ({ orcamentos: [...state.orcamentos, orcamento] })),
}));
```

**Anti-patterns:**
```typescript
// ❌ Never — SQL injection risk
db.query("INSERT INTO orcamentos VALUES (...)");

// ❌ Never — direct mutation
state.orcamentos.push(orcamento);

// ❌ Never — credential leak
console.log(`Token: ${accessToken}`);

// ❌ Never — frontend authorization
if (user.role === 'admin') { ... }
```

## Project Structure & Boundaries

### Complete Project Directory Structure

**Monorepo root:**
```
marmu/
├── .wize/                          # Kit artifacts
│   └── ...
├── apps/
│   ├── mobile/                      # React Native (Expo)
│   │   ├── src/
│   │   │   ├── screens/
│   │   │   │   ├── Dashboard.tsx
│   │   │   │   ├── NovoOrcamento.tsx
│   │   │   │   ├── SelecionarMaterial.tsx
│   │   │   │   ├── VisualizarOrcamento.tsx
│   │   │   │   ├── ListaOrcamentos.tsx
│   │   │   │   ├── DetalhesOrcamento.tsx
│   │   │   │   ├── ConverterPedido.tsx
│   │   │   │   ├── ListaPedidos.tsx
│   │   │   │   ├── DetalhesPedido.tsx
│   │   │   │   ├── FotoAnotacao.tsx
│   │   │   │   ├── TabelaPrecos.tsx
│   │   │   │   ├── Login.tsx
│   │   │   │   └── Configuracoes.tsx
│   │   │   ├── components/
│   │   │   │   ├── ui/            # Reusable (Button, Input, Card)
│   │   │   │   └── features/      # Domain-specific
│   │   │   │       ├── OrcamentoCard.tsx
│   │   │   │       ├── PedidoCard.tsx
│   │   │   │       ├── MaterialPicker.tsx
│   │   │   │       └── PdfPreview.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useAuth.ts
│   │   │   │   ├── useOrcamento.ts
│   │   │   │   ├── useSync.ts
│   │   │   │   └── useOffline.ts
│   │   │   ├── stores/
│   │   │   │   ├── authStore.ts
│   │   │   │   ├── orcamentoStore.ts
│   │   │   │   ├── pedidoStore.ts
│   │   │   │   └── materialStore.ts
│   │   │   ├── services/
│   │   │   │   ├── api.ts         # Axios instance + interceptors
│   │   │   │   ├── authService.ts
│   │   │   │   ├── orcamentoService.ts
│   │   │   │   ├── pedidoService.ts
│   │   │   │   └── syncService.ts
│   │   │   ├── db/
│   │   │   │   ├── schema.ts      # SQLite schema (SQLCipher)
│   │   │   │   ├── migrations/
│   │   │   │   └── queries/
│   │   │   ├── utils/
│   │   │   │   ├── formatters.ts
│   │   │   │   ├── validators.ts
│   │   │   │   └── constants.ts
│   │   │   └── types/
│   │   │       ├── models.ts
│   │   │       └── api.ts
│   │   ├── assets/
│   │   ├── App.tsx
│   │   ├── app.json
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── api/                         # Backend (Node.js + Express)
│       ├── src/
│       │   ├── controllers/
│       │   │   ├── authController.ts
│       │   │   ├── orcamentoController.ts
│       │   │   ├── pedidoController.ts
│       │   │   ├── materialController.ts
│       │   │   └── usuarioController.ts
│       │   ├── services/
│       │   │   ├── authService.ts
│       │   │   ├── orcamentoService.ts
│       │   │   ├── pedidoService.ts
│       │   │   ├── materialService.ts
│       │   │   └── usuarioService.ts
│       │   ├── repositories/
│       │   │   ├── orcamentoRepository.ts
│       │   │   ├── pedidoRepository.ts
│       │   │   ├── materialRepository.ts
│       │   │   └── usuarioRepository.ts
│       │   ├── middlewares/
│       │   │   ├── authMiddleware.ts
│       │   │   ├── errorHandler.ts
│       │   │   ├── validateRequest.ts
│       │   │   └── rateLimiter.ts
│       │   ├── routes/
│       │   │   ├── authRoutes.ts
│       │   │   ├── orcamentoRoutes.ts
│       │   │   ├── pedidoRoutes.ts
│       │   │   ├── materialRoutes.ts
│       │   │   └── usuarioRoutes.ts
│       │   ├── models/
│       │   │   ├── Orcamento.ts
│       │   │   ├── Pedido.ts
│       │   │   ├── Material.ts
│       │   │   └── Usuario.ts
│       │   ├── utils/
│       │   │   ├── jwt.ts
│       │   │   ├── password.ts
│       │   │   ├── logger.ts
│       │   │   └── errors.ts
│       │   ├── config/
│       │   │   ├── database.ts
│       │   │   └── env.ts
│       │   ├── app.ts
│       │   └── server.ts
│       ├── prisma/
│       │   ├── schema.prisma
│       │   └── migrations/
│       ├── tests/
│       │   ├── integration/
│       │   │   ├── auth.test.ts
│       │   │   ├── orcamentos.test.ts
│       │   │   └── pedidos.test.ts
│       │   └── unit/
│       ├── Dockerfile
│       ├── docker-compose.yml
│       ├── package.json
│       └── tsconfig.json
├── package.json
└── README.md
```

### Architectural Boundaries

| Boundary | Definition | Rule |
|---|---|---|
| **API / Mobile** | REST JSON over HTTPS | Mobile only consumes API; no direct DB access |
| **Service / Repository** | Business logic vs DB access | Services call repositories; controllers don't access DB |
| **Screen / Component** | Screen = route; Component = reusable | Screens orchestrate; Components render |
| **Store / Service** | Store = local state; Service = API/DB | Stores consume services; UI consumes stores |
| **Online / Offline** | NetInfo detects; SQLite caches | All writes go to SQLite first; sync pushes to API |

### Requirements to Structure Mapping

| Epic | Mobile Screens | Mobile Services | Mobile Stores | API Routes | DB Tables |
|---|---|---|---|---|---|
| **E01 — Orçamento** | `NovoOrcamento`, `SelecionarMaterial`, `VisualizarOrcamento` | `orcamentoService` | `orcamentoStore` | `POST /orcamentos`, `GET /orcamentos/:id` | `orcamentos` |
| **E02 — Tabela** | `TabelaPrecos`, `SelecionarMaterial` | `materialService` | `materialStore` | `GET /materiais`, `POST /materiais` | `materiais` |
| **E03 — PDF/WhatsApp** | `VisualizarOrcamento` | `pdfService` (native) | — | — | — |
| **E04 — Pedido** | `ConverterPedido`, `DetalhesPedido` | `pedidoService` | `pedidoStore` | `POST /pedidos`, `GET /pedidos/:id` | `pedidos` |
| **E05 — Foto** | `FotoAnotacao` | `photoService` (native) | — | — | `pedidos` (foto_url) |
| **E06 — Histórico** | `ListaOrcamentos`, `DetalhesOrcamento` | `orcamentoService` | `orcamentoStore` | `GET /orcamentos` | `orcamentos` |
| **E07 — Dashboard** | `Dashboard` | `dashboardService` | `orcamentoStore`, `pedidoStore` | `GET /orcamentos`, `GET /pedidos` | `orcamentos`, `pedidos` |
| **E08 — Auth** | `Login`, `Configuracoes` | `authService` | `authStore` | `POST /auth/login`, `POST /auth/logout` | `usuarios` |
| **E09 — Sync** | Background | `syncService` | `authStore` | Batch endpoints | — |

### Integration Points

| Integration | Protocol | Data Format | Auth |
|---|---|---|---|
| Mobile ↔ API REST | HTTPS + JSON | snake_case | Bearer JWT |
| Mobile ↔ SQLite | react-native-sqlite-storage | camelCase | SQLCipher |
| Mobile ↔ WhatsApp | Android Intent (ACTION_SEND) | PDF | None |
| Mobile ↔ PDF | react-native-html-to-pdf | Binary | None |
| Mobile ↔ Notifications | Notifee (local) | Scheduled alarm | None |
| API ↔ PostgreSQL | Prisma Client | Prisma models | Connection string |

### File Organization Patterns
- One screen per file: cada tela do UX design é um componente Screen
- One service per domain: `orcamentoService`, `pedidoService`, etc.
- One store per domain: Zustand stores separados
- Repository pattern: backend repositories encapsulam Prisma queries
- Shared types: `types/models.ts` define interfaces compartilhadas

## Architecture Validation Results

### Coherence Validation

| Aspect | Status | Notes |
|---|---|---|
| **Decision compatibility** | ✅ PASS | Todas as decisões são consistentes: backend REST + JWT + PostgreSQL + React Native offline-first |
| **Pattern consistency** | ✅ PASS | Naming conventions, estrutura de pastas, e padrões de comunicação alinhados |
| **Structure alignment** | ✅ PASS | Cada tela do UX design mapeia para um componente Screen; cada epic mapeia para services/stores/routes |

### Requirements Coverage Validation

**Functional Requirements (Épicos):**

| Epic | Architecture Coverage | Status |
|---|---|---|
| E01 — Orçamento no local | `NovoOrcamento` screen + `orcamentoService` + `POST /orcamentos` + SQLite | ✅ |
| E02 — Tabela de preços | `TabelaPrecos` screen + `materialService` + `GET/POST /materiais` | ✅ |
| E03 — Compartilhamento | `VisualizarOrcamento` + react-native-html-to-pdf + WhatsApp intent | ✅ |
| E04 — Pedido e lembrete | `ConverterPedido` + `pedidoService` + Notifee local notifications | ✅ |
| E05 — Foto-anotação | `FotoAnotacao` + react-native-svg + react-native-image-picker | ✅ |
| E06 — Histórico de orçamentos | `ListaOrcamentos` + `orcamentoStore` + busca SQLite | ✅ |
| E07 — Dashboard resumido | `Dashboard` screen + aggregações SQLite/PostgreSQL | ✅ |
| E08 — Auth (novo) | `Login` screen + `authService` + JWT + MMKV | ✅ |
| E09 — Sync (novo) | `syncService` + background queue + batch API | ✅ |

**Non-Functional Requirements:**

| NFR | Architecture Coverage | Status |
|---|---|---|
| Performance ≤ 2s startup | Expo SDK 53 + Hermes + SQLite local cache | ✅ |
| Offline-first 100% | SQLite + SQLCipher + sync queue | ✅ |
| Segurança/LGPD | HTTPS + JWT + bcrypt + SQLCipher + export/deleção dados | ✅ |
| Acessibilidade | Material Design 3 + 48dp touch targets + TalkBack | ✅ |

### Implementation Readiness Validation

| Item | Status |
|---|---|
| Stack completo definido | ✅ |
| Starters selecionados (Expo + node-express-boilerplate) | ✅ |
| Decisões core documentadas | ✅ |
| Patterns de implementação definidos | ✅ |
| Estrutura de pastas completa | ✅ |
| Mapeamento épicos ↔ componentes | ✅ |
| Pontos de integração mapeados | ✅ |

### Gap Analysis Results

| Gap | Prioridade | Impacto | Ação |
|---|---|---|---|
| Design System não existe | Importante | UI inconsistente se não definido | Criar em `wize-design-system` (Mantis) |
| NFR principles (Fury) não criados | Importante | Falta referência para performance/segurança | Chamar `wize-nfr-principles` |
| Tech Vision (Fury) não criado | Importante | Falta visão estratégica técnica | Chamar `wize-tech-vision` |
| Test strategy não detalhado | Nice-to-have | Pode afetar qualidade | Definir em `wize-tea-risk` |
| Observability/monitoring | Nice-to-have | MVP pode rodar sem | Post-MVP |

### Validation Issues Addressed

1. **Backend adicionado ao escopo original** — Documentado em ADR-001
2. **Escolha PostgreSQL vs MongoDB** — PostgreSQL por dados estruturados e JOINs
3. **Expo vs CLI** — Expo recomendado para 95% dos projetos em 2026
4. **Offline-first com backend** — Pattern de sync queue definido

### Architecture Completeness Checklist

**Requirements Analysis**
- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed
- [x] Technical constraints identified
- [x] Cross-cutting concerns mapped

**Architectural Decisions**
- [x] Critical decisions documented with versions
- [x] Technology stack fully specified
- [x] Integration patterns defined
- [x] Performance considerations addressed

**Implementation Patterns**
- [x] Naming conventions established
- [x] Structure patterns defined
- [x] Communication patterns specified
- [x] Process patterns documented

**Project Structure**
- [x] Complete directory structure defined
- [x] Component boundaries established
- [x] Integration points mapped
- [x] Requirements to structure mapping complete

### Architecture Readiness Assessment

**Overall Status:** READY WITH MINOR GAPS
**Confidence Level:** HIGH
**Key Strengths:** Stack moderno e bem documentado; offline-first resolvido; autenticação segura; estrutura clara para múltiplos agentes
**Areas for Future Enhancement:** Design system, NFR principles, monitoring (post-MVP)

### Implementation Handoff

**AI Agent Guidelines:**
- Follow all architectural decisions exactly as documented
- Use implementation patterns consistently
- Respect project structure and boundaries
- Refer to this document for all architectural questions
- Priorizar épicos E01–E03 (core do valor) no MVP

## ADRs

See `.wize/solutioning/adrs/`.
- ADR-001: Backend e autenticação — decisão do PO Cavalcante
