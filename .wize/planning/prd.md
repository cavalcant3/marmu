---
status: validated
owner: Maria Hill
created: 2026-07-27
---

# PRD — Marmu

## Goals

1. **Orçamento em 5 minutos no local do cliente.** (métrica: tempo médio de orçamento do início ao envio; target: ≤ 5 min; deadline: MVP; trigger-map: T1)
2. **Zero pedidos esquecidos.** (métrica: taxa de pedidos aceitos com data de entrega cadastrada e lembrete ativo; target: 100%; deadline: MVP; trigger-map: T2)
3. **Entregas sem atraso.** (métrica: taxa de atraso na entrega; target: ≤ 5% vs. baseline ~20%; deadline: MVP+30 dias; trigger-map: T3)
4. **Projetos visuais para todos os pedidos.** (métrica: proporção de pedidos com foto-anotação; target: ≥ 80%; deadline: MVP; trigger-map: T4)

## Scope

### In scope

- **Orçamento rápido no local (T1)** — Digitar dimensões (comprimento × largura), selecionar material da tabela pré-configurada, calcular m² automaticamente, sugerir preço com base na tabela, permitir ajuste manual, gerar PDF e compartilhar via WhatsApp.
- **Tabela de preços configurável** — CRUD de materiais (granito, mármore, porcelanato, etc.) com preço por m², acabamentos opcionais e margem padrão.
- **Conversão orçamento → pedido (T2)** — Transformar orçamento aprovado em pedido com: cliente, medidas, material, data prometida de entrega. Agendamento automático de lembrete push (2 dias antes).
- **Foto-anotação do projeto (T4)** — Tirar foto do ambiente, anotar medidas e observações em cima da imagem (sobreposição simples de texto/setas), salvar vinculado ao pedido.
- **Lembretes automáticos (T3)** — Push notification 2 dias antes do prazo de entrega; snooze e dismiss.
- **Histórico e busca de orçamentos (T6)** — Lista de orçamentos com busca por nome do cliente, data ou material; reabrir, editar, reenviar.
- **Dashboard resumido (T5 v2)** — Cards: orçamentos do mês, pedidos aceitos, entregas pendentes, receita estimada.
- **Offline-first** — Todos os fluxos funcionam sem internet; sincronização automática quando houver conexão.
- **Backend e autenticação** — API REST para sincronização de dados; login do gestor da marmoaria; backup automático na nuvem.
- **LGPD básico** — Armazenamento local criptografado de dados pessoais de clientes; consentimento implícito ao cadastrar; possibilidade de exportar/deletar dados do cliente.

### Out of scope

- **Estoque de chapas** — O app não controla o que existe no depósito. Motivo: foco é orçamento e entrega, não gestão de insumos.
- **Financeiro / NFe** — Sem controle de contas a pagar/receber, sem emissão de nota fiscal. Motivo: caderneta digital, não ERP.
- **Multiusuário / perfis de equipe** — Apenas o dono usa o app por enquanto. Motivo: MVP para validar com um único gestor. Backend e auth serão single-user inicialmente.
- **Marketplace / descoberta de clientes** — Não conecta novos clientes à marmoaria. Motivo: o cliente entra pelo fluxo da marmoaria.
- **Versão iOS** — Foco Android inicial. Motivo: React Native permite porte futuro; validar no Android primeiro.
- **Versão web / desktop** — Apenas app mobile/tablet. Motivo: o gestor trabalha no campo.
- ~~**Sincronização em nuvem com múltiplos dispositivos**~~ — **DECISÃO ALTERADA:** agora IN SCOPE. Backend com autenticação e sincronização será implementado.

## Backbone (coarse stories)

