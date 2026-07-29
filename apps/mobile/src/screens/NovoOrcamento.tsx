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
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import { useMaterialStore } from "../stores/materialStore";

export default function NovoOrcamentoScreen({ navigation }: any) {
  const [step, setStep] = useState(1);
  const [cliente, setCliente] = useState("");
  const [telefone, setTelefone] = useState("");
  const [projeto, setProjeto] = useState("Bancada Cozinha");

  const [comprimento, setComprimento] = useState("2.40");
  const [largura, setLargura] = useState("0.60");
  const [selectedMaterial, setSelectedMaterial] = useState<any>(null);
  const [precoFinal, setPrecoFinal] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const materials = useMaterialStore((state) => state.materials);

  const numComp = parseFloat(comprimento) || 0;
  const numLarg = parseFloat(largura) || 0;
  const area = numComp * numLarg;
  const precoSugerido = selectedMaterial && area > 0 ? area * selectedMaterial.preco_por_m2 : 0;

  useEffect(() => {
    if (!selectedMaterial && materials.length > 0) {
      setSelectedMaterial(materials[0]);
    }
  }, [materials]);

  useEffect(() => {
    if (precoSugerido > 0) {
      setPrecoFinal(precoSugerido.toFixed(2));
    }
  }, [precoSugerido]);

  const handleGerar = () => {
    if (!cliente) {
      Alert.alert("Atenção", "Preencha o nome do cliente");
      return;
    }
    if (area <= 0) {
      Alert.alert("Atenção", "Insira medidas válidas");
      return;
    }
    const orcamento = {
      cliente,
      telefone,
      projeto,
      comprimento: numComp,
      largura: numLarg,
      area,
      material: selectedMaterial,
      precoFinal: parseFloat(precoFinal) || precoSugerido,
      observacoes,
      data: new Date().toLocaleDateString("pt-BR"),
    };
    navigation.navigate("visualizarorcamento", { orcamento });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Stepper Header */}
      <View style={styles.stepperContainer}>
        {[
          { num: 1, label: "Cliente" },
          { num: 2, label: "Medidas" },
          { num: 3, label: "Material" },
          { num: 4, label: "Resumo" },
        ].map((s) => {
          const isActive = step === s.num;
          const isDone = step > s.num;
          return (
            <TouchableOpacity
              key={s.num}
              style={styles.stepItem}
              onPress={() => setStep(s.num)}
            >
              <View
                style={[
                  styles.stepBadge,
                  isActive && styles.stepBadgeActive,
                  isDone && styles.stepBadgeDone,
                ]}
              >
                {isDone ? (
                  <Ionicons name="checkmark" size={14} color={colors.onPrimary} />
                ) : (
                  <Text style={[styles.stepNum, isActive && styles.stepNumActive]}>
                    {s.num}
                  </Text>
                )}
              </View>
              <Text style={[styles.stepLabel, isActive && styles.stepLabelActive]}>
                {s.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* STEP 1: CLIENTE E PROJETO */}
      {step === 1 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Dados do Cliente e Obra</Text>

          <Text style={styles.label}>Nome do Cliente *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: João da Silva"
            placeholderTextColor={colors.onSurfaceVariant}
            value={cliente}
            onChangeText={setCliente}
          />

          <Text style={styles.label}>Telefone / WhatsApp</Text>
          <TextInput
            style={styles.input}
            placeholder="(11) 99999-9999"
            keyboardType="phone-pad"
            placeholderTextColor={colors.onSurfaceVariant}
            value={telefone}
            onChangeText={setTelefone}
          />

          <Text style={styles.label}>Nome do Projeto / Cômodo</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Bancada Cozinha Principal"
            placeholderTextColor={colors.onSurfaceVariant}
            value={projeto}
            onChangeText={setProjeto}
          />

          <TouchableOpacity style={styles.nextBtn} onPress={() => setStep(2)}>
            <Text style={styles.nextBtnText}>Próximo: Inserir Medidas</Text>
            <Ionicons name="arrow-forward" size={16} color={colors.onPrimary} style={{ marginLeft: 6 }} />
          </TouchableOpacity>
        </View>
      )}

      {/* STEP 2: MEDIDAS */}
      {step === 2 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Medidas da Peça</Text>
          <Text style={styles.cardSub}>Insira as dimensões para cálculo automático da área.</Text>

          <View style={styles.rowInputs}>
            <View style={styles.flex1}>
              <Text style={styles.label}>Comprimento (m)</Text>
              <TextInput
                style={styles.bigInput}
                keyboardType="decimal-pad"
                value={comprimento}
                onChangeText={setComprimento}
              />
            </View>
            <View style={styles.flex1}>
              <Text style={styles.label}>Largura (m)</Text>
              <TextInput
                style={styles.bigInput}
                keyboardType="decimal-pad"
                value={largura}
                onChangeText={setLargura}
              />
            </View>
          </View>

          <View style={styles.areaBox}>
            <View>
              <Text style={styles.areaLabel}>Área Total Calculada</Text>
              <Text style={styles.areaValue}>{area.toFixed(2)} m²</Text>
            </View>
            <Ionicons name="resize-outline" size={28} color={colors.primary} />
          </View>

          <View style={styles.navRow}>
            <TouchableOpacity style={styles.backBtn} onPress={() => setStep(1)}>
              <Text style={styles.backBtnText}>Voltar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.nextBtn, styles.flex1]} onPress={() => setStep(3)}>
              <Text style={styles.nextBtnText}>Selecionar Material</Text>
              <Ionicons name="arrow-forward" size={16} color={colors.onPrimary} style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* STEP 3: SELEÇÃO DE MATERIAL */}
      {step === 3 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Escolha o Material</Text>

          <ScrollView style={{ maxHeight: 220 }} nestedScrollEnabled>
            {materials.map((m: any) => {
              const isSelected = selectedMaterial?.id === m.id;
              return (
                <TouchableOpacity
                  key={m.id}
                  style={[styles.materialCard, isSelected && styles.materialCardSelected]}
                  onPress={() => setSelectedMaterial(m)}
                >
                  <View style={styles.matIcon}>
                    <Ionicons name="layers-outline" size={20} color={colors.primary} />
                  </View>
                  <View style={styles.flex1}>
                    <Text style={styles.matName}>{m.nome}</Text>
                    <Text style={styles.matType}>{m.tipo || "Granito/Mármore"}</Text>
                  </View>
                  <Text style={styles.matPrice}>R$ {m.preco_por_m2}/m²</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {precoSugerido > 0 && (
            <View style={styles.priceSummary}>
              <Text style={styles.priceLabel}>Preço sugerido ({area.toFixed(2)}m²):</Text>
              <Text style={styles.priceValue}>R$ {precoSugerido.toFixed(2)}</Text>
            </View>
          )}

          <Text style={styles.label}>Preço Final Ajustado (R$)</Text>
          <TextInput
            style={styles.bigInput}
            keyboardType="decimal-pad"
            value={precoFinal}
            onChangeText={setPrecoFinal}
          />

          <View style={styles.navRow}>
            <TouchableOpacity style={styles.backBtn} onPress={() => setStep(2)}>
              <Text style={styles.backBtnText}>Voltar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.nextBtn, styles.flex1]} onPress={() => setStep(4)}>
              <Text style={styles.nextBtnText}>Revisar e Gerar</Text>
              <Ionicons name="arrow-forward" size={16} color={colors.onPrimary} style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* STEP 4: RESUMO E CONCLUIR */}
      {step === 4 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Resumo da Proposta</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.sumKey}>Cliente:</Text>
            <Text style={styles.sumVal}>{cliente || "Não informado"}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.sumKey}>Projeto:</Text>
            <Text style={styles.sumVal}>{projeto}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.sumKey}>Medidas:</Text>
            <Text style={styles.sumVal}>{comprimento}m × {largura}m ({area.toFixed(2)} m²)</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.sumKey}>Material:</Text>
            <Text style={styles.sumVal}>{selectedMaterial?.nome || "-"}</Text>
          </View>
          <View style={[styles.summaryRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.sumKeyBold}>VALOR TOTAL:</Text>
            <Text style={styles.sumValBold}>R$ {precoFinal || precoSugerido.toFixed(2)}</Text>
          </View>

          <Text style={styles.label}>Observações (Opcional)</Text>
          <TextInput
            style={[styles.input, { height: 70 }]}
            placeholder="Ex: Canto com recortes para coluna."
            placeholderTextColor={colors.onSurfaceVariant}
            multiline
            value={observacoes}
            onChangeText={setObservacoes}
          />

          <TouchableOpacity style={styles.photoBtn} onPress={() => navigation.navigate("fotoanotacao")}>
            <Ionicons name="camera-outline" size={18} color={colors.primary} style={{ marginRight: 6 }} />
            <Text style={styles.photoBtnText}>Adicionar / Ver Foto com Anotação</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.generateBtn} onPress={handleGerar}>
            <Text style={styles.generateBtnText}>Gerar Orçamento em PDF / WhatsApp</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 110 },
  stepperContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    backgroundColor: colors.surfaceContainerLowest,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  stepItem: { alignItems: "center", flex: 1 },
  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surfaceContainerHigh,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  stepBadgeActive: { backgroundColor: colors.primary },
  stepBadgeDone: { backgroundColor: colors.secondary },
  stepNum: { fontSize: 13, fontWeight: "700", color: colors.onSurfaceVariant },
  stepNumActive: { color: colors.onPrimary },
  stepLabel: { fontSize: 11, color: colors.onSurfaceVariant, fontWeight: "500" },
  stepLabelActive: { color: colors.primary, fontWeight: "700" },

  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 16,
    padding: 20,
  },
  cardTitle: { fontSize: 20, fontWeight: "700", color: colors.primary, marginBottom: 4 },
  cardSub: { fontSize: 14, color: colors.onSurfaceVariant, marginBottom: 16 },
  label: { fontSize: 13, fontWeight: "700", color: colors.primary, marginTop: 12, marginBottom: 6 },
  input: {
    height: 48,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 15,
    color: colors.onSurface,
  },
  bigInput: {
    height: 52,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.outlineVariant,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 22,
    fontWeight: "700",
    color: colors.primary,
  },
  rowInputs: { flexDirection: "row", gap: 12, marginBottom: 16 },
  flex1: { flex: 1 },
  areaBox: {
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 12,
  },
  areaLabel: { fontSize: 12, color: colors.onSurfaceVariant, fontWeight: "500" },
  areaValue: { fontSize: 24, fontWeight: "800", color: colors.primary, marginTop: 2 },

  materialCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  materialCardSelected: {
    borderColor: colors.secondary,
    borderWidth: 2,
    backgroundColor: colors.surfaceContainerLow,
  },
  matIcon: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: colors.surfaceContainerHighest,
    alignItems: "center",
    justifyContent: "center",
  },
  matName: { fontSize: 14, fontWeight: "700", color: colors.primary },
  matType: { fontSize: 12, color: colors.onSurfaceVariant },
  matPrice: { fontSize: 14, fontWeight: "700", color: colors.secondary },

  priceSummary: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.surfaceContainerLow,
    padding: 12,
    borderRadius: 10,
    marginVertical: 12,
  },
  priceLabel: { fontSize: 13, color: colors.onSurfaceVariant },
  priceValue: { fontSize: 18, fontWeight: "700", color: colors.secondary },

  navRow: { flexDirection: "row", gap: 10, marginTop: 20 },
  backBtn: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 10,
    alignItems: "center",
  },
  backBtnText: { fontSize: 14, fontWeight: "600", color: colors.onSurfaceVariant },
  nextBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "center",
  },
  nextBtnText: { color: colors.onPrimary, fontSize: 15, fontWeight: "700" },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
  },
  sumKey: { fontSize: 14, color: colors.onSurfaceVariant },
  sumVal: { fontSize: 14, fontWeight: "600", color: colors.primary },
  sumKeyBold: { fontSize: 16, fontWeight: "800", color: colors.primary },
  sumValBold: { fontSize: 20, fontWeight: "800", color: colors.secondary },

  photoBtn: {
    backgroundColor: colors.surfaceContainerHigh,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
    marginBottom: 8,
  },
  photoBtnText: { fontSize: 14, fontWeight: "700", color: colors.primary },

  generateBtn: {
    backgroundColor: colors.secondaryFixed,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
  },
  generateBtnText: { fontSize: 16, fontWeight: "800", color: colors.onSecondaryFixed },
});
