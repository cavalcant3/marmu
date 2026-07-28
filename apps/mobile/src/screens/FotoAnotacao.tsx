import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";

export default function FotoAnotacaoScreen() {
  const [foto, setFoto] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Anotar Foto</Text>
      {!foto ? (
        <View>
          <TouchableOpacity style={styles.button} onPress={() => setFoto(true)}>
            <Text style={styles.buttonText}>📷 Tirar Foto</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => setFoto(true)}>
            <Text style={styles.buttonText}>🖼️ Escolher da Galeria</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.photoArea}>
          <Text>[Prévia da foto do ambiente]</Text>
          <Text>↖ 2,40m</Text>
          <Text>↙ 0,60m</Text>
          <TouchableOpacity style={styles.button} onPress={() => Alert.alert("Salvo!", "Foto com anotações salva.")}>
            <Text style={styles.buttonText}>💾 Salvar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 16 },
  photoArea: { flex: 1, backgroundColor: "#f0f0f0", justifyContent: "center", alignItems: "center", borderRadius: 8 },
  button: { backgroundColor: "#1976D2", padding: 14, borderRadius: 8, alignItems: "center", marginBottom: 12 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
