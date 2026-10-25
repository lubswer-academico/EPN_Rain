import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { LineChart, BarChart } from "react-native-gifted-charts";
import { ItemHoraPronostico } from "../../types/weather";
import { obtenerCondicionClimatica } from "../../constants/weatherCodes";
import { formatHora, formatTemp } from "../../utils/formatters";
import { Theme } from "../../constants/theme";

interface Props {
  horas: ItemHoraPronostico[];
}

export function WeatherHourlyChart({ horas }: Props) {
  const [metrica, setMetrica] = useState<"temp" | "lluvia">("lluvia");

  if (!horas || horas.length === 0) return null;

  const datosTemp = horas.map((item, index) => ({
    value: Math.round(item.temperatura),
    dataPointText: `${Math.round(item.temperatura)}°`,
    label: index === 0 ? "Ahora" : formatHora(item.hora),
    textColor: Theme.colors.textMain,
    textFontSize: 10,
    textShiftY: -6,
  }));

  const datosLluvia = horas.map((item, index) => ({
    value: Math.min(100, Math.max(0, Math.round(item.probabilidadLluvia ?? 0))),
    label: index === 0 ? "Ahora" : formatHora(item.hora),
    frontColor: (item.probabilidadLluvia ?? 0) > 40 ? Theme.colors.barPrimary : Theme.colors.barAccent,
    topLabelComponent: () => (
      <Text style={styles.topLabelBarra}>
        {Math.round(item.probabilidadLluvia ?? 0)}%
      </Text>
    ),
  }));

  const temps = horas.map((h) => Math.round(h.temperatura));
  const minTemp = Math.floor(Math.min(...temps));
  const maxTemp = Math.ceil(Math.max(...temps));

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Pronósticos</Text>

        <View style={styles.pestanas}>
          <TouchableOpacity
            style={[styles.botonPestana, metrica === "lluvia" && styles.botonPestanaActiva]}
            onPress={() => setMetrica("lluvia")}
            activeOpacity={0.7}
          >
            <Ionicons
              name="rainy-outline"
              size={13}
              color={metrica === "lluvia" ? "#FFFFFF" : Theme.colors.textMuted}
            />
            <Text style={[styles.textoPestana, metrica === "lluvia" && styles.textoPestanaActiva]}>
              Lluvia
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.botonPestana, metrica === "temp" && styles.botonPestanaActiva]}
            onPress={() => setMetrica("temp")}
            activeOpacity={0.7}
          >
            <Ionicons
              name="thermometer-outline"
              size={13}
              color={metrica === "temp" ? "#FFFFFF" : Theme.colors.textMuted}
            />
            <Text style={[styles.textoPestana, metrica === "temp" && styles.textoPestanaActiva]}>
              Temp
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.graficaWrapper}>
        {metrica === "temp" ? (
          <LineChart
            data={datosTemp}
            areaChart
            curved
            height={130}
            spacing={48}
            initialSpacing={20}
            color={Theme.colors.primary}
            thickness={2.5}
            startFillColor={Theme.colors.primary}
            endFillColor={Theme.colors.primaryLight}
            startOpacity={0.25}
            endOpacity={0.03}
            dataPointsColor={Theme.colors.accent}
            dataPointsRadius={4}
            hideRules={false}
            rulesColor={Theme.colors.border}
            rulesType="dashed"
            yAxisColor={Theme.colors.border}
            xAxisColor={Theme.colors.border}
            yAxisTextStyle={styles.ejeTexto}
            xAxisLabelTextStyle={styles.ejeTexto}
            yAxisOffset={Math.max(0, minTemp - 2)}
            maxValue={maxTemp + 2}
            noOfSections={3}
          />
        ) : (
          <BarChart
            data={datosLluvia}
            height={130}
            spacing={34}
            initialSpacing={18}
            barWidth={18}
            barBorderRadius={4}
            maxValue={100}
            noOfSections={4}
            yAxisColor={Theme.colors.border}
            xAxisColor={Theme.colors.border}
            rulesColor={Theme.colors.border}
            rulesType="dashed"
            yAxisTextStyle={styles.ejeTexto}
            xAxisLabelTextStyle={styles.ejeTexto}
            yAxisLabelSuffix="%"
          />
        )}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carruselResumen}>
        {horas.map((item, index) => {
          const condicion = obtenerCondicionClimatica(item.codigoClima);
          return (
            <View key={item.hora || index} style={styles.tarjetaMini}>
              <Text style={styles.horaMini}>{index === 0 ? "Ahora" : formatHora(item.hora)}</Text>
              <Ionicons name={condicion.icono} size={18} color={Theme.colors.primary} style={styles.iconoMini} />
              <Text style={styles.tempMini}>{formatTemp(item.temperatura)}</Text>
              <Text style={styles.lluviaMini}>💧{Math.round(item.probabilidadLluvia ?? 0)}%</Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.radius.lg,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 13,
    fontWeight: "700",
    color: Theme.colors.textMain,
    flex: 1,
  },
  pestanas: {
    flexDirection: "row",
    backgroundColor: Theme.colors.primaryLight,
    borderRadius: Theme.radius.md,
    padding: 2,
    gap: 2,
  },
  botonPestana: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Theme.radius.sm,
    gap: 4,
  },
  botonPestanaActiva: {
    backgroundColor: Theme.colors.primary,
  },
  textoPestana: {
    fontSize: 11,
    fontWeight: "600",
    color: Theme.colors.textMuted,
  },
  textoPestanaActiva: {
    color: "#FFFFFF",
  },
  graficaWrapper: {
    marginVertical: 4,
    alignItems: "center",
    overflow: "hidden",
  },
  ejeTexto: {
    fontSize: 10,
    color: Theme.colors.textMuted,
    fontWeight: "500",
  },
  topLabelBarra: {
    fontSize: 9,
    color: Theme.colors.textMuted,
    fontWeight: "700",
    marginBottom: 2,
    width: 32,
    textAlign: "center",
  },
  carruselResumen: {
    paddingTop: 12,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.border,
    marginTop: 8,
  },
  tarjetaMini: {
    alignItems: "center",
    width: 48,
    paddingVertical: 4,
  },
  horaMini: {
    fontSize: 10,
    fontWeight: "600",
    color: Theme.colors.textMuted,
    marginBottom: 4,
  },
  iconoMini: {
    marginBottom: 4,
  },
  tempMini: {
    fontSize: 11,
    fontWeight: "700",
    color: Theme.colors.textMain,
    marginBottom: 2,
  },
  lluviaMini: {
    fontSize: 9,
    fontWeight: "600",
    color: Theme.colors.accentText,
  },
});
