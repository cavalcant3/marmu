---
screen: dashboard
status: ready-for-architecture
owner: Mantis
created: 2026-07-27
linked_scenarios: [S1, S5]
linked_acs: [AC-01-1, AC-07-1, AC-07-2, AC-07-3]
---

# Dashboard (tela inicial)

## Purpose
Tela de chegada do app. Deve dar ao dono da marmoaria visibilidade imediata do negócio e acesso rápido à ação mais frequente: criar um novo orçamento.

## Primary user action
Tocar em "Novo Orçamento" (FAB principal) ou tocar em um dos cards de resumo.

## Layout (mobile portrait)

```
┌─────────────────────────────┐
│  Marmu               [≡]    │  ← Header com logo e menu
├─────────────────────────────┤
│                              │
│   [  + Novo Orçamento  ]    │  ← FAB principal (CTA)
│                              │
│  ──── Resumo do Mês ────    │
│  ┌────────┐  ┌────────┐    │
│  │Orçament│  │ Pedidos│    │  ← Cards horizontais
│  │   18   │  │   12   │    │
│  └────────┘  └────────┘    │
│  ┌────────┐  ┌────────┐    │
│  │Entregas│  │ Receita│    │
│  │   4    │  │ R$8.400│    │
│  └────────┘  └────────┘    │
│                              │
│  ──── Próximas Entregas ───  │
│  [🔔] João Silva — quin 15  │  ← Lista vertical
│  [🔔] Maria Sou — sex 17    │
│  [ ]  Ver todos os pedidos  │
│                              │
│  ──── Orçamentos Recentes ─  │
│  [📝] Carlos Lima — R$1.200 │
│  [📝] Ana Costa — R$890     │
│  [ ]  Ver todos            │
│                              │
└─────────────────────────────┘
```

## Content (copy)

- Header: "Marmu" (nome do app)
- FAB: "+ Novo Orçamento"
- Cards resumo:
  - "Orçamentos este mês" / número
  - "Pedidos aceitos" / número
  - "Entregas pendentes" / número
  - "Receita estimada" / valor em reais
- Seção "Próximas Entregas": lista dos 2 pedidos com entrega mais próxima
- Seção "Orçamentos Recentes": lista dos 2 orçamentos mais recentes
- Links "Ver todos" navegam para as respectivas listas

## Interactions

- **Tocar FAB "+ Novo Orçamento"** → navega para `novo-orcamento`
- **Tocar card "Orçamentos"** → navega para `lista-orcamentos`
- **Tocar card "Pedidos"** → navega para `lista-pedidos` (filtro: pendentes)
- **Tocar card "Entregas"** → navega para `lista-pedidos` (filtro: entregas esta semana)
- **Tocar card "Receita"** → navega para `lista-pedidos` (todos)
- **Tocar item de entrega** → navega para `detalhes-pedido`
- **Tocar item de orçamento recente** → navega para `detalhes-orcamento`
- **Pull-to-refresh** → atualiza cards e listas (≤ 2s)
- **Menu hamburger [≡]** → abre drawer com: Configurações, Tabela de Preços, LGPD/Exportar dados

## States

- **Loading:** Skeleton nos cards e listas; FAB visível mas desativado.
- **Empty (primeira vez):** Cards mostram "0" com cor cinza; seção "Orçamentos Recentes" mostra texto "Nenhum orçamento ainda. Toque em '+ Novo Orçamento' para começar."
- **Empty (mês sem atividade):** "Nenhum orçamento este mês."
- **Error:** Snackbar na parte inferior: "Não foi possível carregar dados. Toque para tentar."
- **Offline:** Ícone de nuvem riscada no header; dados do cache exibidos; FAB funciona normalmente (offline-first).

## Accessibility notes (app-overlay — Material 3)

- Touch targets ≥ 48dp para todos os cards e itens de lista.
- FAB: 56dp mínimo, com elevação 3dp (shadow).
- Contraste: texto sobre cards ≥ 4.5:1 (usar fundo branco/cinza claro, texto escuro).
- Fonte do sistema; respeitar escala de acessibilidade do Android (reflow automático).
- TalkBack: "Dashboard. 18 orçamentos este mês. Botão: Novo Orçamento."
- Cores devem ser discerníveis em luz solar forte (contraste alto).

## Metrics

- Event `dashboard_viewed`: tela carregada.
- Event `fab_novo_orcamento_tapped`: FAB pressionado.
- Event `card_tapped {tipo: orcamentos|pedidos|entregas|receita}`.
- Event `pull_to_refresh`.

## Open questions for Tony

- Os cards devem ser implementados com FlatList horizontal ou ScrollView? Recomendação: ScrollView simples (apenas 4 cards).
- Os dados do dashboard são calculados em tempo real no SQLite ou via view pré-agregada?
