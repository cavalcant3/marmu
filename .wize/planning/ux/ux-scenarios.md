---
status: ready-for-design
owner: Mantis
created: 2026-07-27
covers_prd_stories: [E01, E02, E03, E04, E05, E06, E07]
---

# UX Scenarios — Marmu

## Scenario 1: Dono de marmoaria orça uma bancada no quintal do cliente

- **Trigger-map row:** T1
- **PRD stories:** E01, E02, E03
- **AC IDs touched:** AC-01-1, AC-01-2, AC-01-3, AC-01-4, AC-01-5, AC-01-6, AC-02-3, AC-03-1, AC-03-2, AC-03-3

**Q1 — Who:** João, 47 anos, dono da CNC Mármores e Granitos, usa celular Android todo dia. Não gosta de planilha e anota tudo em uma caderneta de capa dura.

**Q2 — State:** É terça-feira de manhã, ele acabou de chegar na casa de um cliente no bairro nobre. O sol tá forte, a trena tá na mão e o cliente espera ao lado da bancada da cozinha em reforma. João tá com pressa porque tem mais dois orçamentos pra fazer antes do almoço.

**Q3 — JTBD:** Fechar o orçamento da bancada ali mesmo — medir, calcular o preço e mandar pro cliente via WhatsApp em menos de 5 minutos, sem precisar voltar pro escritório.

**Q4 — Today:** Anota as medidas na caderneta, volta pro escritório, digita numa planilha do Excel no computador, calcula na calculadora, tira print e manda pro cliente no WhatsApp Web. Demora ~1 hora. Se o cliente não responder, esquece de acompanhar.

**Q5 — Moment of truth:** Quando ele digita 2,40m × 0,60m, escolhe "Granito Preto São Gabriel" e o app mostra "1,44m² × R$ 280/m² = R$ 403,20" em menos de 1 segundo. Ele ajusta pra R$ 420,00, toca "Enviar PDF no WhatsApp" e o cliente recebe a proposta profissional antes de João guardar a trena.

**Q6 — Failure mode:** Se o app travar porque não tem internet no quintal do cliente. Se ele não achar o material na lista porque esqueceu o nome que cadastrou. Se o PDF sair feio ou sem o nome da marmoaria. Se o WhatsApp não abrir direto com o contato do cliente.

**Q7 — Success in their words:** "Cara, eu medi, calculei e mandei pro cliente em 4 minutos. Em pé, no quintal dele. Antes eu só mandava isso de noite, depois de voltar pro escritório."

**Q8 — Next thing:** Guardar o celular, conversar com o cliente sobre prazo de entrega, e marcar a visita do instalador.

---

## Scenario 2: Cliente responde "pode fazer" e o dono converte em pedido

- **Trigger-map row:** T2
- **PRD stories:** E04
- **AC IDs touched:** AC-04-1, AC-04-2

**Q1 — Who:** João, 47 anos, dono da CNC Mármores e Granitos. Trabalha sozinho na gestão, tem 3 funcionários que só executam.

**Q2 — State:** É quarta de tarde, João tá no escritório da marmoaria. O cliente do orçamento de ontem respondeu no WhatsApp: "pode fazer". João sente alívio, mas também preocupação — ele já esqueceu pedidos antes e tomou multa por atraso.

**Q3 — JTBD:** Transformar o orçamento aceito em um pedido com data de entrega marcada, para que o app lembre ele antes do prazo vencer.

**Q4 — Today:** Anota na caderneta "João da Silva — bancada preto — entrega dia 15". Às vezes esquece de olhar a caderneta. Às vezes anota errado e promete pro cliente dia 15 quando só consegue dia 20.

**Q5 — Moment of truth:** Quando ele toca "Converter em Pedido", confirma o nome do cliente, define "entrega dia 15/08" e o app diz "Lembrete programado para 13/08 às 08h". Ele se sente seguro — "agora não esqueço".

**Q6 — Failure mode:** Se o app não deixar editar a data depois. Se não der pra colocar observações tipo "cliente só recebe depois das 14h". Se o lembrete não funcionar no Android dele porque ele desligou notificações sem querer.

**Q7 — Success in their words:** "Antes eu anotava na caderneta e esquecia. Agora o app me lembra 2 dias antes. Nunca mais atrasei entrega por esquecimento."

**Q8 — Next thing:** Abrir a lista de pedidos pendentes pra ver o que mais tá pra vencer essa semana.

---

## Scenario 3: Notificação de lembrete toca e o dono precisa lembrar da obra

- **Trigger-map row:** T3 + T4
- **PRD stories:** E04, E05
- **AC IDs touched:** AC-04-3, AC-04-4, AC-05-1, AC-05-2, AC-05-3

**Q1 — Who:** João, 47 anos, dono da CNC Mármores e Granitos. Acordou cedo pra organizar a produção da semana.

**Q2 — State:** É segunda-feira, 08h05. O celular tocou com notificação do app: "Pedido do João Silva vence quinta — já cortou a chapa?". João tava tomando café e ainda meio enrolado. A notificação trouxe foco imediato.

**Q3 — JTBD:** Lembrar exatamente qual é o projeto, ver as medidas e a foto da obra, e decidir se dá tempo de entregar no prazo.

