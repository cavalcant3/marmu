---
screen: detalhes-orcamento
status: ready-for-architecture
owner: Mantis
created: 2026-07-27
linked_scenarios: [S2, S4]
linked_acs: [AC-06-3]
---

# Detalhes do Orçamento

## Purpose
Mostrar todos os dados de um orçamento específico e permitir ações: reenviar, editar, converter em pedido ou excluir.

## Primary user action
Tocar "Converter em Pedido" (se pendente) ou "Reenviar PDF".

## Layout (mobile portrait)

```
┌─────────────────────────────┐
│  ←  Orçamento #001          │
├─────────────────────────────┤
│                              │
│  Status: Pendente ●          │
│                              │
│  Cliente                     │
│  João da Silva               │
│                              │
│  Medidas                     │
│  2,40m × 0,60m              │
│  Área: 1,44 m²               │
│                              │
│  Material                    │
│  Granito Preto São Gabriel   │
│  R$ 280,00 / m²              │
│                              │
│  Preço Final                 │
│  R$ 420,00                   │
│                              │
│  Observações                 │
│  Cliente quer cuba embutida  │
│                              │
│  Criado em: 21/07/2026       │
│  Válido até: 28/07/2026      │
│                              │
│  [📱 Reenviar WhatsApp]     │
│  [✏️ Editar Orçamento]      │
│  [📋 Converter em Pedido]   │
│  [🗑️ Excluir]              │
│                              │
└─────────────────────────────┘
```

## Content (copy)

- Header: "Orçamento #{id}"
- Status: Pendente / Aprovado / Rejeitado / Vencido
- Campos: Cliente, Medidas, Área, Material, Preço Final, Observações
- Metadados: Data de criação, validade
- CTAs: Reenviar WhatsApp, Editar, Converter em Pedido, Excluir

## Interactions

- **Tocar "Reenviar WhatsApp"** → mesmo fluxo de `visualizar-orcamento`.
- **Tocar "Editar"** → navega para `novo-orcamento` com dados preenchidos.
- **Tocar "Converter em Pedido"** → navega para `converter-pedido`.
- **Tocar "Excluir"** → confirmação: "Excluir orçamento? Esta ação não pode ser desfeita." [Excluir] [Cancelar]

## States

- **Loading:** Skeleton nos campos.
- **Error:** "Não foi possível carregar orçamento."
- **Vencido:** Badge "Vencido" + CTA "Renovar Orçamento" (copia dados para novo orçamento).

## Accessibility notes

- TalkBack: "Orçamento número 1. Status: Pendente. Cliente: João da Silva. Preço: 420 reais."
- CTAs empilhados; touch target 48dp.

## Metrics

- Event `detalhes_orcamento_viewed {orcamento_id}`.
- Event `converter_pedido_tapped`.
- Event `orcamento_excluido`.

## Open questions for Tony

- Exclusão é hard delete ou soft delete (flag `deleted_at`)? Recomendação: soft delete para auditoria LGPD.
