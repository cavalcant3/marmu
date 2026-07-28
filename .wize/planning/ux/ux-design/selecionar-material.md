---
screen: selecionar-material
status: ready-for-architecture
owner: Mantis
created: 2026-07-27
linked_scenarios: [S1]
linked_acs: [AC-02-3]
---

# Selecionar Material

## Purpose
Permitir que o dono escolha rapidamente um material da tabela pré-configurada, com busca e visualização do preço por m².

## Primary user action
Tocar em um material da lista para selecioná-lo e voltar para `novo-orcamento`.

## Layout (mobile portrait)

```
┌─────────────────────────────┐
│  ←  Selecionar Material    │
├─────────────────────────────┤
│  [🔍 Buscar material... ]  │  ← Search bar
├─────────────────────────────┤
│                              │
│  ─ Granito ─                │  ← Separador de categoria
│  ┌───────────────────────┐  │
│  │ ● Preto São Gabriel   │  │
│  │   R$ 280,00 / m²      │  │
│  └───────────────────────┘  │
│  ┌───────────────────────┐  │
│  │ ● Verde Ubatuba        │  │
│  │   R$ 320,00 / m²       │  │
│  └───────────────────────┘  │
│                              │
│  ─ Mármore ─                │
│  ┌───────────────────────┐  │
│  │ ● Carrara              │  │
│  │   R$ 450,00 / m²       │  │
│  └───────────────────────┘  │
│                              │
│  [ + Adicionar Material ]   │  ← Link para tabela-precos
│                              │
└─────────────────────────────┘
```

## Content (copy)

- Header: "Selecionar Material"
- Search bar: placeholder "Buscar material..."
- Separadores por tipo: "Granito", "Mármore", "Porcelanato", "Outro"
- Item de lista: nome do material + preço por m²
- Link "+ Adicionar Material": leva para `tabela-precos`

## Interactions

- **Digitar na busca** → filtra lista em tempo real (≤ 500ms), busca por nome ou tipo.
- **Tocar em material** → seleciona, vibra leve (haptic feedback), volta para `novo-orcamento` com material preenchido.
- **Tocar "+ Adicionar Material"** → navega para `tabela-precos`.
- **Back ←** → volta para `novo-orcamento` sem selecionar.

## States

- **Loading:** Skeleton de lista; carrega do SQLite.
- **Empty (sem materiais):** "Nenhum material cadastrado. Toque em '+ Adicionar Material' para criar sua tabela de preços."
- **Empty (busca sem resultado):** "Nenhum material encontrado para 'xyz'."
- **Offline:** Funciona normalmente (dados locais).

## Accessibility notes

- Search bar: ícone de lupa, limpar texto (X) quando preenchido.
- Touch target de item: 48dp altura mínima.
- TalkBack: "Lista de materiais. Item 1 de 5: Preto São Gabriel, Granito, 280 reais por metro quadrado. Toque para selecionar."

## Metrics

- Event `material_search_used`: usuário digitou na busca.
- Event `material_selected {material_id, tipo}`.

## Open questions for Tony

- A lista deve ser implementada com SectionList (categorias) ou FlatList simples com headers?
- Busca deve ser case-insensitive e com acentos normalizados (unidecode)?
