---
screen: detalhes-pedido
status: ready-for-architecture
owner: Mantis
created: 2026-07-27
linked_scenarios: [S3]
linked_acs: [AC-04-3, AC-04-4, AC-05-1, AC-05-2, AC-05-3]
---

# Detalhes do Pedido

## Purpose
Mostrar todas as informações de um pedido ativo, incluindo foto-anotação do projeto, e permitir marcar como entregue.

## Primary user action
Visualizar foto do projeto ou tocar "Marcar como Entregue".

## Layout (mobile portrait)

```
┌─────────────────────────────┐
│  ←  Pedido #P001            │
├─────────────────────────────┤
│                              │
│  Status: Pendente 🔴         │
│  Entrega: Qui, 15/08/2026    │
│                              │
│  Cliente: João da Silva      │
│  Material: Granito Preto     │
│  Preço: R$ 420,00            │
│                              │
│  ──── Projeto ────          │
│  ┌───────────────────────┐  │
│  │  [FOTO DO AMBIENTE]  │  │
│  │  ↖ 2,40m              │  │
│  │  ↙ 0,60m              │  │
│  │  [Canto direito coluna]│  │
│  └───────────────────────┘  │
│  [📷 Trocar/Adicionar Foto] │
│                              │
│  Observações                 │
│  Cliente só recebe após 14h  │
│                              │
│  [✓ Marcar como Entregue]   │  ← CTA principal
│                              │
└─────────────────────────────┘
```

## Content (copy)

- Header: "Pedido #{id}"
- Status + data de entrega
- Dados: Cliente, Material, Preço
- Seção "Projeto": foto do ambiente com anotações (medidas, setas, textos)
- Botão "📷 Trocar/Adicionar Foto"
- Observações
- CTA: "✓ Marcar como Entregue"

## Interactions

- **Tocar na foto** → expande para tela cheia (`foto-anotacao` modo visualização).
- **Tocar "Adicionar Foto"** → navega para `foto-anotacao` modo câmera.
- **Tocar "Marcar como Entregue"** → confirmação: "Confirmar entrega? O pedido será movido para histórico." [Confirmar] [Cancelar] → move para entregues.
- **Notificação push** → quando o usuário toca na notificação, abre esta tela diretamente.

## States

- **Sem foto:** Placeholder com ícone de câmera + texto "Adicione uma foto do projeto para ajudar o instalador."
- **Entregue:** Status muda para "Entregue ✓" verde; CTA some; aparece "Data de entrega: {data}".
- **Offline:** Foto salva localmente; badge "Offline".

## Accessibility notes

- Foto: TalkBack "Foto do ambiente. Com anotações: 2 vírgula 40 metros, 0 vírgula 60 metros. Toque para ver em tela cheia."
- CTA "Marcar como Entregue" em cor verde (#2E7D32) com bom contraste.

## Metrics

- Event `detalhes_pedido_viewed {pedido_id}`.
- Event `pedido_entregue_confirmado`.
- Event `foto_visualizada`.

## Open questions for Tony

- A foto é armazenada como base64 no SQLite ou como arquivo no filesystem com referência no banco?
- Qual é o limite de tamanho/resolução da foto? Recomendação: máximo 2MB, compressão JPEG 80%.