- **E01 — Orçamento no local:** Como dono da marmoaria, quero digitar as medidas da bancada, escolher o material e ver o preço sugerido, para que eu possa fechar o orçamento em 5 minutos no local do cliente.
- **E02 — Tabela de preços:** Como dono da marmoaria, quero cadastrar e editar os preços por m² dos meus materiais, para que os orçamentos sejam calculados corretamente automaticamente.
- **E03 — Compartilhamento:** Como dono da marmoaria, quero gerar um PDF do orçamento e enviar diretamente pelo WhatsApp, para que o cliente receba a proposta profissional ali mesmo.
- **E04 — Pedido e lembrete:** Como dono da marmoaria, quero converter um orçamento aprovado em pedido com data de entrega, para que o app me lembre automaticamente antes do prazo vencer.
- **E05 — Foto-anotação:** Como dono da marmoaria, quero tirar foto do ambiente e anotar as medidas em cima da imagem, para que eu e o instalador entendamos o projeto sem papel.
- **E06 — Histórico de orçamentos:** Como dono da marmoaria, quero buscar orçamentos antigos por nome do cliente ou data, para que eu reabra ou reenvie em segundos.
- **E07 — Dashboard resumido:** Como dono da marmoaria, quero ver um resumo mensal de orçamentos e pedidos, para que eu tenha controle do negócio sem planilhas.

## Acceptance criteria

### E01 — Orçamento no local
- **AC-01-1:** Dado que o dono abre o app no dashboard, quando toca em "Novo Orçamento", então a tela de orçamento abre em ≤ 1s.
- **AC-01-2:** Dado que o dono digita comprimento (2,40m) e largura (0,60m), quando confirma, então o app calcula a área (1,44m²) e exibe em ≤ 500ms.
- **AC-01-3:** Dado que o dono seleciona um material da tabela, quando a área está calculada, então o app sugere o preço (área × preço/m²) em ≤ 500ms.
- **AC-01-4:** Dado o preço sugerido, quando o dono ajusta o valor manualmente, então o novo valor é registrado e exibido como "preço final".
- **AC-01-5:** Dado que o app está offline, quando o dono cria um orçamento, então ele é salvo localmente e sincronizado quando houver conexão.
- **AC-01-6:** Dado um orçamento salvo, quando o dono toca em "Compartilhar", então o app gera um PDF com: nome da marmoaria, dados do cliente, medidas, material, preço final, data de validade.

### E02 — Tabela de preços
- **AC-02-1:** Dado que o dono acessa "Configurações → Tabela de Preços", quando toca em "Adicionar material", então pode cadastrar: nome, tipo (granito/mármore/porcelanato/outro), preço por m², observações.
- **AC-02-2:** Dado um material cadastrado, quando o dono edita o preço, então todos os orçamentos futuros usam o novo valor; orçamentos antigos mantêm o valor histórico.
- **AC-02-3:** Dado que há materiais na tabela, quando o dono cria um orçamento, então a lista de materiais é exibida ordenada alfabeticamente com busca.

### E03 — Compartilhamento
- **AC-03-1:** Dado um orçamento pronto, quando o dono toca em "Enviar por WhatsApp", então o app abre o seletor de contatos do WhatsApp com o PDF anexado e texto pré-preenchido.
- **AC-03-2:** Dado que o WhatsApp não está instalado, quando o dono tenta compartilhar, então o app exibe opção "Salvar PDF" e "Compartilhar via..." (e-mail, Telegram, etc.).
- **AC-03-3:** Dado um PDF gerado, quando o cliente o abre, então ele contém: cabeçalho com nome da marmoaria, data do orçamento, dados do cliente, descrição do projeto (medidas, material), preço final, validade do orçamento (7 dias padrão, configurável).

### E04 — Pedido e lembrete
- **AC-04-1:** Dado um orçamento aprovado, quando o dono toca em "Converter em Pedido", então o app solicita: confirmação do cliente, data prometida de entrega, observações.
- **AC-04-2:** Dado um pedido com data de entrega, quando o app agenda o lembrete, então uma notificação push é programada para 2 dias antes do prazo às 08h00.
- **AC-04-3:** Dado um lembrete ativo, quando o dono toca na notificação, então o app abre a tela do pedido com foto-anotação e detalhes.
- **AC-04-4:** Dado um pedido concluído, quando o dono marca como "Entregue", então o lembrete é cancelado e o pedido move-se para "Histórico de Entregas".

