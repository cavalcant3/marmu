import notifee, { AndroidImportance, AndroidNotificationSetting, AuthorizationStatus, EventType, TriggerType, type Event, type Notification, type TimestampTrigger } from "@notifee/react-native";
import { MMKV } from "../utils/storage";
import { listCompromissos } from "./agendaService";
import { listPedidos } from "./pedidoService";
import { createNotificationPlan } from "../utils/notificationPlan";

const CHANNEL_ID = "marmu-agenda";
const PREFIX = "marmu-";
const notificationStorage = new MMKV({ id: "marmu-notification-state" });
const ACK_KEY = "acknowledged";
const RESCHEDULE_KEY = "pending-reschedule";

export interface ReminderPermissionState {
  notifications: boolean;
  alarms: boolean;
}

function acknowledgedIds(): Set<string> {
  try {
    return new Set(JSON.parse(notificationStorage.getString(ACK_KEY) || "[]"));
  } catch {
    return new Set();
  }
}

function acknowledge(id?: string) {
  if (!id) return;
  const ids = acknowledgedIds();
  ids.add(id);
  notificationStorage.set(ACK_KEY, JSON.stringify([...ids].slice(-300)));
}

function actions(target: string) {
  return [
    { title: "Lembrar mais tarde", pressAction: { id: "snooze" } },
    { title: target === "pedidos" ? "Ver pedido" : "Reagendar", pressAction: { id: target === "pedidos" ? "open" : "reschedule", launchActivity: "default" } },
    { title: "✕ Fechar", pressAction: { id: "acknowledge" } },
  ];
}

function androidOptions(target = "agenda") {
  return {
    channelId: CHANNEL_ID,
    importance: AndroidImportance.HIGH,
    pressAction: { id: "default" },
    actions: actions(target),
    autoCancel: false,
    smallIcon: "ic_launcher",
  } as const;
}

export async function ensureNotificationChannel(): Promise<void> {
  await notifee.createChannel({
    id: CHANNEL_ID,
    name: "Agenda e prazos",
    description: "Medições, instalações, visitas e prazos de entrega",
    importance: AndroidImportance.HIGH,
    vibration: true,
    sound: "default",
  });
}

export async function getReminderPermissionState(): Promise<ReminderPermissionState> {
  const settings = await notifee.getNotificationSettings();
  return {
    notifications: settings.authorizationStatus === AuthorizationStatus.AUTHORIZED || settings.authorizationStatus === AuthorizationStatus.PROVISIONAL,
    alarms: settings.android.alarm === AndroidNotificationSetting.ENABLED,
  };
}

export async function requestReminderPermissions(): Promise<ReminderPermissionState> {
  await ensureNotificationChannel();
  await notifee.requestPermission();
  return getReminderPermissionState();
}

export async function openAlarmSettings(): Promise<void> {
  await notifee.openAlarmPermissionSettings();
}

export async function openNotificationSettings(): Promise<void> {
  await notifee.openNotificationSettings();
}

export async function syncAllNotifications(): Promise<boolean> {
  await ensureNotificationChannel();
  const permission = await getReminderPermissionState();
  if (!permission.notifications || !permission.alarms) return false;

  const triggerIds = await notifee.getTriggerNotificationIds();
  await Promise.all(triggerIds.filter((id) => id.startsWith(PREFIX)).map((id) => notifee.cancelTriggerNotification(id)));

  const [compromissos, pedidos] = await Promise.all([listCompromissos(), listPedidos()]);
  const acknowledged = acknowledgedIds();
  const plan = createNotificationPlan(compromissos, pedidos, new Date(), 7);
  for (const item of plan) {
    if (acknowledged.has(item.id)) continue;
    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: item.timestamp,
      alarmManager: { allowWhileIdle: true },
    };
    await notifee.createTriggerNotification({
      id: item.id,
      title: item.title,
      body: item.body,
      data: {
        target: item.target,
        kind: item.kind,
        entityId: item.entityId || "",
      },
      android: androidOptions(item.target),
    }, trigger);
  }
  return true;
}

async function snoozeNotification(notification: Notification): Promise<void> {
  if (!notification.id) return;
  acknowledge(notification.id);
  const snoozeId = `${notification.id}-snooze-${Date.now()}`;
  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: Date.now() + 30 * 60 * 1000,
    alarmManager: { allowWhileIdle: true },
  };
  await notifee.createTriggerNotification({
    id: snoozeId,
    title: notification.title || "Lembrete Marmu",
    body: notification.body || "Você pediu para ser lembrado novamente.",
    data: notification.data,
    android: androidOptions(String(notification.data?.target || "agenda")),
  }, trigger);
  await notifee.cancelNotification(notification.id);
}

export async function handleNotificationEvent({ type, detail }: Event): Promise<void> {
  const notification = detail.notification;
  if (!notification?.id?.startsWith(PREFIX)) return;
  if (type === EventType.DISMISSED) {
    acknowledge(notification.id);
    return;
  }
  if (type === EventType.PRESS) {
    acknowledge(notification.id);
    return;
  }
  if (type !== EventType.ACTION_PRESS) return;
  const action = detail.pressAction?.id;
  if (action === "snooze") {
    await snoozeNotification(notification);
    return;
  }
  acknowledge(notification.id);
  if (action === "reschedule") {
    notificationStorage.set(RESCHEDULE_KEY, JSON.stringify({ target: notification.data?.target || "agenda", entityId: notification.data?.entityId || "" }));
  }
  await notifee.cancelNotification(notification.id);
}

export function consumePendingReschedule(): { target: string; entityId: string } | null {
  const raw = notificationStorage.getString(RESCHEDULE_KEY);
  if (!raw) return null;
  notificationStorage.delete(RESCHEDULE_KEY);
  try { return JSON.parse(raw); } catch { return null; }
}

export function getNotificationTarget(notification?: Notification): "agenda" | "pedidos" | null {
  const target = notification?.data?.target;
  return target === "pedidos" ? "pedidos" : target === "agenda" ? "agenda" : null;
}
