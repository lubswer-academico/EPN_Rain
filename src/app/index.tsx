import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useWeather } from "../hooks/useWeather";
import { useUbicaciones } from "../hooks/useUbicaciones";
import { DEFAULT_LOCATIONS } from "../constants/defaultLocations";
import { OfflineBanner } from "../components/common/OfflineBanner";
import { WeatherHeroCard } from "../components/weather/WeatherHeroCard";
import { WeatherHourlyChart } from "../components/weather/WeatherHourlyChart";
import { Theme } from "../constants/theme";

export default function WeatherScreen() {
  const params = useLocalSearchParams<{ lat?: string; lon?: string; nombre?: string }>();

  const paramsKey = `${params.lat ?? ""}-${params.lon ?? ""}`;

  const { data: ubicaciones = [] } = useUbicaciones();

  const [ultimaBusqueda, setUltimaBusqueda] = useState<{
    lat: number;
    lon: number;
    nombre: string;
    sourceParamsKey: string;
  } | null>(null);

  const tieneBusquedaManual = ultimaBusqueda !== null && ultimaBusqueda.sourceParamsKey === paramsKey;

  const latitud = tieneBusquedaManual
    ? ultimaBusqueda.lat
    : params.lat
    ? parseFloat(params.lat)
    : DEFAULT_LOCATIONS[0].latitud;

  const longitud = tieneBusquedaManual
    ? ultimaBusqueda.lon
    : params.lon
    ? parseFloat(params.lon)
    : DEFAULT_LOCATIONS[0].longitud;

  const nombreLugar = tieneBusquedaManual
    ? ultimaBusqueda.nombre
    : params.nombre ?? DEFAULT_LOCATIONS[0].nombre;

  const { data: pronostico, isLoading, isFetching, isError, refetch } = useWeather(latitud, longitud);

  return (
    <View style={styles.safeArea}>
      <OfflineBanner />

      <View style={styles.header}>
        <Text style={styles.titulo}>EPN Rain</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={() => refetch()}
            colors={[Theme.colors.primary]}
            tintColor={Theme.colors.primary}
          />
        }
      >
        <View style={styles.selectorContainer}>
          <Text style={styles.selectorLabel}>Mis Ubicaciones</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.presetsRow}>
            {DEFAULT_LOCATIONS.map((preset) => {
              const activa = Math.abs(preset.latitud - latitud) < 0.001 && Math.abs(preset.longitud - longitud) < 0.001;
              return (
                <TouchableOpacity
                  key={preset.nombre}
                  style={[styles.chip, activa && styles.chipActiva]}
                  onPress={() => setUltimaBusqueda({ lat: preset.latitud, lon: preset.longitud, nombre: preset.nombre, sourceParamsKey: paramsKey })}
                >
                  <Ionicons name="location" size={12} color={activa ? "#FFFFFF" : Theme.colors.primary} />
                  <Text style={[styles.chipText, activa && styles.chipTextActiva]}>{preset.nombre}</Text>
                </TouchableOpacity>
              );
            })}

            {ubicaciones.map((ubicacion) => {
              const activa = Math.abs(ubicacion.latitud - latitud) < 0.001 && Math.abs(ubicacion.longitud - longitud) < 0.001;
              return (
                <TouchableOpacity
                  key={ubicacion.id}
                  style={[styles.chip, activa && styles.chipActiva]}
                  onPress={() => setUltimaBusqueda({ lat: ubicacion.latitud, lon: ubicacion.longitud, nombre: ubicacion.nombre, sourceParamsKey: paramsKey })}
                >
                  <Ionicons name="bookmark" size={12} color={activa ? "#FFFFFF" : Theme.colors.primary} />
                  <Text style={[styles.chipText, activa && styles.chipTextActiva]}>{ubicacion.nombre}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {isLoading && !pronostico ? (
          <View style={styles.centerLoading}>
            <ActivityIndicator size="large" color={Theme.colors.primary} />
            <Text style={styles.loadingText}>Cargando datos del clima...</Text>
          </View>
        ) : isError && !pronostico ? (
          <View style={styles.centerError}>
            <Text style={styles.errorText}>No se pudo cargar el clima.</Text>
            <Text style={styles.errorSubtext}>Verifica tu conexión a internet o intenta de nuevo.</Text>
          </View>
        ) : (
          <>
            <WeatherHeroCard
              actual={pronostico?.actual}
              nombreCiudad={nombreLugar}
              lat={latitud}
              lon={longitud}
            />

            {pronostico?.porHora && pronostico.porHora.length > 0 && (
              <WeatherHourlyChart horas={pronostico.porHora} />
            )}
          </>
        )}
      </ScrollView>
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
    paddingTop: 36,
    paddingBottom: 8,
  },
  titulo: {
    fontSize: 28,
    fontWeight: "800",
    color: Theme.colors.textMain,
    textAlign: "center",
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,

  },
  subtitulo: {
    fontSize: 12,
    color: Theme.colors.textMuted,
    marginTop: 2,
    fontWeight: "500",
  },
  selectorContainer: {
    marginHorizontal: 16,
    marginVertical: 6,
  },
  selectorLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: Theme.colors.textMain,
    marginBottom: 6,
  },
  presetsRow: {
    gap: 8,
    paddingBottom: 4,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Theme.colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: Theme.radius.full,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  chipActiva: {
    backgroundColor: Theme.colors.primary,
    borderColor: Theme.colors.primary,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "600",
    color: Theme.colors.textMain,
  },
  chipTextActiva: {
    color: "#FFFFFF",
  },
  scrollContent: {
    paddingBottom: 24,
  },
  centerLoading: {
    paddingVertical: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: Theme.colors.textMuted,
  },
  centerError: {
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    fontSize: 15,
    fontWeight: "700",
    color: Theme.colors.accentRed,
  },
  errorSubtext: {
    fontSize: 13,
    color: Theme.colors.textMuted,
    marginTop: 4,
    textAlign: "center",
  },
});
