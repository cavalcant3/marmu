---
screen: novo-orcamento
status: ready-for-architecture
owner: Mantis
created: 2026-07-27
linked_scenarios: [S1]
linked_acs: [AC-01-1, AC-01-2, AC-01-3, AC-01-4, AC-01-5]
---

# Novo Orçamento

## Purpose
Tela mais crítica do app: permitir que o dono da marmoaria, no local do cliente, digite medidas, escolha material e veja o preço calculado em segundos. Tudo deve ser usável com uma mão, em pé, sob luz solar.

## Primary user action
Preencher medidas, selecionar material, ajustar preço e tocar "Gerar Orçamento".

## Layout (mobile portrait)

```
┌─────────────────────────────┐
│  ←  Novo Orçamento          │  ← Header com back
├─────────────────────────────┤
│                              │
│  Cliente                     │
│  [________________]         │  ← Input de nome
│                              │
│  ──── Medidas ────          │
│  Comprimento (m)            │
│  [  2,40  ]                 │  ← Input numérico
│                              │
│  Largura (m)                │
│  [  0,60  ]                 │  ← Input numérico
│                              │
│  Área: 1,44 m²              │  ← Label calculada
│                              │
│  ──── Material ────         │
│  [Selecionar material  >]   │  ← Botão que navega
│                              │
│  ──── Preço ────            │
│  Preço sugerido:            │
│  R$ 403,20                   │  ← Calculado
│                              │
│  Preço final (opcional)      │
│  [  420,00  ]               │  ← Editable
│                              │
│  Observações                 │
│  [________________]         │  ← Textarea curta
│                              │
│  [    Gerar Orçamento    ]  │  ← CTA principal
│                              │
└─────────────────────────────┘
```

## Content (copy)

- Header: "Novo Orçamento"
- Input "Cliente": placeholder "Nome do cliente (opcional)"
- Input "Comprimento (m)": placeholder "0,00", teclado numérico decimal
- Input "Largura (m)": placeholder "0,00", teclado numérico decimal
- Label "Área": exibe "{área} m²" (atualiza em tempo real)
- Botão "Selecionar material": exibe material escolhido quando selecionado
- Label "Preço sugerido": exibe "R$ {valor}" calculado (material × área)
- Input "Preço final": placeholder "R$ 0,00", teclado numérico decimal
- Input "Observações": placeholder "Ex: cliente quer cuba embutida"
- CTA: "Gerar Orçamento"

## Interactions

- **Digitar comprimento/largura** → área calculada em tempo real (≤ 500ms).
- **Tocar "Selecionar material"** → navega para `selecionar-material`; volta com material escolhido.
- **Selecionar material** → preço sugerido atualizado (≤ 500ms).
- **Editar "Preço final"** → sobrescreve preço sugerido; mantém histórico do cálculo original.
- **Tocar "Gerar Orçamento"** → salva localmente (offline-first) → navega para `visualizar-orcamento`.
- **Back ←** → confirma descarte se houver dados não salvos: "Sair sem salvar?" [Sair] [Continuar]

## States

- **Loading:** Ao abrir, carrega tabela de preços do SQLite (≤ 1s). Skeleton nos inputs.
- **Empty:** Campos vazios; CTA desabilitado até que comprimento, largura e material estejam preenchidos.
- **Error (campo):** Se comprimento/largura ≤ 0, borda vermelha do input + texto "Medida deve ser maior que zero".
- **Error (sem material):** Toast: "Selecione um material para calcular o preço."
- **Error (sem tabela):** Se não houver materiais cadastrados, modal: "Cadastre materiais em Configurações → Tabela de Preços." [Ir] [Cancelar]
- **Offline:** Todos os inputs funcionam normalmente; salvamento é local; badge discreto "Offline" no header.
- **Success:** Navegação para `visualizar-orcamento` com os dados preenchidos.

## Accessibility notes (app-overlay — Material 3)

- Inputs com label flutuante (Material 3 OutlinedTextField) — label permanece visível.
- Teclado numérico decimal (inputType="numberDecimal") — vírgula e ponto aceitos.
- TalkBack: "Comprimento, metro, editar texto. Área calculada: 1 vírgula 44 metros quadrados."
- Touch target CTA: 48dp altura mínima, 100% largura com padding 16dp lateral.
- Contraste em inputs: borda cinza #757575, foco primário #1976D2.
- Campos devem ser preenchíveis com uma mão (polegar em telas de 5–6 polegadas).

## Metrics

- Event `orcamento_iniciado`: tela aberta.
- Event `medida_digitada {tipo: comprimento|largura}`.
- Event `material_selecionado {material_id}`.
- Event `preco_ajustado_manualmente`: quando preço final ≠ sugerido.
- Event `orcamento_salvo`: quando toca CTA.
- Event `orcamento_salvo_offline`: flag adicional se offline.

## Open questions for Tony

- O cálculo de área e preço deve ser feito no componente (React Native) ou no SQLite (trigger/view)? Recomendação: no componente para feedback instantâneo.
- Como lidar com vírgula vs ponto decimal em diferentes locales? Sugestão: aceitar ambos, normalizar para ponto internamente.
- O estado do formulário deve ser mantido no React state ou em um formulário gerenciado (React Hook Form / Formik)?
