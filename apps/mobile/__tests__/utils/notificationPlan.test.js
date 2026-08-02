const { createNotificationPlan } = require("../../src/utils/notificationPlan");

describe("planejamento de notificações", () => {
  const now = new Date(2026, 7, 1, 5, 0);
  const agenda = [
    { id: "A1", tipo: "MEDICAO", cliente_nome: "Cliente A", endereco: "Rua A", data: "2026-08-01", hora: "09:00", status: "PENDENTE" },
    { id: "A2", tipo: "VISITA", cliente_nome: "Cliente B", endereco: "Rua B", data: "2026-08-01", hora: "14:00", status: "CONCLUIDO" },
  ];
  const pedidos = [{ id: "P1", cliente_nome: "Cliente C", data_prometida_entrega: "03/08/2026", status: "PENDENTE" }];

  test("cria os três resumos do dia e o aviso 30 minutos antes", () => {
    const plan = createNotificationPlan(agenda, pedidos, now, 1);
    expect(plan.map((item) => item.id)).toEqual(expect.arrayContaining([
      "marmu-dia-2026-08-01-06", "marmu-dia-2026-08-01-12", "marmu-dia-2026-08-01-17", "marmu-agenda-A1",
    ]));
    expect(plan.find((item) => item.id === "marmu-agenda-A1").timestamp).toBe(new Date(2026, 7, 1, 8, 30).getTime());
  });

  test("avisa dois dias antes da entrega e ignora itens concluídos", () => {
    const plan = createNotificationPlan(agenda, pedidos, now, 1);
    expect(plan.find((item) => item.id === "marmu-entrega-P1").timestamp).toBe(new Date(2026, 7, 1, 8, 0).getTime());
    expect(plan.some((item) => item.id === "marmu-agenda-A2")).toBe(false);
  });

  test("não agenda horários que já passaram", () => {
    const late = createNotificationPlan(agenda, pedidos, new Date(2026, 7, 1, 18, 0), 1);
    expect(late).toHaveLength(0);
  });
});
