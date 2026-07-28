import { useEffect, useCallback } from "react";
import notifee, { AndroidImportance, TriggerType } from "@notifee/react-native";

export function useNotificacoes() {
  useEffect(() => {
    async function init() {
      await notifee.requestPermission();
      await notifee.createChannel({
        id: "lembretes",
        name: "Lembretes de Entrega",
        importance: AndroidImportance.HIGH,
        sound: "default",
      });
    }
    init();
  }, []);

  const agendarLembrete = useCallback(
    async (pedidoId: string, clienteNome: string, dataEntrega: Date) => {
      const dataLembrete = new Date(dataEntrega);
      dataLembrete.setDate(dataEntrega.getDate() - 2);
      dataLembrete.setHours(8, 0, 0, 0);

      // Só agenda se a data do lembrete for no futuro
      if (dataLembrete <= new Date()) return;

      await notifee.createTriggerNotification(
        {
          id: `lembrete-${pedidoId}`,
          title: "⏰ Lembrete de Entrega",
          body: `Pedido do ${clienteNome} vence ${dataEntrega.toLocaleDateString("pt-BR")}. Já cortou a chapa?`,
          android: {
            channelId: "lembretes",
            pressAction: { id: "default" },
          },
          data: { pedidoId },
        },
        {
          type: TriggerType.TIMESTAMP,
          timestamp: dataLembrete.getTime(),
        }
      );
    },
    []
  );

  const cancelarLembrete = useCallback(async (pedidoId: string) => {
    await notifee.cancelNotification(`lembrete-${pedidoId}`);
  }, []);

  return { agendarLembrete, cancelarLembrete };
}
