import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { colors } from "../theme/colors";

export default function FotoAnotacaoScreen() {
  const [annotations, setAnnotations] = useState([
    { id: "1", text: "2,40m", top: "35%", left: "45%" },
    { id: "2", text: "0,60m", top: "60%", left: "20%" },
    { id: "3", text: "Corte de Cuba 40x34", top: "45%", left: "70%" },
  ]);

  const handleAddAnnotation = () => {
    Alert.prompt(
      "Nova Anotação",
      "Digite a medida ou observação a inserir na foto:",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Inserir na Foto",
          onPress: (val) => {
            if (val) {
              setAnnotations([
                ...annotations,
                { id: Date.now().toString(), text: val, top: "50%", left: "50%" },
              ]);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Foto-Anotação da Obra</Text>

      {/* Canvas Box simulating kitchen photo with overlays */}
      <View style={styles.canvasBox}>
        <Text style={styles.canvasBgIcon}>🏠</Text>
        <Text style={styles.canvasBgText}>Foto da Cozinha / Parede da Bancada</Text>

        {annotations.map((ann) => (
          <View
            key={ann.id}
            style={[styles.annotationTag, { top: ann.top as any, left: ann.left as any }]}
          >
            <Text style={styles.annotationText}>{ann.text}</Text>
          </View>
        ))}
      </View>

      <View style={styles.toolbar}>
        <TouchableOpacity style={styles.toolBtn} onPress={handleAddAnnotation}>
          <Text style={styles.toolBtnText}>✏️ Adicionar Medida / Cota</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.toolBtnSec}
          onPress={() => setAnnotations([])}
        >
          <Text style={styles.toolBtnSecText}>🗑️ Limpar Marcações</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 20, paddingBottom: 100 },
  title: { fontSize: 22, fontWeight: "800", color: colors.primary, marginBottom: 16 },

  canvasBox: {
    flex: 1,
    backgroundColor: colors.primaryContainer,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    minHeight: 350,
  },
  canvasBgIcon: { fontSize: 64, opacity: 0.2 },
  canvasBgText: { fontSize: 14, color: colors.onPrimaryContainer, marginTop: 8, opacity: 0.6 },

  annotationTag: {
    position: "absolute",
    backgroundColor: colors.secondaryFixed,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  annotationText: { fontSize: 13, fontWeight: "800", color: colors.onSecondaryFixed },

  toolbar: { flexDirection: "row", gap: 10, marginTop: 16 },
  toolBtn: {
    flex: 1,
    backgroundColor: colors.secondaryFixed,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  toolBtnText: { fontSize: 14, fontWeight: "800", color: colors.onSecondaryFixed },
  toolBtnSec: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: 12,
    alignItems: "center",
  },
  toolBtnSecText: { fontSize: 13, fontWeight: "700", color: colors.error },
});
