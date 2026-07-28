---
status: accepted
owner: Tony Stark
created: 2026-07-27
---

# ADR-001: Adoção de Backend e Autenticação

## Context

O PRD original definia o Marmu como um app **offline-first sem backend** e sem autenticação. Dados seriam armazenados 100% localmente no dispositivo, com backup manual via exportação. O objetivo era simplicidade e privacidade LGPD.

## Decisão

**Cavalcante (Product Owner) decidiu adicionar backend e autenticação ao escopo.**

### Motivação

1. **Backup e recuperação:** Evitar perda total de dados se o celular for perdido, roubado ou danificado.
2. **Sincronização multi-dispositivo:** Possibilitar uso futuro em múltiplos dispositivos (gestor e funcionários).
3. **Segurança:** Autenticação protege acesso aos dados da marmoaria.
4. **Escalabilidade futura:** Base para funcionalidades como relatórios web, integrações ERP, etc.

## Consequências

### Positivas
- Dados sincronizados e backupados na nuvem
- Acesso protegido por autenticação
- Base para escalabilidade futura
- Possibilidade de web dashboard futuro

### Negativas
- **Aumento de complexidade:** Adiciona infraestrutura, deploy, segurança de API, etc.
- **Custo:** Hospedagem de servidor, banco de dados cloud
- **Dependência de internet:** Sincronização requer conexão (embora offline-first continue funcionando localmente)
- **Prazo:** Adiciona 2–3 semanas ao desenvolvimento
- **LGPD:** Agora inclui transferência de dados pessoais para servidor — requer criptografia em trânsito e em repouso, além de termos de uso

## Escopo técnico adicionado

| Componente | Tecnologia sugerida | Responsabilidade |
|---|---|---|
| API REST | Node.js (Express/Fastify) ou Python (FastAPI) | CRUD de orçamentos, pedidos, materiais |
| Banco de dados | PostgreSQL ou MongoDB | Armazenamento persistente na nuvem |
| Autenticação | JWT (JSON Web Tokens) | Login do gestor, proteção de endpoints |
| Hospedagem | Railway, Render, ou VPS (AWS/GCP) | Deploy do backend |
| App (React Native) | Axios/Fetch + AsyncStorage | Cliente HTTP, cache do token JWT |

## Requisitos de segurança

- HTTPS obrigatório em todas as comunicações
- Senhas hash com bcrypt
- JWT com expiração (24h) + refresh token
- Rate limiting na API
- Criptografia dos dados pessoais no banco (LGPD)

## Status

**Accepted** — 2026-07-27

## Relacionado

- Altera escopo do PRD (`.wize/planning/prd.md`)
- Impacta decisões de arquitetura em `architecture.md`