### E05 — Foto-anotação
- **AC-05-1:** Dado um pedido em andamento, quando o dono toca em "Adicionar foto", então o app abre a câmera ou galeria para seleção de imagem.
- **AC-05-2:** Dado uma foto selecionada, quando o dono toca na imagem, então pode adicionar texto (medidas, observações) e setas em posições arbitrárias.
- **AC-05-3:** Dado um projeto com foto-anotação, quando o dono abre o pedido, então a imagem é exibida em tela cheia com anotações sobrepostas.
- **AC-05-4:** Dado que o app está offline, quando o dono tira foto e anota, então a imagem é salva localmente e sincronizada quando houver conexão.

### E06 — Histórico de orçamentos
- **AC-06-1:** Dado que o dono acessa "Orçamentos", quando a tela abre, então exibe lista ordenada por data (mais recente primeiro) com: nome do cliente, data, valor, status (pendente/aprovado/rejeitado/vencido).
- **AC-06-2:** Dado a lista de orçamentos, quando o dono digita no campo de busca, então filtra por nome do cliente, material ou data em ≤ 500ms.
- **AC-06-3:** Dado um orçamento encontrado na busca, quando o dono o seleciona, então pode reabrir, editar ou reenviar via WhatsApp.

### E07 — Dashboard resumido
- **AC-07-1:** Dado que o dono abre o app, quando está na tela inicial, então vê cards: (a) orçamentos este mês, (b) pedidos aceitos pendentes, (c) entregas esta semana, (d) receita estimada do mês.
- **AC-07-2:** Dado um card no dashboard, quando o dono toca nele, então navega para a lista detalhada correspondente.
- **AC-07-3:** Dado o dashboard, quando o dono puxa para baixo (pull-to-refresh), então os dados são atualizados em ≤ 2s.

## Constraints

- **Deadline:** Prazo revisado **6–8 semanas** (a confirmar com Cavalcante — ver Nota de risco).
- **Marmoaria-parceira piloto:** CNC Mármores e Granitos.
- **Budget:** A definir — avaliar necessidade de designer UI/UX e dev mobile adicional.
- **Compliance:** LGPD — dados de clientes (nome, endereço, telefone) armazenados localmente no celular; sem backend centralizado no MVP.
- **Integrações:** WhatsApp (compartilhamento nativo via intent/Android Sharesheet); PDF generation nativo; API REST (backend).
- **Equipe:** React Native (Android) + Backend (a definir: Node.js, Python, etc.); a definir se há designer dedicado.
- **Tecnologia:** React Native, SQLite/local storage (offline cache), Backend/API (REST), react-native-share, react-native-pdf-lib ou similar.

## Assumptions

- A marmoaria-parceira piloto terá um Android disponível para testes semanalmente. — *verificar até 2026-08-03.*
- O gestor da marmoaria tem WhatsApp instalado e usa ativamente para comunicação com clientes. — *verificar na primeira entrevista.*
- A trena do gestor mede em metros/centímetros (sistema métrico). — *confirmado implicitamente pelo brief.*
- O celular do gestor tem câmera funcional e armazenamento suficiente para fotos. — *verificar na primeira entrevista.*
- Preços por m² são suficientes para orçamento; não há necessidade de calcular cortes complexos ou perdas de material no MVP. — *validar com marmoaria-parceira até 2026-08-03.*

## Nota de risco — Prazo

O prazo inicial sugerido foi de **2 semanas**, considerado inviável para o escopo completo (6 épicos core + offline-first + PDF + notificações + foto-anotação). **Decisão do produto (Cavalcante): manter escopo completo e estender prazo.**

**Prazo revisado:** A definir entre Cavalcante e o time — sugerido **6–8 semanas** para entrega de todos os épicos E01–E07 com qualidade.

