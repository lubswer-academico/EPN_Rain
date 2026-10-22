import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Carro } from "../types/carro";
import { useCarros, useAgregarCarro } from "../hooks/useCarros";
import { CarroCard } from "../components/CarroCard";
import { CarroForm } from "../components/CarroForm";
import { PT } from "../constants/patiotuerca";

export default function App() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const { data: carros = [], isLoading, error } = useCarros();
  const { mutate: agregarCarro, isPending: isAdding } = useAgregarCarro();

  const handleCrearCarro = (nuevoCarro: Carro) => {
    const { id, ...payload } = nuevoCarro;

    agregarCarro(payload, {
      onSuccess: () => {
        Alert.alert("Éxito", "Carro registrado con éxito");
        setMostrarFormulario(false);
      },
      onError: (err) => {
        Alert.alert("Error", err.message || "No se pudo registrar el carro");
      },
    });
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={PT.colors.primary} />
        <Text style={styles.loadingText}>Cargando inventario...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorTitle}>Error al sincronizar datos</Text>
        <Text style={styles.errorSub}>{error.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={carros}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CarroCard carro={item} />}
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <View style={styles.brandBar}>
              <Text style={styles.brandTitle}>
                PATIO<Text style={styles.brandAccent}>TUERCA</Text>
              </Text>
              <Text style={styles.brandSubtitle}>Catálogo y Gestión Vehicular</Text>
            </View>

            {mostrarFormulario ? (
              <View style={styles.formWrapper}>
                <View style={styles.formHeaderRow}>
                  <Text style={styles.formHeading}>Registrar Nuevo Vehículo</Text>
                  <View style={styles.nuevoBadge}>
                    <Text style={styles.nuevoBadgeText}>NUEVO</Text>
                  </View>
                </View>
                <CarroForm
                  onSubmit={handleCrearCarro}
                  onCancel={() => setMostrarFormulario(false)}
                  textoBoton="Publicar Vehículo"
                  isSubmittingExterno={isAdding}
                />
              </View>
            ) : (
              <TouchableOpacity
                style={styles.btnNuevo}
                onPress={() => setMostrarFormulario(true)}
              >
                <Text style={styles.btnNuevoTexto}>+ Publicar Nuevo Vehículo</Text>
              </TouchableOpacity>
            )}

            <View style={styles.inventoryRow}>
              <Text style={styles.sectionSubtitle}>Autos Disponibles</Text>
              <Text style={styles.counterBadge}>{carros.length} unidades</Text>
            </View>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PT.colors.background,
  },
  listContent: {
    paddingBottom: 30,
  },
  headerContainer: {
    paddingTop: 45,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  brandBar: {
    alignItems: "center",
    marginBottom: 16,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: PT.colors.textMain,
    letterSpacing: 1,
  },
  brandAccent: {
    color: PT.colors.primary,
  },
  brandSubtitle: {
    fontSize: 12,
    color: PT.colors.textMuted,
    marginTop: 2,
    fontWeight: "400",
  },
  btnNuevo: {
    backgroundColor: PT.colors.primary,
    paddingVertical: 12,
    borderRadius: PT.radius.button,
    alignItems: "center",
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  btnNuevoTexto: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
  formWrapper: {
    backgroundColor: PT.colors.surface,
    borderRadius: PT.radius.widget,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: PT.colors.border,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  formHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  formHeading: {
    fontSize: 15,
    fontWeight: "600",
    color: PT.colors.textMain,
  },
  nuevoBadge: {
    backgroundColor: PT.colors.badgeBlue,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: PT.radius.badge,
  },
  nuevoBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },
  inventoryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 15,
    fontWeight: "600",
    color: PT.colors.textMain,
  },
  counterBadge: {
    fontSize: 12,
    color: PT.colors.textMuted,
    fontWeight: "500",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: PT.colors.background,
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: PT.colors.textMuted,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: PT.colors.error,
    marginBottom: 4,
  },
  errorSub: {
    fontSize: 13,
    color: PT.colors.textMuted,
    textAlign: "center",
  },
});