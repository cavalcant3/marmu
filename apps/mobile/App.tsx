import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Header from "./src/components/ui/Header";
import BottomTabBar, { TabType } from "./src/components/ui/BottomTabBar";
import Fab from "./src/components/ui/Fab";

import DashboardScreen from "./src/screens/Dashboard";
import NovoOrcamentoScreen from "./src/screens/NovoOrcamento";
import VisualizarOrcamentoScreen from "./src/screens/VisualizarOrcamento";
import ListaOrcamentosScreen from "./src/screens/ListaOrcamentos";
import ListaPedidosScreen from "./src/screens/ListaPedidos";
import DetalhesPedidoScreen from "./src/screens/DetalhesPedido";
import TabelaPrecosScreen from "./src/screens/TabelaPrecos";
import PerfilUsuarioScreen from "./src/screens/PerfilUsuario";
import AgendaMedicaoScreen from "./src/screens/AgendaMedicao";
import { useAuthStore } from "./src/stores/authStore";
import notifee, { EventType } from "@notifee/react-native";
import { ensureNotificationChannel, getNotificationTarget, handleNotificationEvent, syncAllNotifications } from "./src/services/notificationService";
import { listPedidos } from "./src/services/pedidoService";

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>("dashboard");
  const [subScreen, setSubScreen] = useState<string | null>(null);

  const [orcamentoData, setOrcamentoData] = useState<any>(null);
  const [pedidoData, setPedidoData] = useState<any>(null);

  const loadTokens = useAuthStore((state) => state.loadTokens);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    loadTokens();
    ensureNotificationChannel().then(() => syncAllNotifications()).catch(console.error);

    const openFromNotification = async (notification: any) => {
      const target = getNotificationTarget(notification);
      if (target === "agenda") {
        setCurrentTab("dashboard");
        setSubScreen(null);
        setTimeout(() => setSubScreen("agendamedicao"), 0);
      } else if (target === "pedidos") {
        const pedido = (await listPedidos()).find((item) => item.id === notification?.data?.entityId);
        if (pedido) {
          setPedidoData(pedido);
          setSubScreen("detalhespedido");
        } else {
          setCurrentTab("pedidos");
          setSubScreen(null);
        }
      }
    };

    notifee.getInitialNotification().then(async (initial) => {
      if (!initial) return;
      await handleNotificationEvent({ type: EventType.ACTION_PRESS, detail: { notification: initial.notification, pressAction: initial.pressAction } } as any);
      await openFromNotification(initial.notification);
    }).catch(console.error);

    return notifee.onForegroundEvent(async (event) => {
      await handleNotificationEvent(event);
      if (event.type === EventType.PRESS || event.type === EventType.ACTION_PRESS) {
        await openFromNotification(event.detail.notification);
      }
    });
  }, []);

  const navigation = {
    navigate: (name: string, params?: any) => {
      const lower = name.toLowerCase();
      if (lower === "dashboard") {
        setCurrentTab("dashboard");
        setSubScreen(null);
      } else if (lower === "listaorcamentos") {
        setCurrentTab("orcamentos");
        setSubScreen(null);
      } else if (lower === "listapedidos") {
        setCurrentTab("pedidos");
        setSubScreen(null);
      } else if (lower === "tabelaprecos") {
        setCurrentTab("precos");
        setSubScreen(null);
      } else {
        if (params?.orcamento) setOrcamentoData(params.orcamento);
        if (params?.pedido) setPedidoData(params.pedido);
        setSubScreen(lower);
      }
    },
    goBack: () => setSubScreen(null),
  };



  const renderScreen = () => {
    if (subScreen === "perfilusuario") {
      return <PerfilUsuarioScreen navigation={navigation} />;
    }
    if (subScreen === "novoorcamento") {
      return <NovoOrcamentoScreen navigation={navigation} />;
    }
    if (subScreen === "visualizarorcamento") {
      return <VisualizarOrcamentoScreen route={{ params: { orcamento: orcamentoData } }} navigation={navigation} />;
    }
    if (subScreen === "detalhespedido") {
      return <DetalhesPedidoScreen route={{ params: { pedido: pedidoData } }} navigation={navigation} />;
    }
    if (subScreen === "agendamedicao") {
      return <AgendaMedicaoScreen navigation={navigation} />;
    }
    switch (currentTab) {
      case "dashboard":
        return <DashboardScreen navigation={navigation} />;
      case "orcamentos":
        return <ListaOrcamentosScreen navigation={navigation} />;
      case "pedidos":
        return <ListaPedidosScreen navigation={navigation} />;
      case "precos":
        return <TabelaPrecosScreen navigation={navigation} />;
      default:
        return <DashboardScreen navigation={navigation} />;
    }
  };

  const displayName = user?.nome || (user?.email ? user.email.split("@")[0] : "Usuário");

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={["top"]}>
        <Header
          userName={displayName}
          onProfilePress={() => navigation.navigate("perfilusuario")}
        />

        <View style={styles.body}>{renderScreen()}</View>

        {!subScreen && (
          <Fab label="Novo Orçamento" onPress={() => navigation.navigate("novoorcamento")} />
        )}

        <BottomTabBar
          currentTab={currentTab}
          onTabChange={(tab) => {
            setSubScreen(null);
            setCurrentTab(tab);
          }}
        />

        <StatusBar style="dark" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9ff",
  },
  body: {
    flex: 1,
  },
});