**Q4 — Today:** Sem o app, ele teria esquecido até quarta de tarde, ligado pro cliente pedindo prazo, e perdido credibilidade. Ou teria ido no depósito, cortado a chapa errada por não lembrar das medidas exatas.

**Q5 — Moment of truth:** Quando ele toca na notificação e abre a tela do pedido — ali tá a foto da cozinha do cliente com as medidas anotadas em cima (2,40m × 0,60m, canto direito tem coluna). Ele lembra instantaneamente da obra e vê que a chapa já tá cortada.

**Q6 — Failure mode:** Se a foto não abrir porque o app precisa de internet pra carregar. Se as anotações na foto tiverem sumido. Se ele não conseguir marcar o pedido como "Entregue" com um toque simples.

**Q7 — Success in their words:** "Tocou a notificação, vi a foto da cozinha do cara, lembrei de tudo. Marquei como entregue e pronto. Antes eu descobria no dia que tinha atrasado."

**Q8 — Next thing:** Verificar o próximo lembrete da semana e avisar o instalador sobre o agendamento.

---

## Scenario 4: Cliente liga depois de 2 semanas perguntando se o orçamento ainda vale

- **Trigger-map row:** T6
- **PRD stories:** E06
- **AC IDs touched:** AC-06-1, AC-06-2, AC-06-3

**Q1 — Who:** João, 47 anos, dono da CNC Mármores e Granitos. Tá no meio da produção, sujo de pó de mármore, com as mãos ocupadas.

**Q2 — State:** É sexta-feira de tarde. Um cliente ligou perguntando "aquele orçamento da pia do banheiro, ainda vale?". João fez isso há duas semanas, não lembra o valor, não lembra se anotou na caderneta ou num papel solto.

**Q3 — JTBD:** Achar o orçamento antigo em segundos, confirmar o valor e reenviar pro cliente sem interromper a produção.

**Q4 — Today:** Para tudo, procura na caderneta, não acha. Procura no histórico do WhatsApp, rola 200 mensagens. Demora 20 minutos. O cliente fica no telefone esperando. No fim, refaz o orçamento de cabeça e pode errar o valor.

**Q5 — Moment of truth:** Quando ele digita "pia banheiro" na busca do app e em 2 segundos aparece o orçamento do cliente — medidas, material, preço, data. Ele toca "Reenviar PDF" e o cliente recebe no WhatsApp enquanto João continua trabalhando.

**Q6 — Failure mode:** Se a busca não achar por "pia" porque ele cadastrou como "lavabo". Se o PDF antigo não abrir. Se ele não conseguir editar o preço antes de reenviar (preços podem ter mudado).

**Q7 — Success in their words:** "O cara ligou, eu procurei no app, achei em 5 segundos e mandei de novo. Ele falou 'ué, que rápido'. Antes eu perdia meia hora."

**Q8 — Next thing:** Voltar pro corte da chapa e deixar o cliente decidir em paz.

---

## Scenario 5: Fim de mês, dono quer saber quanto orçou e quanto fechou

- **Trigger-map row:** T5
- **PRD stories:** E07
- **AC IDs touched:** AC-07-1, AC-07-2, AC-07-3

**Q1 — Who:** João, 47 anos, dono da CNC Mármores e Granitos. Sábado de manhã, no escritório, tomando café sozinho antes da família acordar.

**Q2 — State:** É o último sábado do mês. João precisa saber se o mês foi bom, quanto orçou, quanto fechou, quanto ainda falta entregar. Ele não tem contador fixo e não entende de planilhas.

**Q3 — JTBD:** Ver numa tela só: quantos orçamentos fez, quantos viraram pedido, quanto dinheiro isso representa, e o que tá pendente de entrega.

**Q4 — Today:** Junta os papelotes do mês, tenta somar na calculadora do celular, esquece algum orçamento que anotou num papel diferente. Demora 40 minutos e o número final nunca confere.

**Q5 — Moment of truth:** Quando ele abre o app e vê 4 cards: "Orçamentos: 18", "Pedidos: 12", "Entregas pendentes: 4", "Receita estimada: R$ 8.400". Ele toca em "Entregas pendentes" e vê a lista com datas. Finalmente tem controle.

**Q6 — Failure mode:** Se os números estiverem errados porque ele esqueceu de marcar um pedido como "Entregue". Se o card não mostrar o valor em reais. Se ele não conseguir exportar isso pro contador (mesmo que seja por WhatsApp com print).

**Q7 — Success in their words:** "Cara, eu sabia que tinha corrido atrás esse mês, mas ver 12 pedidos e 8 mil reais na tela... É a primeira vez que eu vejo meu negócio de verdade."

**Q8 — Next thing:** Tirar um print da tela e mandar pro contador no WhatsApp, ou simplesmente guardar essa informação pra conversar com a esposa sobre investir numa nova serra.

---

## Coverage check

| PRD story | Scenarios |
|---|---|
| E01 (Orçamento no local) | S1 |
| E02 (Tabela de preços) | S1 |
| E03 (Compartilhamento) | S1, S4 |
| E04 (Pedido e lembrete) | S2, S3 |
| E05 (Foto-anotação) | S3 |
| E06 (Histórico de orçamentos) | S4 |
| E07 (Dashboard resumido) | S5 |

> Todos os 7 épicos cobertos. Nenhum cenário duplicado — cada um tem trigger, emoção e JTBD distintos.
