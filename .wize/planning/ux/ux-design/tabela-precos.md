---
screen: tabela-precos
status: ready-for-architecture
owner: Mantis
created: 2026-07-27
linked_scenarios: [S1]
linked_acs: [AC-02-1, AC-02-2]
---

# Tabela de Preços

## Purpose
Permitir que o dono cadastre, edite e organize os preços dos materiais que trabalha.

## Primary user action
Adicionar ou editar um material.

## Layout (mobile portrait)

```
┌─────────────────────────────┐
│  ←  Tabela de Preços        │
├─────────────────────────────┤
│                              │
│  [ + Adicionar Material ]   │  ← CTA principal
│                              │
│  ─ Granito ─                │
│  ┌───────────────────────┐  │
│  │ Preto São Gabriel     │  │
│  │ R$ 280,00 / m²        │  │
│  │ [✏️] [🗑️]              │  │
│  └───────────────────────┘  │
│  ┌───────────────────────┐  │
│  │ Verde Ubatuba         │  │
│  │ R$ 320,00 / m²        │  │
│  │ [✏️] [🗑️]              │  │
│  └───────────────────────┘  │
│                              │
│  ─ Mármore ─                │
│  ┌───────────────────────┐  │
│  │ Carrara               │  │
│  │ R$ 450,00 / m²        │  │
│  │ [✏️] [🗑️]              │  │
│  └───────────────────────┘  │
│                              │
└─────────────────────────────┘
```

## Content (copy)

- Header: "Tabela de Preços"
- CTA: "+ Adicionar Material"
- Itens agrupados por tipo (Granito, Mármore, Porcelanato, Outro)
- Cada item: nome, preço/m², botões editar e excluir

## Interactions

- **Tocar "+ Adicionar Material"** → abre modal/bottom sheet com formulário.
- **Tocar ✏️** → abre modal com dados preenchidos para edição.
- **Tocar 🗑️** → confirmação: "Excluir '{material}'? Orçamentos antigos manterão o preço histórico." [Excluir] [Cancelar].
- **Formulário modal:** Nome, Tipo (dropdown: Granito/Mármore/Porcelanato/Outro), Preço por m², Observações.

## States

- **Empty:** "Nenhum material cadastrado. Adicione seu primeiro material para começar a orçar."
- **Loading:** Skeleton.
- **Offline:** Salva localmente; sincroniza quando online.

## Accessibility notes

- TalkBack: "Tabela de preços. Preto São Gabriel, Granito, 280 reais por metro quadrado. Botão editar. Botão excluir."
- Modal de formulário: foco no primeiro campo quando abre.

## Metrics

- Event `tabela_precos_viewed`.
- Event `material_adicionado {tipo}`.
- Event `material_editado`.
- Event `material_excluido`.

## Open questions for Tony

- Histórico de preços: ao editar um material, orçamentos antigos mantêm o valor original. Isso requer uma tabela de histórico ou apenas copiar o valor no momento do orçamento?
- Recomendação: copiar o preço no momento do orçamento para o registro do orçamento (desnormalização), evitando joins complexos.
