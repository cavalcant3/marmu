# Epics & Stories Index — Marmu

> Todos os épicos e histórias mapeados do PRD para implementação.

## Epics Summary

| # | Epic | Stories | Trigger | Priority |
|---|---|---|---|---|
| 01 | Setup e Autenticação | 7 | Foundation | 1 |
| 02 | Orçamento no Local (Core) | 8 | T1 | 2 |
| 03 | Pedidos e Lembretes | 6 | T2, T3 | 3 |
| 04 | Dashboard, Histórico e Busca | 4 | T5, T6 | 4 |
| 05 | Foto-Anotação | 4 | T4 | 5 |

**Total: 5 epics, 29 stories**

## Epic 01: Setup e Autenticação

| Story | File | Estimativa | ACs |
|---|---|---|---|
| E01-S01 | Setup do backend Express + Prisma + PostgreSQL | S | N/A |
| E01-S02 | Modelagem do banco de dados (Prisma Schema) | M | N/A |
| E01-S03 | API de autenticação (login, registro, refresh token) | M | AC-02-1 |
| E01-S04 | Middleware de autenticação e proteção de rotas | S | N/A |
| E01-S05 | Tela de login no app mobile | S | AC-01-1 |
| E01-S06 | Persistência de sessão e refresh automático | S | N/A |
| E01-S07 | Setup Expo e estrutura base do app mobile | S | N/A |

## Epic 02: Orçamento no Local (Core)

| Story | File | Estimativa | ACs |
|---|---|---|---|
| E02-S01 | CRUD de materiais no backend | S | AC-02-1, AC-02-2 |
| E02-S02 | Tela de tabela de preços no app | M | AC-02-1, AC-02-2 |
| E02-S03 | Tela "Novo Orçamento" (formulário + cálculo) | M | AC-01-1, AC-01-2, AC-01-5 |
| E02-S04 | Seleção de material com busca | S | AC-02-3 |
| E02-S05 | Geração de PDF do orçamento | M | AC-01-6 |
| E02-S06 | Compartilhamento via WhatsApp | S | AC-03-1, AC-03-2 |
| E02-S07 | Salvar orçamento no SQLite local (offline-first) | S | AC-01-5 |
| E02-S08 | Sincronização de orçamentos com backend | M | AC-01-5 |

## Epic 03: Pedidos e Lembretes

| Story | File | Estimativa | ACs |
|---|---|---|---|
| E03-S01 | API de pedidos (CRUD + vinculação) | S | AC-04-1 |
| E03-S02 | Tela "Converter em Pedido" | S | AC-04-1 |
| E03-S03 | Detalhes do Pedido + Marcar como Entregue | S | AC-04-3 |
| E03-S04 | Notificações push locais (lembretes) | M | AC-04-2 |
| E03-S05 | Lista de pedidos pendentes | S | AC-07-1 |
| E03-S06 | Sync de pedidos offline→online | S | AC-04-4 |

## Epic 04: Dashboard, Histórico e Busca

| Story | File | Estimativa | ACs |
|---|---|---|---|
| E04-S01 | Dashboard com cards resumo | S | AC-07-1, AC-07-2, AC-07-3 |
| E04-S02 | Lista de orçamentos com filtros | S | AC-06-1 |
| E04-S03 | Busca full-text de orçamentos | S | AC-06-2 |
| E04-S04 | Detalhes do orçamento (reabrir/reenviar) | S | AC-06-3 |

## Epic 05: Foto-Anotação

| Story | File | Estimativa | ACs |
|---|---|---|---|
| E05-S01 | Integração com câmera e galeria | S | AC-05-1 |
| E05-S02 | Canvas de anotações sobre foto | M | AC-05-2 |
| E05-S03 | Salvar e visualizar foto-anotação no pedido | S | AC-05-3 |
| E05-S04 | Sync de fotos com backend | S | AC-05-4 |

## Sprint Planning Sugerido

**Sprint 1 (Semanas 1–2): Epic 01 (Foundation)**
- E01-S01, E01-S02, E01-S03, E01-S04, E01-S05, E01-S06, E01-S07

**Sprint 2 (Semanas 3–4): Epic 02 Parte 1 (Core Offline)**
- E02-S01, E02-S02, E02-S03, E02-S04, E02-S07

**Sprint 3 (Semanas 5–6): Epic 02 Parte 2 (PDF/WhatsApp) + Epic 03**
- E02-S05, E02-S06, E02-S08, E03-S01, E03-S02, E03-S03

**Sprint 4 (Semanas 7–8): Epic 03 (Notificações) + Epic 04 + Epic 05**
- E03-S04, E03-S05, E03-S06, E04-S01, E04-S02, E04-S03, E04-S04, E05-S01, E05-S02, E05-S03, E05-S04

## Next Steps

1. **Hawkeye:** `/wize-tea-risk` — criar perfil de risco global
2. **Tony:** `/wize-check-implementation-readiness` — validar se stories estão prontos para dev
3. **Maria Hill:** `/wize-sprint-planning` — planejar sprint 1
4. **Shuri:** `/wize-dev-story` — iniciar desenvolvimento da primeira story

---

> Todos os ACs do PRD estão cobertos. Nenhuma história é XL (todas são S, M ou no máximo M).
