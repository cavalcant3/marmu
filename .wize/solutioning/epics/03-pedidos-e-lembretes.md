---
epic_id: 03-pedidos-e-lembretes
status: ready
owner: Tony Stark
linked_prd: E04
linked_architecture: apps/mobile/src/screens/ConverterPedido.tsx, apps/api/src/controllers/pedidoController.ts
trigger_map_row: T2, T3
priority: 3
estimate: L
---

# Epic 03: Pedidos e Lembretes Automáticos

## Outcome
Orçamento aprovado é convertido em pedido com data de entrega. App agenda lembrete push para 2 dias antes do prazo. Dono nunca mais esquece uma entrega.

## Stories
- E03-S01: API de pedidos (CRUD + vinculação com orçamento)
- E03-S02: Tela "Converter em Pedido" (data + observações + confirmação)
- E03-S03: Tela "Detalhes do Pedido" (dados + status)
- E03-S04: Agendamento de notificações push locais (Notifee)
- E03-S05: Lista de pedidos pendentes com ordenação por data
- E03-S06: Marcar pedido como "Entregue" e arquivar

## Dependencies
- Epic 02 (orçamentos salvos no SQLite + backend)
- Notifee configurado no projeto

## Success
- 100% dos pedidos aceitos têm data de entrega cadastrada
- Lembrete push dispara 2 dias antes às 08h
- Taxa de atraso ≤ 5% (baseline: ~20% sem app)
