---
status: draft
owner: Pepper Potts
created: 2026-07-27
---

# Trigger Map — Marmu

> O que faz o dono da marmoaria abrir o app? Mapeamos gatilhos → tela → ação → valor percebido.

## Trigger 1: "Cheguei na casa do cliente e preciso orçar"

| | |
|---|---|
| **Gatilho** | Cliente pede orçamento no local; dono chega com trena e celular. |
| **Emoção** | Ansiedade (não quer esquecer medida, não quer perder tempo voltando ao escritório). |
| **Tela inicial** | Dashboard → botão "Novo Orçamento". |
| **Fluxo** | Digita medidas (2,40m × 0,60m) → escolhe material (granito/mármore/porcelanato) → app calcula m² × tabela → mostra preço sugerido → ajusta se quiser → gera PDF / compartilha no WhatsApp. |
| **Valor percebido** | "Fechei o orçamento em 5 minutos, no quintal do cliente, sem voltar pro escritório." |
| **Frequência** | 3–5× por dia. |
| **Critério de sucesso** | Tempo de orçamento ≤ 5 min do início ao envio. |

## Trigger 2: "O cliente aceitou — preciso não esquecer de entregar"

| | |
|---|---|
| **Gatilho** | Cliente confirma o orçamento (responde no WhatsApp, liga, ou fala na hora). |
| **Emoção** | Alívio + preocupação ("e agora, não posso esquecer esse prazo"). |
| **Tela inicial** | Lista de orçamentos → converte em "Pedido". |
| **Fluxo** | Confirma cliente, medidas, material → define data prometida de entrega → app agenda lembrete automático (2 dias antes). |
| **Valor percebido** | "Não preciso mais anotar na caderneta. O app lembra pra mim." |
| **Frequência** | 2–3× por semana. |
| **Critério de sucesso** | 100% dos pedidos aceitos têm data de entrega cadastrada e lembrete ativo. |

## Trigger 3: "Lembrete: pedido do João vence quinta — já cortou a chapa?"

| | |
|---|---|
| **Gatilho** | Notificação push do app (2 dias antes do prazo). |
| **Emoção** | Alerta + controle ("ainda dá tempo de não atrasar"). |
| **Tela inicial** | Detalhes do pedido + foto do projeto + check-list mental. |
| **Fluxo** | Visualiza pedido → vê foto com anotações → toma ação (cortar chapa, ligar para instalador). |
| **Valor percebido** | "Antes eu esquecia e descobria no dia da entrega. Agora o app me salva." |
| **Frequência** | 2–3× por semana. |
| **Critério de sucesso** | Taxa de atraso ≤ 5% (hoje: ~20%). |

## Trigger 4: "Preciso mostrar pro instalador como é a obra"

| | |
|---|---|
| **Gatilho** | Instalador vai executar o pedido; dono precisa passar as informações visuais. |
| **Emoção** | Frustração com desenhos rabiscados ilegíveis; quer algo claro e no celular. |
| **Tela inicial** | Galeria de projetos → abre projeto do cliente. |
| **Fluxo** | Abre foto do ambiente com anotações de medida e observações → mostra para instalador ou envia por WhatsApp. |
| **Valor percebido** | "O instalador não mais chega no local e fala 'não entendi seu desenho'. Agora é uma foto com as medidas em cima." |
| **Frequência** | 2–4× por semana. |
| **Critério de sucesso** | 100% dos pedidos executados têm foto-anotação associada. |

## Trigger 5: "Quanto já orçei esse mês?"

| | |
|---|---|
| **Gatilho** | Fim de semana ou início do mês; dono quer entender como está indo o negócio. |
| **Emoção** | Curiosidade + necessidade de controle simples (sem contador, sem ERP). |
| **Tela inicial** | Dashboard com resumo: orçamentos do mês, pedidos aceitos, entregas pendentes, receita estimada. |
| **Fluxo** | Visualiza cards de resumo → toca para ver lista → opcionalmente exporta resumo simples (PDF/Excel). |
| **Valor percebido** | "Antes eu não sabia quanto tinha orçado até juntar os papelotes. Agora vejo numa tela." |
| **Frequência** | 2–4× por mês. |
| **Critério de sucesso** | Resumo gerado em ≤ 3 toques. |

## Trigger 6: "Cliente ligou perguntando se o orçamento ainda vale"

| | |
|---|---|
| **Gatilho** | Cliente retorna depois de dias/semanas; dono precisa achar orçamento antigo rápido. |
| **Emoção** | Pressa + medo de perder venda por não achar o valor cobrado. |
| **Tela inicial** | Busca por nome do cliente ou data → abre orçamento salvo. |
| **Fluxo** | Digita nome do cliente → encontra orçamento → vê medidas, material, preço → reenvia por WhatsApp ou ajusta se necessário. |
| **Valor percebido** | "Antes eu perdia meia hora procurando papel. Agora acho em 10 segundos." |
| **Frequência** | 1–2× por semana. |
| **Critério de sucesso** | Orçamento localizado em ≤ 10 segundos. |

## Frequência resumida

| Gatilho | Frequência | Impacto no MVP |
|---|---|---|
| T1 — Orçar no local | 3–5×/dia | **Core** |
| T2 — Converter em pedido | 2–3×/semana | **Core** |
| T3 — Lembrete de entrega | 2–3×/semana | **Core** |
| T4 — Mostrar projeto para instalador | 2–4×/semana | **Core** |
| T5 — Resumo mensal | 2–4×/mês | **Nice-to-have** (v2) |
| T6 — Reabrir orçamento antigo | 1–2×/semana | **Core** |

---

> **Nota:** Todos os fluxos são offline-first (funcionam sem internet no local do cliente) e sincronizam quando há conexão.
