---
status: ready-for-prd
owner: Pepper Potts
created: 2026-07-27
---

# Brief — Marmu

## Vision

Um app que substitui a caderneta de orçamento do dono de marmoaria. No local do cliente, ele mede com a trena, digita as dimensões no celular, escolhe o material e o app calcula o preço automaticamente. Gera um PDF ou envia por WhatsApp ali mesmo. Se o cliente aceita, o dono cadastra o pedido com data prometida e o app lembra ele 2 dias antes do prazo. Ainda permite tirar foto do ambiente e anotar medidas em cima da imagem — um "Instagram particular da obra" que substitui o papel e o desenho rabiscado. Tudo offline-first, sem burocracia.

## Audience

- **Primary:** Proprietário(a) ou gestor(a) de pequena marmoaria (1–10 funcionários, atua localmente). JTBD: "Fechar orçamentos rápido, evitar erros de medida e garantir que a entrega não atrase sem que eu perceba."
- **Secondary:** Funcionários da marmoaria (montadores/instaladores). JTBD: "Saber exatamente qual projeto devo executar hoje, com as medidas e o desenho na mão."
- **Stakeholders:** Clientes finais (moradores que contratam a marmoaria), fornecedores de chapas e insumos.

## Success criteria

1. Tempo médio para emitir um orçamento completo ≤ 15 minutos (hoje: ~1h com planilhas + WhatsApp).
2. Taxa de orçamentos aprovados ≥ 60% (hoje: estima-se ~30–40% devido à demora e falta de visualização).
3. Taxa de atraso na entrega ≤ 5% (hoje: estima-se ~20% por erro de agendamento ou medida).
4. Proporção de projetos com desenho 2D aprovado pelo cliente ≥ 80% (reduz retrabalho).

## Non-goals

- Não é ERP completo (sem contabilidade, folha de pagamento, compras de insumos integradas a fornecedores).
- Não é marketplace (não conecta clientes a marmoarias; o cliente entra pelo fluxo da marmoaria, não pelo app).
- Não é software CAD profissional (desenhos são foto + anotações simples em cima, não engenharia estrutural).
- Não é versão web para desktop (foco no app mobile/tablet do gestor; versão web pode vir depois).
- **Sem estoque** (não controla chapas no depósito).
- **Sem financeiro** (não emite nota fiscal, não controla contas a pagar/receber).
- **Sem nota fiscal** (orçamento é proposta comercial, não documento fiscal).

## Constraints

- **Deadline:** A definir — avaliar MVP para operação na marmoaria-parceira piloto.
- **Budget:** A definir — há envelope de investimento inicial?
- **Compliance:** LGPD (dados de clientes finais: nome, endereço, telefone).
- **Integrações:** A definir — necessário integrar com algum ERP existente (Bling, Tiny, etc.)?
- **Equipe:** A definir — time atual e necessidade de terceiros (designer, dev mobile).
- **Tecnologia:** React Native, foco inicial Android (possibilidade de iOS futuro sem reescrever).

## Open questions

- [x] **(blocker)** Qual plataforma inicial: iOS, Android ou ambos? — *owner: Cavalcante* → **Android via React Native (iOS futuro).**
- [x] **(blocker)** Há uma marmoaria-parceira piloto para validar o fluxo? — *owner: Cavalcante* → **Sim, confirmada.**
- [x] **(important)** Os desenhos 2D são feitos pelo próprio gestor ou por um profissional externo? — *owner: Cavalcante* → **Foto do ambiente + anotações simples (medidas, observações) em cima da imagem, feito pelo gestor no celular.**
- [x] **(important)** Os orçamentos hoje usam preço por m² de chapa + acabamentos, ou há tabela mais complexa? — *owner: Cavalcante* → **Preço por m² de chapa + tipo de material (granito/mármore/porcelanato) + possíveis acabamentos. Tabela configurada previamente pelo gestor.**
- [ ] **(nice-to-know)** Já existe um nome de marca ou domínio registrado para o app? — *owner: Cavalcante*
