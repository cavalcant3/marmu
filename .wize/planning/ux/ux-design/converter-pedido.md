---
screen: converter-pedido
status: ready-for-architecture
owner: Mantis
created: 2026-07-27
linked_scenarios: [S2]
linked_acs: [AC-04-1, AC-04-2]
---

# Converter em Pedido

## Purpose
Transformar um orçamento aprovado em um pedido com data de entrega e lembrete automático.

## Primary user action
Confirmar dados e tocar "Criar Pedido".

## Layout (mobile portrait)

```
┌─────────────────────────────┐
│  ←  Converter em Pedido     │
├─────────────────────────────┤
│                              │
│  ── Dados do Orçamento ──   │
│  Cliente: João da Silva      │
│  Material: Granito Preto     │
│  Preço: R$ 420,00            │
│  (Não editável — resumo)     │
│                              │
│  ── Informações do Pedido ─ │
│                              │
│  Data Prometida de Entrega   │
│  [  15/08/2026  ]            │  ← Date picker
│                              │
│  Observações                 │
│  [Cliente só recebe após 14h│
│  ]                            │  ← Textarea
│                              │
│  [✓ Lembrar 2 dias antes]   │  ← Checkbox (default: checked)
│                              │
│  [     Criar Pedido      ]  │  ← CTA
│                              │
└─────────────────────────────┘
```

## Content (copy)

- Header: "Converter em Pedido"
- Resumo do orçamento (não editável): Cliente, Material, Preço
- Input "Data Prometida": date picker nativo do Android
- Input "Observações": placeholder "Ex: cliente só recebe após 14h"
- Checkbox: "Lembrar 2 dias antes" (default marcado)
- CTA: "Criar Pedido"

## Interactions

- **Tocar "Data Prometida"** → abre date picker nativo; não permite datas no passado.
- **Tocar "Criar Pedido"** → salva pedido, agenda notificação local push para 2 dias antes às 08h, navega para `detalhes-pedido`.
- **Back ←** → confirma descarte.

## States

- **Empty:** Data não preenchida; CTA desabilitado.
- **Error (data no passado):** Toast "A data de entrega não pode ser no passado."
- **Success:** Toast "Pedido criado! Lembrete programado para 13/08." → navega para `detalhes-pedido`.

## Accessibility notes

- Date picker: usar componente nativo do Android (DatePickerDialog) — melhor acessibilidade.
- Checkbox: TalkBack "Lembrar 2 dias antes da entrega. Marcado."
- TalkBack: "Criar pedido para João da Silva. Data de entrega: 15 de agosto."

## Metrics

- Event `converter_pedido_iniciado`.
- Event `pedido_criado {data_entrega, lembrete_ativo}`.
- Event `pedido_criado_offline`: flag se offline.

## Open questions for Tony

- Notificações locais: usar react-native-push-notification ou Notifee? Recomendação: Notifee para Android local notifications.
- A data do lembrete é calculada no app (data - 2 dias) ou no momento da criação do pedido?
- Se o app estiver offline, o lembrete é agendado localmente via AlarmManager ou WorkManager?
