---
screen: lista-orcamentos
status: ready-for-architecture
owner: Mantis
created: 2026-07-27
linked_scenarios: [S2, S4, S5]
linked_acs: [AC-06-1, AC-06-2, AC-06-3]
---

# Lista de Orçamentos

## Purpose
Permitir que o dono visualize todos os orçamentos feitos, busque rapidamente por nome ou data, e reabra/edit/reenvie.

## Primary user action
Buscar um orçamento ou tocar em um item para ver detalhes.

## Layout (mobile portrait)

```
┌─────────────────────────────┐
│  ←  Orçamentos              │
├─────────────────────────────┤
│  [🔍 Buscar por cliente...] │  ← Search bar
├─────────────────────────────┤
│                              │
│  Seg, 21/07                 │
│  ┌───────────────────────┐  │
│  │ 📝 Carlos Lima        │  │
│  │ Bancada — R$ 1.200    │  │
│  │ Pendente ●            │  │
│  └───────────────────────┘  │
│                              │
│  Sex, 18/07                 │
│  ┌───────────────────────┐  │
│  │ 📝 Ana Costa          │  │
│  │ Pia banheiro — R$ 890 │  │
│  │ Aprovado ✓            │  │
│  └───────────────────────┘  │
│  ┌───────────────────────┐  │
│  │ 📝 João da Silva      │  │
│  │ Bancada — R$ 420      │  │
│  │ Rejeitado ✕           │  │
│  └───────────────────────┘  │
│                              │
│  [Filtros: Todos ▼]         │
│                              │
└─────────────────────────────┘
```

## Content (copy)

- Header: "Orçamentos"
- Search bar: "Buscar por cliente, material ou data..."
- Itens agrupados por data (hoje, ontem, esta semana, mês)
- Cada item: ícone 📝, nome do cliente, descrição curta, valor, status (Pendente ● / Aprovado ✓ / Rejeitado ✕ / Vencido ⏱)
- Filtro: "Todos ▼" (Todos / Pendentes / Aprovados / Rejeitados / Vencidos)

## Interactions

- **Digitar na busca** → filtra em tempo real (≤ 500ms), busca por nome do cliente, material ou data.
- **Tocar em item** → navega para `detalhes-orcamento`.
- **Tocar filtro** → dropdown com opções; aplica filtro imediatamente.
- **Pull-to-refresh** → atualiza lista.

## States

- **Loading:** Skeleton de lista.
- **Empty (primeira vez):** "Nenhum orçamento ainda. Toque em '+ Novo Orçamento' no dashboard para começar."
- **Empty (busca):** "Nenhum orçamento encontrado."
- **Empty (filtro):** "Nenhum orçamento com status 'Rejeitado'."

## Accessibility notes

- Touch target item: 64dp (fácil de tocar com dedo sujo/poeira).
- TalkBack: "Orçamento de Carlos Lima, bancada, 1.200 reais, pendente. Toque para ver detalhes."
- Status com cor + ícone (acessibilidade: não depende só da cor).

## Metrics

- Event `lista_orcamentos_viewed`.
- Event `busca_orcamento_usada`.
- Event `filtro_orcamento_aplicado {filtro}`.

## Open questions for Tony

- Busca deve usar LIKE do SQLite ou FTS (Full Text Search)?
- Paginação necessária? Ou carrega tudo (já que é app local)?
