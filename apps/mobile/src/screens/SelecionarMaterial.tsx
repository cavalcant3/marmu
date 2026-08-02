import React, { useState } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useMaterialStore } from "../stores/materialStore";
import { formatCurrency } from "../utils/formatters";

export default function SelecionarMaterialScreen({ navigation, route }: any) {
  const materials = useMaterialStore((state) => state.materials);
  const [busca, setBusca] = useState("");
  const { onSelect } = route.params;

  const filtrados = materials.filter(
    (m) =>
      m.nome.toLowerCase().includes(busca.toLowerCase()) ||
      m.tipo.toLowerCase().includes(busca.toLowerCase())
  );

  const handleSelect = (material: any) => {
    onSelect(material);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selecionar Material</Text>
      <TextInput
        style={styles.input}
        placeholder="Buscar material..."
        value={busca}
        onChangeText={setBusca}
      />
      <FlatList
        data={filtrados}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => handleSelect(item)}>
            <Text style={styles.itemName}>{item.nome}</Text>
            <Text>{item.tipo} — {formatCurrency(item.preco_por_m2)}/m²</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 12 },
  input: { height: 48, borderWidth: 1, borderColor: "#ddd", borderRadius: 8, paddingHorizontal: 16, marginBottom: 12 },
  item: { padding: 14, borderBottomWidth: 1, borderBottomColor: "#eee" },
  itemName: { fontSize: 16, fontWeight: "600" },
});
