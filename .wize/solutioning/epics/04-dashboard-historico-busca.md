---
epic_id: 04-dashboard-historico-busca
status: ready
owner: Tony Stark
linked_prd: E06, E07
linked_architecture: apps/mobile/src/screens/Dashboard.tsx, apps/mobile/src/screens/ListaOrcamentos.tsx
trigger_map_row: T5, T6
priority: 4
estimate: M
---

# Epic 04: Dashboard, Histórico e Busca

## Outcome
Dono abre o app e vê resumo do mês. Busca orçamentos antigos em segundos. Reabre e reenvia sem perder tempo.

## Stories
- E04-S01: Tela Dashboard com cards resumo (orçamentos, pedidos, entregas, receita)
- E04-S02: Tela "Lista de Orçamentos" com busca e filtros
- E04-S03: Busca full-text por nome do cliente, material ou data
- E04-S04: Tela "Detalhes do Orçamento" (reabrir, editar, reenviar)
- E04-S05: Lista de pedidos (pendentes e entregues)

## Dependencies
- Epic 02 (orçamentos salvos)
- Epic 03 (pedidos salvos)

## Success
- Dashboard carrega em ≤ 2s
- Orçamento localizado em ≤ 10 segundos
- Reenvio de PDF/WhatsApp funciona a partir da lista
