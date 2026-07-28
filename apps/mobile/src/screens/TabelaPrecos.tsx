import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  Alert,
} from "react-native";
import { useMaterialStore } from "../stores/materialStore.js";
import { createMaterial } from "../services/materialService.js";

const TIPOS = ["GRANITO", "MARMORE", "PORCELANATO", "OUTRO"];

export default function TabelaPrecosScreen() {
  const materials = useMaterialStore((state) => state.materials);
  const addMaterial = useMaterialStore((state) => state.addMaterial);
  const [modalVisible, setModalVisible] = useState(false);
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("GRANITO");
  const [preco, setPreco] = useState("");

  const handleSave = async () => {
    if (!nome || !preco) {
      Alert.alert("Erro", "Preencha nome e preço");
      return;
    }
    try {
      const material = await createMaterial({
        nome,
        tipo,
        preco_por_m2: parseFloat(preco),
      });
      addMaterial(material);
      setModalVisible(false);
      setNome("");
      setPreco("");
    } catch {
      Alert.alert("Erro", "Não foi possível salvar");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tabela de Preços</Text>
      <FlatList
        data={materials}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemName}>{item.nome}</Text>
            <Text>{item.tipo} — R$ {item.preco_por_m2.toFixed(2)}/m²</Text>
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>+ Adicionar Material</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>Novo Material</Text>
          <TextInput style={styles.input} placeholder="Nome" value={nome} onChangeText={setNome} />
          {TIPOS.map((t) => (
            <TouchableOpacity key={t} onPress={() => setTipo(t)}>
              <Text style={tipo === t ? styles.selectedTipo : styles.tipo}>{t}</Text>
            </TouchableOpacity>
          ))}
          <TextInput style={styles.input} placeholder="Preço por m²" keyboardType="decimal-pad" value={preco} onChangeText={setPreco} />
          <TouchableOpacity style={styles.button} onPress={handleSave}>
            <Text style={styles.buttonText}>Salvar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <Text style={styles.cancel}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  item: { padding: 12, borderBottomWidth: 1, borderBottomColor: "#eee" },
  itemName: { fontSize: 16, fontWeight: "600" },
  button: { backgroundColor: "#1976D2", padding: 14, borderRadius: 8, alignItems: "center", marginTop: 12 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  modal: { flex: 1, justifyContent: "center", padding: 24, backgroundColor: "#fff" },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 16 },
  input: { height: 48, borderWidth: 1, borderColor: "#ddd", borderRadius: 8, paddingHorizontal: 16, marginBottom: 12 },
  tipo: { padding: 8, fontSize: 14, color: "#666" },
  selectedTipo: { padding: 8, fontSize: 14, color: "#1976D2", fontWeight: "bold" },
  cancel: { textAlign: "center", marginTop: 12, color: "#666" },
});
