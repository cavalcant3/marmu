---
screen: visualizar-orcamento
status: ready-for-architecture
owner: Mantis
created: 2026-07-27
linked_scenarios: [S1]
linked_acs: [AC-01-6, AC-03-1, AC-03-2, AC-03-3]
---

# Visualizar Orçamento

## Purpose
Mostrar a prévia do orçamento antes de compartilhar, com todos os dados organizados e prontos para gerar o PDF ou enviar pelo WhatsApp.

## Primary user action
Tocar "Enviar por WhatsApp" ou "Salvar PDF".

## Layout (mobile portrait)

```
┌─────────────────────────────┐
│  ←  Orçamento #001          │
├─────────────────────────────┤
│                              │
│  ──── Prévia do PDF ────    │
│  ┌───────────────────────┐  │
│  │ CNC Mármores e Granitos│  │
│  │ Orçamento #001         │
│  │ Data: 27/07/2026       │
│  │                        │  │
│  │ Cliente: João da Silva │  │
│  │                        │  │
│  │ Projeto: Bancada cozinha│ │
│  │ Medidas: 2,40m × 0,60m │  │
│  │ Área: 1,44 m²          │  │
│  │ Material: Granito Preto │  │
│  │ São Gabriel            │  │
│  │                        │  │
│  │ Preço: R$ 420,00       │  │
│  │ Validade: 7 dias       │  │
│  └───────────────────────┘  │
│                              │
│  [📱 Enviar por WhatsApp ]   │  ← CTA primário
│  [💾 Salvar PDF no celular] │  ← CTA secundário
│  [✏️ Editar Orçamento     ] │  ← Terciário
│                              │
└─────────────────────────────┘
```

## Content (copy)

- Header: "Orçamento #{id}" ou "Novo Orçamento" (se ainda não salvo)
- Prévia do PDF com: nome da marmoaria, número do orçamento, data, cliente, descrição do projeto, medidas, área, material, preço final, validade
- CTA primário: "📱 Enviar por WhatsApp"
- CTA secundário: "💾 Salvar PDF no celular"
- CTA terciário: "✏️ Editar Orçamento"

## Interactions

- **Tocar "Enviar por WhatsApp"** → abre WhatsApp com seletor de contatos, texto pré-preenchido e PDF anexado.
- **Tocar "Salvar PDF"** → gera PDF, salva em `/Downloads/Marmu/` e mostra toast "PDF salvo em Downloads".
- **Tocar "Editar"** → volta para `novo-orcamento` com dados preenchidos.
- **Tocar PDF preview** → expande para tela cheia (zoom in/out).

## States

- **Loading:** "Gerando PDF..." com spinner.
- **Error (WhatsApp não instalado):** Snackbar: "WhatsApp não encontrado. Salve o PDF e envie manualmente." + botão "Salvar PDF".
- **Error (geração PDF falhou):** Snackbar: "Erro ao gerar PDF. Toque para tentar."
- **Success (PDF salvo):** Toast "PDF salvo em Downloads/Marmu/"
- **Success (WhatsApp enviado):** Toast "Orçamento enviado!" → volta para `dashboard`.

## Accessibility notes

- Preview do PDF em WebView ou componente nativo; deve suportar zoom com gestos de pinça.
- TalkBack: "Prévia do orçamento. Botão: Enviar por WhatsApp. Botão: Salvar PDF."
- CTAs empilhados verticalmente com 16dp de espaçamento; touch target 48dp cada.

## Metrics

- Event `orcamento_preview_viewed`.
- Event `whatsapp_share_tapped`.
- Event `pdf_save_tapped`.
- Event `orcamento_edit_tapped`.

## Open questions for Tony

- PDF deve ser gerado no dispositivo (react-native-pdf-lib) ou via screenshot do preview HTML?
- Se WhatsApp não estiver instalado, usar Sharesheet do Android (ACTION_SEND) ou fallback direto para salvar?
- O número do orçamento é auto-incremento local ou UUID?
