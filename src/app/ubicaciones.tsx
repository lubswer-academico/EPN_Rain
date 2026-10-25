import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useUbicaciones, useEliminarUbicacion } from "../hooks/useUbicaciones";
import { Ubicacion } from "../types/location";
import { OfflineBanner } from "../components/common/OfflineBanner";
import { LocationCard } from "../components/locations/LocationCard";
import { LocationModalForm } from "../components/locations/LocationModalForm";
import { Theme } from "../constants/theme";

export default function UbicacionesScreen() {
  const { data: ubicaciones = [], isLoading, isFetching, isError, refetch } = useUbicaciones();

  const eliminarMutacion = useEliminarUbicacion();

  const [modalVisible, setModalVisible] = useState(false);
  const [ubicacionAEditar, setUbicacionAEditar] = useState<Ubicacion | null>(null);

  const handleAbrirCrear = () => {
    setUbicacionAEditar(null);
    setModalVisible(true);
  };

  const handleAbrirEditar = (ubicacion: Ubicacion) => {
    setUbicacionAEditar(ubicacion);
    setModalVisible(true);
  };

  const handleCerrarModal = () => {
    setModalVisible(false);
    setUbicacionAEditar(null);
  };

  const handleEliminar = (id: string) => {
    Alert.alert(
      "Eliminar ubicación",
      "¿Estás seguro de que deseas eliminar esta ubicación?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => eliminarMutacion.mutate(id),
        },
      ]
    );
  };

  return (
    <View style={styles.safeArea}>
      <OfflineBanner />

      <View style={styles.header}>
        <View style={styles.headerTextos}>
          <Text style={styles.titulo}>Mis Ubicaciones</Text>
        </View>
        <TouchableOpacity style={styles.btnNuevo} onPress={handleAbrirCrear}>
          <Ionicons name="add" size={18} color={Theme.colors.primary} />
          <Text style={styles.btnNuevoTexto}>Nueva</Text>
        </TouchableOpacity>
      </View>

      {isLoading && ubicaciones.length === 0 ? (
        <View style={styles.centerLoading}>
          <ActivityIndicator size="large" color={Theme.colors.primary} />
          <Text style={styles.loadingText}>Cargando tus ubicaciones guardadas...</Text>
        </View>
      ) : isError && ubicaciones.length === 0 ? (
        <View style={styles.centerError}>
          <Ionicons name="cloud-offline-outline" size={40} color={Theme.colors.accentRed} />
          <Text style={styles.errorTitle}>Error al cargar ubicaciones</Text>
          <Text style={styles.errorSub}>No se pudo conectar a MockAPI ni hay datos en caché.</Text>
          <TouchableOpacity style={styles.btnReintentar} onPress={() => refetch()}>
            <Text style={styles.btnReintentarTexto}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={ubicaciones}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={isFetching}
              onRefresh={() => refetch()}
              colors={[Theme.colors.primary]}
              tintColor={Theme.colors.primary}
            />
          }
          renderItem={({ item }) => (
            <LocationCard
              ubicacion={item}
              onEditar={handleAbrirEditar}
              onEliminar={handleEliminar}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="map-outline" size={48} color={Theme.colors.textMuted} />
              <Text style={styles.emptyTitle}>Sin ubicaciones guardadas</Text>
              <Text style={styles.emptySub}>
                Guarda tus ciudades favoritas para consultar su clima rápidamente, incluso sin conexión.
              </Text>
              <TouchableOpacity style={styles.btnCrearPrimero} onPress={handleAbrirCrear}>
                <Ionicons name="add-circle-outline" size={18} color={Theme.colors.primary} />
                <Text style={styles.btnCrearPrimeroTexto}>Agregar Primera Ubicación</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}

      <LocationModalForm
        key={`modal-form-${ubicacionAEditar ? ubicacionAEditar.id : "nueva"}-${modalVisible}`}
        visible={modalVisible}
        onCerrar={handleCerrarModal}
        ubicacionEditar={ubicacionAEditar}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 46,
    paddingBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTextos: {
    flex: 1,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "800",
    color: Theme.colors.textMain,
  },
  subtitulo: {
    fontSize: 12,
    color: Theme.colors.textMuted,
    marginTop: 2,
    fontWeight: "500",
  },
  listContent: {
    paddingVertical: 12,
  },
  btnNuevo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Theme.colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: Theme.radius.sm,
  },
  btnNuevoTexto: {
    color: Theme.colors.primary,
    fontSize: 13,
    fontWeight: "700",
  },
  centerLoading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: Theme.colors.textMuted,
  },
  centerError: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Theme.colors.accentRed,
    marginTop: 10,
  },
  errorSub: {
    fontSize: 13,
    color: Theme.colors.textMuted,
    textAlign: "center",
    marginTop: 4,
  },
  btnReintentar: {
    marginTop: 14,
    backgroundColor: Theme.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Theme.radius.sm,
  },
  btnReintentarTexto: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 13,
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Theme.colors.textMain,
    marginTop: 12,
  },
  emptySub: {
    fontSize: 13,
    color: Theme.colors.textMuted,
    textAlign: "center",
    marginTop: 6,
    lineHeight: 18,
  },
  btnCrearPrimero: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Theme.colors.accent,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: Theme.radius.md,
    marginTop: 16,
  },
  btnCrearPrimeroTexto: {
    color: Theme.colors.primary,
    fontSize: 14,
    fontWeight: "700",
  },
});
