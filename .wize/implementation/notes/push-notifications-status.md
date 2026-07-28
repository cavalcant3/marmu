---
created: 2026-07-28
owner: Claude (Shuri)
status: partially-implemented
---

# Push Notifications — Status e Pendências

## O que já está implementado ✅

### 1. Notifee instalado e configurado
- **Pacote:** `@notifee/react-native` v9.1.8
- **Local:** `apps/mobile/src/hooks/useNotificacoes.ts`
- **Funcionalidades:**
  - Solicitação de permissão ao iniciar o app
  - Criação do canal Android "Lembretes de Entrega" (alta prioridade + som)
  - Agendamento de notificações por timestamp (`TriggerType.TIMESTAMP`)
  - Cancelamento de notificações agendadas

### 2. Lógica de negócio
- **Arquivo:** `apps/mobile/src/hooks/useNotificacoes.ts`
- **Regras:**
  - Lembrete agendado para **2 dias antes** do prazo de entrega
  - Horário fixo: **08h00** (configurável)
  - Só agenda se a data do lembrete for **no futuro**
  - ID único por pedido: `lembrete-{pedidoId}`
- **Mensagem:** `"⏰ Pedido do {cliente} vence {data}. Já cortou a chapa?"`

### 3. Integração com telas
- **Tela:** `DetalhesPedido.tsx`
  - Agenda lembrete automaticamente ao visualizar um pedido pendente
  - Cancela lembrete ao marcar como "Entregue"
- **Dados:** `data: { pedidoId }` incluído na notificação para deep linking futuro

---

## O que ainda falta ⚠️

### 1. Permissões Android (OBRIGATÓRIO)

**Problema:** Android 12+ (API 31+) exige permissões específicas para alarmes exatos e notificações.

**Arquivos a modificar:**
```json
// apps/mobile/app.json
{
  "android": {
    "permissions": [
      "SCHEDULE_EXACT_ALARM",
      "POST_NOTIFICATIONS",
      "RECEIVE_BOOT_COMPLETED"
    ]
  }
}
```

```xml
<!-- apps/mobile/android/app/src/main/AndroidManifest.xml -->
<uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM" />
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
<uses-permission android:name="android.permission.WAKE_LOCK" />
```

**Por que importa:** Sem `SCHEDULE_EXACT_ALARM`, o Notifee não consegue disparar notificações em horários precisos (ex: exatamente às 08h00).

---

### 2. Handler de Boot (RECOMENDADO)

**Problema:** Se o usuário reiniciar o celular, todos os alarmes agendados são perdidos.

**Solução:** Reagendar todas as notificações ao ligar o device.

**Implementação sugerida:**
```typescript
// apps/mobile/src/services/bootService.ts
import notifee from '@notifee/react-native';
import { getPedidosPendentes } from './pedidoService';

export async function reagendarNotificacoesNoBoot() {
  const pedidos = await getPedidosPendentes();
  for (const pedido of pedidos) {
    await agendarLembrete(pedido.id, pedido.cliente_nome, pedido.data_entrega);
  }
}
```

**Configuração no AndroidManifest:**
```xml
<receiver android:name="com.notifee.boot.BootEventReceiver">
  <intent-filter>
    <action android:name="android.intent.action.BOOT_COMPLETED" />
  </intent-filter>
</receiver>
```

---

### 3. Deep Link (RECOMENDADO)

**Problema:** Ao tocar na notificação, o app abre na tela inicial, não na tela do pedido.

**Implementação sugerida:**
```typescript
// apps/mobile/src/hooks/useNotificacoes.ts
useEffect(() => {
  return notifee.onForegroundEvent(({ type, detail }) => {
    if (type === EventType.PRESS && detail.notification?.data?.pedidoId) {
      navigation.navigate('DetalhesPedido', { 
        pedidoId: detail.notification.data.pedidoId 
      });
    }
  });
}, []);
```

**Nota:** Requer passar o objeto `navigation` para o hook ou usar um event bus / navigation ref.

---

### 4. Teste em Device Real (OBRIGATÓRIO)

**Problema:** Notificações agendadas **não funcionam** no Expo Go ou no navegador. Precisam de build nativo.

**Como testar:**

1. **Com EAS Build (recomendado):**
```bash
cd apps/mobile
npx eas build --platform android --profile preview
# Instala o APK no celular da CNC Mármores
```

2. **Com emulador Android (alternativa):**
```bash
# Abrir Android Studio → AVD Manager → Pixel 4 com Google Play
npx expo run:android --device
```

3. **Teste manual:**
```typescript
// Adicionar botão de teste temporário em DevOnlyScreen
const testarNotificacao = async () => {
  const daqui5Segundos = new Date(Date.now() + 5000);
  await agendarLembrete('test-123', 'Cliente Teste', daqui5Segundos);
};
```

---

### 5. Fallback para Offline (NICE-TO-HAVE)

**Problema:** Se o app estiver offline quando o alarme disparar, a notificação aparece mas o usuário não consegue ver os dados atualizados do pedido.

**Solução:** Incluir todas as informações necessárias no corpo da notificação (já feito parcialmente).

---

## Checklist para colocar em produção

- [ ] Adicionar permissões no `app.json` e `AndroidManifest.xml`
- [ ] Implementar handler de boot para reagendar após reinício
- [ ] Implementar deep link ao tocar na notificação
- [ ] Testar em device Android real com EAS Build
- [ ] Verificar se notificação aparece com app fechado (background)
- [ ] Verificar se notificação aparece com app aberto (foreground)
- [ ] Testar cancelamento ao marcar como entregue
- [ ] Testar persistência após reiniciar o celular

---

## Referências

- [Notifee Docs — Triggers](https://notifee.app/react-native/docs/triggers)
- [Android 12 — Alarm permissions](https://developer.android.com/about/versions/12/behavior-changes-12#exact-alarm-permission)
- [Expo Notifications Guide](https://docs.expo.dev/push-notifications/overview/)

---

> **Nota:** O agendamento de notificações é a parte mais complexa de testar em React Native. Recomendo priorizar o teste em device real antes de investir mais tempo em edge cases.