**Planejamento sugerido:**
- **Sprint 1 (semanas 1–2):** E01 + E02 + E03 (orçamento, tabela, compartilhamento) — core do valor.
- **Sprint 2 (semanas 3–4):** E04 + E06 (pedido/lembrete + histórico/busca) — gestão pós-orçamento.
- **Sprint 3 (semanas 5–6):** E05 + E07 (foto-anotação + dashboard) — diferenciais visuais.
- **Sprint 4 (semanas 7–8):** Polimento, testes na CNC Mármores e Granitos, ajustes finais.

## Dependencies

- Design system / componentes visuais da Mantis (se houver) — target: antes do início do desenvolvimento.
- Acesso semanal à marmoaria-parceira para testes de usabilidade — target: durante todo o ciclo de desenvolvimento.
- Conta de desenvolvedor Google Play (para distribuição interna/TestFlight equivalente) — target: antes da primeira entrega funcional.

## NFR pointer

Ver `.wize/planning/nfr-principles.md` (quando criado por Fury). Recomendações para este projeto:

- **Performance:** Startup do app ≤ 2s em Android mid-range (Moto G nível). Cálculo de orçamento ≤ 500ms.
- **Offline-first:** 100% dos fluxos core funcionam sem internet. Sincronização transparente quando online.
- **Acessibilidade:** Tamanho de fonte ajustável (respect system font size), contraste adequado para uso externo (sol/sombra).
- **Segurança:** Dados locais criptografados (SQLCipher ou similar); sem backend = sem vazamento remoto.
- **Bateria:** Notificações locais (não push remoto) para lembretes; sem polling contínuo.

## Open questions

- [x] **(blocker)** Qual é a marmoaria-parceira piloto (nome, local, contato do gestor)? — *owner: Cavalcante* → **CNC Mármores e Granitos.**
- [x] **(blocker)** Qual é o envelope de tempo para o MVP (4 semanas? 8 semanas? 12?)? — *owner: Cavalcante* → **2 semanas — ESCOPO REDUZIDO RECOMENDADO (ver Nota de risco).**
- [x] **(important)** O gestor da marmoaria piloto tem Android? Qual modelo e versão do SO? — *owner: Cavalcante* → **Tem Android; modelo e versão do SO a confirmar.**
- [ ] **(important)** Há necessidade de múltiplas tabelas de preço (ex: preço diferente para atacado/varejo)? — *owner: Cavalcante, by: 2026-08-03*
- [ ] **(nice-to-know)** Já existe um nome de marca ou domínio registrado para o app? — *owner: Cavalcante*
- [ ] **(nice-to-know)** O gestor quer que os dados sejam exportáveis (CSV, Excel) para contador? — *owner: Cavalcante, by: 2026-08-03*

## Validation log — 2026-07-27

**Status:** validated

**Signatories**
- Maria Hill (PM) — concerns: none
- Pepper Potts (Analyst) — concerns: none; trigger-map T1–T6 cobertos; T5 (dashboard) v2 aceito.
- Mantis (UX) — concerns: none; todas as telas implicadas pelos ACs existem no trigger-map ou são inferíveis (Configurações, Tabela de Preços).
- Fury (Solution Strategy) — concerns: n/a; `nfr-principles.md` ainda não criado — será produzido em `wize-tech-vision`.

**Checklist summary**
| Check | Result |
|---|---|
| Completeness (goals, scope, backbone, ACs, constraints, assumptions, dependencies, NFR pointer, open questions) | ✅ Pass |
| Quality (observable ACs, no vague adjectives, INVEST, no goal/constraint duplication) | ✅ Pass |
| Cross-checks (Pepper anchor, Mantis screen, Fury NFR, Hawkeye gate preview) | ✅ Pass* |
| Risk (no expired blockers, assumptions with verification plan) | ✅ Pass |

\* Fury NFR pointer refere-se a `.wize/planning/nfr-principles.md` que será criado em `wize-tech-vision`. Hawkeye gate preview será definido em `wize-tea-risk`.

**Notes**
- Prazo revisado de 2 → 6–8 semanas com escopo completo mantido (decisão Cavalcante).
- Todos os blockers resolvidos; nenhum impeditivo para entrar em Solutioning.
- Recomendação: Mantis inicia UX Scenarios em paralelo com Fury iniciando Tech Vision.
