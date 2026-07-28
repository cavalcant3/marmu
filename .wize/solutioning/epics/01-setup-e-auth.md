---
epic_id: 01-setup-e-auth
status: ready
owner: Tony Stark
linked_prd: E08
linked_architecture: apps/api, apps/mobile/src/screens/Login.tsx
trigger_map_row: N/A (foundational)
priority: 1
estimate: L
---

# Epic 01: Setup de Infra e Autenticação

## Outcome
Backend API REST deployado e rodando com autenticação JWT. App mobile conecta, faz login e mantém sessão. Base para todos os outros épicos.

## Stories
- E01-S01: Setup do backend Express + Prisma + PostgreSQL
- E01-S02: Modelagem do banco de dados (usuários, orçamentos, pedidos, materiais)
- E01-S03: API de autenticação (login, registro, refresh token)
- E01-S04: Middleware de autenticação e proteção de rotas
- E01-S05: Tela de login no app mobile
- E01-S06: Persistência de sessão (MMKV + refresh automático)
- E01-S07: Setup Expo + estrutura base do app mobile

## Dependencies
- Conta no Render (ou similar) para deploy
- Banco PostgreSQL provisionado
- Expo CLI instalado localmente

## Success
- API responde em `/health` com status 200
- Login funciona: email + senha → JWT → acesso a rotas protegidas
- App mobile mantém sessão após fechar e abrir
- Deploy do backend no ar
