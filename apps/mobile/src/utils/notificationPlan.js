function atLocalTime(dateKey, hours, minutes = 0) {
  const [year, month, day] = String(dateKey).split("-").map(Number);
  return new Date(year, month - 1, day, hours, minutes, 0, 0).getTime();
}

function brDateToKey(value) {
  const match = String(value || "").match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  return match ? `${match[3]}-${match[2]}-${match[1]}` : null;
}

function addDays(date, amount) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

function dateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function plural(count, singular, pluralText) {
  return `${count} ${count === 1 ? singular : pluralText}`;
}

function createNotificationPlan(compromissos, pedidos, now = new Date(), horizonDays = 7) {
  const plan = [];
  const activeAppointments = compromissos.filter((item) => item.status !== "CANCELADO");

  for (let offset = 0; offset < horizonDays; offset += 1) {
    const key = dateKey(addDays(now, offset));
    const dayAppointments = activeAppointments.filter((item) => item.data === key);
    const dayOrders = pedidos.filter((item) => brDateToKey(item.data_prometida_entrega) === key);
    if (dayAppointments.length === 0 && dayOrders.length === 0) continue;

    const pendingAppointments = dayAppointments.filter((item) => item.status === "PENDENTE");
    const doneAppointments = dayAppointments.filter((item) => item.status === "CONCLUIDO");
    const pendingOrders = dayOrders.filter((item) => item.status !== "ENTREGUE");
    const next = [...pendingAppointments].sort((a, b) => a.hora.localeCompare(b.hora))[0];
    const morningExtra = next ? ` Próximo: ${next.hora}, ${next.cliente_nome}.` : "";

    plan.push({
      id: `marmu-dia-${key}-06`, timestamp: atLocalTime(key, 6), target: "agenda", kind: "SUMMARY", entityId: "",
      title: "Bom dia! Agenda de hoje",
      body: `${plural(pendingAppointments.length, "compromisso", "compromissos")} e ${plural(pendingOrders.length, "entrega", "entregas")}.${morningExtra}`,
    });
    plan.push({
      id: `marmu-dia-${key}-12`, timestamp: atLocalTime(key, 12), target: "agenda", kind: "SUMMARY", entityId: "",
      title: "Atualização do meio-dia",
      body: `Feitos: ${doneAppointments.length}. Pendentes: ${pendingAppointments.length}. Entregas pendentes: ${pendingOrders.length}.`,
    });
    plan.push({
      id: `marmu-dia-${key}-17`, timestamp: atLocalTime(key, 17), target: "agenda", kind: "SUMMARY", entityId: "",
      title: pendingAppointments.length + pendingOrders.length > 0 ? "Pendências do dia" : "Dia concluído",
      body: pendingAppointments.length + pendingOrders.length > 0
        ? `Ainda restam ${plural(pendingAppointments.length, "compromisso", "compromissos")} e ${plural(pendingOrders.length, "entrega", "entregas")}.`
        : "Tudo concluído por hoje. Bom trabalho!",
    });
  }

  activeAppointments.filter((item) => item.status === "PENDENTE").forEach((item) => {
    const [hour, minute] = item.hora.split(":").map(Number);
    plan.push({
      id: `marmu-agenda-${item.id}`, timestamp: atLocalTime(item.data, hour, minute) - 30 * 60 * 1000,
      target: "agenda", kind: "APPOINTMENT", entityId: item.id,
      title: `${item.tipo === "MEDICAO" ? "Medição" : item.tipo === "INSTALACAO" ? "Instalação" : "Visita"} em 30 minutos`,
      body: `${item.cliente_nome} · ${item.hora} · ${item.endereco}`,
    });
  });

  pedidos.filter((item) => item.status !== "ENTREGUE").forEach((item) => {
    const deliveryKey = brDateToKey(item.data_prometida_entrega);
    if (!deliveryKey) return;
    const deliveryDate = new Date(`${deliveryKey}T12:00:00`);
    const reminderKey = dateKey(addDays(deliveryDate, -2));
    plan.push({
      id: `marmu-entrega-${item.id}`, timestamp: atLocalTime(reminderKey, 8), target: "pedidos", kind: "DELIVERY", entityId: item.id,
      title: "Prazo de entrega se aproximando",
      body: `${item.cliente_nome}: entrega combinada para ${item.data_prometida_entrega}.`,
    });
  });

  return plan.filter((item) => item.timestamp > now.getTime()).sort((a, b) => a.timestamp - b.timestamp).slice(0, 45);
}

module.exports = { brDateToKey, createNotificationPlan };
