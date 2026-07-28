---
epic_id: 02-orcamento-no-local
status: ready
owner: Tony Stark
linked_prd: E01, E02, E03
linked_architecture: apps/mobile/src/screens/NovoOrcamento.tsx, apps/api/src/controllers/orcamentoController.ts
trigger_map_row: T1
priority: 2
estimate: XL
---

# Epic 02: Orçamento no Local (Core)

## Outcome
Dono da marmoaria chega na casa do cliente, abre o app, digita medidas, escolhe material, vê preço calculado, gera PDF e envia por WhatsApp — tudo em menos de 5 minutos, mesmo offline.

## Stories
- E02-S01: CRUD de materiais no backend (API + DB)
- E02-S02: Tela de tabela de preços no app (cadastrar/editar materiais)
- E02-S03: Tela "Novo Orçamento" (formulário de medidas + cálculo)
- E02-S04: Seleção de material com busca e cálculo automático de preço
- E02-S05: Geração de PDF do orçamento (layout + dados)
- E02-S06: Compartilhamento via WhatsApp (intent Android + PDF)
- E02-S07: Salvar orçamento no SQLite local (offline-first)
- E02-S08: Sincronização de orçamentos com backend

## Dependencies
- Epic 01 (auth + infra) completo
- Tabela de preços populada com dados reais da CNC Mármores

## Success
- Orçamento criado do início ao PDF em ≤ 5 minutos
- PDF contém: nome da marmoaria, dados do cliente, medidas, material, preço, validade
- WhatsApp abre com contato selecionado e PDF anexado
- Orçamentos salvos localmente mesmo sem internet; sync quando online
