import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { useMaterialStore } from "../stores/materialStore.js";

export default function NovoOrcamentoScreen({ navigation }: any) {
  const [cliente, setCliente] = useState("");
  const [comprimento, setComprimento] = useState("");
  const [largura, setLargura] = useState("");
  const [material, setMaterial] = useState<any>(null);
  const [precoFinal, setPrecoFinal] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const materials = useMaterialStore((state) => state.materials);

  const area = comprimento && largura ? parseFloat(comprimento) * parseFloat(largura) : 0;
  const precoSugerido = material && area > 0 ? area * material.preco_por_m2 : 0;

  useEffect(() => {
    if (precoSugerido > 0 && !precoFinal) {
      setPrecoFinal(precoSugerido.toFixed(2));
    }
  }, [precoSugerido]);

  const handleGerar = () => {
    if (!comprimento || !largura || !material) {
      Alert.alert("Erro", "Preencha medidas e selecione um material");
      return;
    }
    const orcamento = {
      cliente,
      comprimento: parseFloat(comprimento),
      largura: parseFloat(largura),
      area,
      material,
      precoFinal: parseFloat(precoFinal) || precoSugerido,
      observacoes,
    };
    navigation.navigate("VisualizarOrcamento", { orcamento });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Novo Orçamento</Text>

      <TextInput style={styles.input} placeholder="Cliente (opcional)" value={cliente} onChangeText={setCliente} />

      <Text style={styles.label}>Comprimento (m)</Text>
      <TextInput style={styles.input} keyboardType="decimal-pad" value={comprimento} onChangeText={setComprimento} />

      <Text style={styles.label}>Largura (m)</Text>
      <TextInput style={styles.input} keyboardType="decimal-pad" value={largura} onChangeText={setLargura} />

      <Text style={styles.area}>Área: {area.toFixed(2)} m²</Text>

      <TouchableOpacity
        style={styles.selectButton}
        onPress={() => navigation.navigate("SelecionarMaterial", { onSelect: setMaterial })}
      >
        <Text>
          {material ? `${material.nome} (R$ ${material.preco_por_m2}/m²)` : "Selecionar Material"}
        </Text>
      </TouchableOpacity>

      {precoSugerido > 0 && (
        <Text style={styles.precoSugerido}>Preço sugerido: R$ {precoSugerido.toFixed(2)}</Text>
      )}

      <Text style={styles.label}>Preço Final (R$)</Text>
      <TextInput style={styles.input} keyboardType="decimal-pad" value={precoFinal} onChangeText={setPrecoFinal} />

      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Observações"
        multiline
        value={observacoes}
        onChangeText={setObservacoes}
      />

      <TouchableOpacity style={styles.button} onPress={handleGerar}>
        <Text style={styles.buttonText}>Gerar Orçamento</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  label: { fontSize: 14, color: "#666", marginBottom: 4 },
  input: { height: 48, borderWidth: 1, borderColor: "#ddd", borderRadius: 8, paddingHorizontal: 16, marginBottom: 12 },
  area: { fontSize: 16, fontWeight: "600", marginVertical: 8 },
  selectButton: { padding: 12, borderWidth: 1, borderColor: "#ddd", borderRadius: 8, marginBottom: 12 },
  precoSugerido: { fontSize: 16, color: "#1976D2", marginBottom: 8 },
  button: { backgroundColor: "#1976D2", padding: 14, borderRadius: 8, alignItems: "center", marginTop: 16 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
