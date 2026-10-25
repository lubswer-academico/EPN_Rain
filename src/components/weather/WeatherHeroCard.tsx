import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ClimaActual } from "../../types/weather";
import { obtenerCondicionClimatica } from "../../constants/weatherCodes";
import { formatTemp } from "../../utils/formatters";
import { Theme } from "../../constants/theme";

interface Props {
  actual?: ClimaActual;
  nombreCiudad: string;
  lat: number;
  lon: number;
}

export function WeatherHeroCard({ actual, nombreCiudad, lat, lon }: Props) {
  const condicion = obtenerCondicionClimatica(actual?.weather_code);

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.locationGroup}>
          <Ionicons name="location-sharp" size={18} color="#FFFFFF" />
          <Text style={styles.cityName}>{nombreCiudad}</Text>
        </View>
        <Text style={styles.coordsText}>{lat.toFixed(2)}°, {lon.toFixed(2)}°</Text>
      </View>

      <View style={styles.centerRow}>
        <View>
          <Text style={styles.tempText}>{formatTemp(actual?.temperature_2m)}</Text>
          <Text style={styles.conditionText}>{condicion.descripcion}</Text>
        </View>
        <Ionicons name={condicion.icono} size={64} color="#FFFFFF" />
      </View>

      <View style={styles.footerRow}>
        <Text style={styles.footerText}>
          Sensación térmica: {formatTemp(actual?.apparent_temperature)}
        </Text>
        <Text style={styles.footerText}>
          Humedad: {actual?.relative_humidity_2m ?? "--"}%
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.radius.lg,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  locationGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  cityName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  coordsText: {
    fontSize: 12,
    color: Theme.colors.primaryLight,
  },
  centerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 12,
  },
  tempText: {
    fontSize: 52,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  conditionText: {
    fontSize: 16,
    color: Theme.colors.primaryLight,
    fontWeight: "600",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.2)",
    paddingTop: 10,
  },
  footerText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "500",
  },
});
