import React, { useState } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Carro } from "../types/carro";
import { useActualizarCarro, useEliminarCarro } from "../hooks/useCarros";
import { CarroForm } from "./CarroForm";
import { PT } from "../constants/patiotuerca";

interface Props {
  carro: Carro;
}

export function CarroCard({ carro }: Props) {
  const [editando, setEditando] = useState(false);
  const { mutate: actualizarCarro, isPending: isUpdating } = useActualizarCarro();
  const { mutate: eliminarCarro, isPending: isDeleting } = useEliminarCarro();

  const handleActualizar = (carroActualizado: Carro) => {
    actualizarCarro(carroActualizado, {
      onSuccess: () => {
        Alert.alert("Éxito", "Carro actualizado con éxito");
        setEditando(false);
      },
      onError: (error) => {
        Alert.alert("Error", error.message || "No se pudo actualizar el carro");
      },
    });
  };

  const confirmarEliminar = () => {
    Alert.alert(
      "Eliminar Carro",
      `¿Deseas eliminar el carro ${carro.marca} (${carro.matricula})?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => eliminarCarro(carro.id),
        },
      ]
    );
  };

  if (editando) {
    return (
      <View style={styles.card}>
        <View style={styles.topRow}>
          <Text style={styles.cardTitle}>Editar Vehículo #{carro.id}</Text>
          <View style={styles.badgeTop}>
            <Text style={styles.badgeTopText}>EDITANDO</Text>
          </View>
        </View>
        <CarroForm
          carroInicial={carro}
          onSubmit={handleActualizar}
          onCancel={() => setEditando(false)}
          textoBoton="Guardar Cambios"
          isSubmittingExterno={isUpdating}
        />
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.metaRow}>
          <Ionicons name="calendar-outline" size={13} color={PT.colors.textMuted} />
          <Text style={styles.metaText}> Año {carro.anio} • Ecuador</Text>
        </View>
      </View>

      <Text style={styles.marcaTitle}>{carro.marca}</Text>

      <View style={styles.secondaryRow}>
        <View style={styles.colorRow}>
          <Ionicons name="color-palette-outline" size={14} color={PT.colors.textMuted} />
          <Text style={styles.detailText}> {carro.color}</Text>
        </View>
        <View style={styles.placaBadge}>
          <Text style={styles.placaText}>{carro.matricula}</Text>
        </View>
      </View>

      <View style={styles.priceRow}>
        <Text style={styles.precioText}>${carro.precio.toLocaleString()} USD</Text>
        <Text style={styles.idText}>ID: #{carro.id}</Text>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.btnEditar}
          onPress={() => setEditando(true)}
        >
          <Ionicons name="pencil" size={13} color={PT.colors.primary} style={{ marginRight: 4 }} />
          <Text style={styles.btnEditarTexto}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btnEliminar, isDeleting && styles.btnDisabled]}
          onPress={confirmarEliminar}
          disabled={isDeleting}
        >
          <Ionicons name="trash-outline" size={13} color={PT.colors.error} style={{ marginRight: 4 }} />
          <Text style={styles.btnEliminarTexto}>
            {isDeleting ? "Eliminando..." : "Eliminar"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: PT.colors.surface,
    borderRadius: PT.radius.card,
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: PT.colors.border,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaText: {
    fontSize: 12,
    color: PT.colors.textMuted,
    fontWeight: "400",
  },
  badgeTop: {
    backgroundColor: PT.colors.badgeBlue,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: PT.radius.badge,
  },
  badgeTopText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  marcaTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: PT.colors.textMain,
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: PT.colors.textMain,
  },
  secondaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  colorRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailText: {
    fontSize: 12,
    color: PT.colors.textMuted,
    fontWeight: "400",
  },
  placaBadge: {
    backgroundColor: "#F4F5F7",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: PT.radius.badge,
    borderWidth: 1,
    borderColor: PT.colors.border,
  },
  placaText: {
    fontSize: 11,
    fontWeight: "600",
    color: PT.colors.textMain,
    letterSpacing: 0.5,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    borderTopWidth: 1,
    borderTopColor: PT.colors.border,
    paddingTop: 8,
    marginBottom: 10,
  },
  precioText: {
    fontSize: 18,
    fontWeight: "700",
    color: PT.colors.primary,
  },
  idText: {
    fontSize: 11,
    color: PT.colors.textMuted,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  btnEditar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: PT.colors.surface,
    borderWidth: 1,
    borderColor: PT.colors.primary,
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: PT.radius.button,
  },
  btnEditarTexto: {
    color: PT.colors.primary,
    fontSize: 13,
    fontWeight: "600",
  },
  btnEliminar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEE2E2",
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: PT.radius.button,
  },
  btnEliminarTexto: {
    color: PT.colors.error,
    fontSize: 13,
    fontWeight: "600",
  },
  btnDisabled: {
    opacity: 0.5,
  },
});