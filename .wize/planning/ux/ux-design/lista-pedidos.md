---
screen: lista-pedidos
status: ready-for-architecture
owner: Mantis
created: 2026-07-27
linked_scenarios: [S3, S5]
linked_acs: [AC-07-1]
---

# Lista de Pedidos

## Purpose
Mostrar todos os pedidos ativos e pendentes, organizados por proximidade da data de entrega.

## Primary user action
Tocar em um pedido para ver detalhes ou marcar como entregue.

## Layout (mobile portrait)

```
┌─────────────────────────────┐
│  ←  Pedidos                 │
├─────────────────────────────┤
│  [🔍 Buscar pedido...]      │
├─────────────────────────────┤
│                              │
│  ─ Esta Semana ─            │
│  ┌───────────────────────┐  │
│  │ 🔴 João Silva         │  │
│  │ Entrega: Qui 15/08    │  │
│  │ Bancada cozinha       │  │
│  │ R$ 420,00             │  │
│  └───────────────────────┘  │
│                              │
│  ─ Próxima Semana ─         │
│  ┌───────────────────────┐  │
│  │ 🟡 Maria Souza        │  │
│  │ Entrega: Sex 23/08    │  │
│  │ Pia banheiro            │  │
│  │ R$ 890,00             │  │
│  └───────────────────────┘  │
│                              │
│  [Filtros: Pendentes ▼]     │
│                              │
└─────────────────────────────┘
```

## Content (copy)

- Header: "Pedidos"
- Search bar: "Buscar pedido..."
- Itens agrupados por: "Esta Semana", "Próxima Semana", "Mais Tarde"
- Cada item: nome do cliente, data de entrega, descrição, valor
- Cor do indicador: 🔴 vence em ≤ 3 dias / 🟡 vence em ≤ 7 dias / 🟢 vence em > 7 dias
- Filtros: "Pendentes ▼" (Pendentes / Entregues / Todos)

## Interactions

- **Tocar item** → navega para `detalhes-pedido`.
- **Swipe right** → ação rápida "Marcar como Entregue".
- **Tocar filtro** → dropdown.

## States

- **Loading:** Skeleton.
- **Empty:** "Nenhum pedido pendente."
- **Offline:** Funciona normalmente.

## Accessibility notes

- Swipe action deve ter alternativa por toque (botão visível em `detalhes-pedido`).
- TalkBack: "Pedido de João Silva. Entrega quinta-feira, 15 de agosto. Bancada cozinha."

## Metrics

- Event `lista_pedidos_viewed`.
- Event `pedido_entregue_swipe`.

## Open questions for Tony

- Swipe right com react-native-gesture-handler ou componente nativo?
