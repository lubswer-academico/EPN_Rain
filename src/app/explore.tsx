import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useCarros } from "../hooks/useCarros";
import { CarroCard } from "../components/CarroCard";
import { PT } from "../constants/patiotuerca";

export default function Explore() {
  const { data: carros = [], isLoading, error } = useCarros();

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={PT.colors.primary} />
        <Text style={styles.loadingText}>Cargando vehículos...</Text>
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
                EXPLORAR <Text style={styles.brandAccent}>AUTOS</Text>
              </Text>
              <Text style={styles.brandSubtitle}>
                Vista sincronizada en tiempo real mediante caché
              </Text>
            </View>

            <View style={styles.inventoryRow}>
              <Text style={styles.sectionSubtitle}>Inventario Global</Text>
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