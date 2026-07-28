import { useEffect } from "react";

export function useNotificacoes() {
  useEffect(() => {
    // Placeholder for Notifee integration
    console.log("Notification service initialized");
  }, []);

  const agendarLembrete = (pedidoId: string, data: Date) => {
    console.log(`Scheduled reminder for ${pedidoId} at ${data.toISOString()}`);
  };

  return { agendarLembrete };
}
