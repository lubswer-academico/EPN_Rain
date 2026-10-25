import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Theme } from "../../constants/theme";
import { Ubicacion } from "../../types/location";
import { formatCoord } from "../../utils/formatters";

interface Props {
  ubicacion: Ubicacion;
  onEditar: (ubicacion: Ubicacion) => void;
  onEliminar: (id: string) => void;
}

export function LocationCard({ ubicacion, onEditar, onEliminar }: Props) {
  const esPendiente = Boolean(
    ubicacion._pendienteSync || ubicacion.id.startsWith("temp-")
  );

  return (
    <View style={[styles.card, esPendiente && styles.cardPendiente]}>
      <View style={styles.contentRow}>
        <View
          style={[
            styles.avatar,
            esPendiente ? styles.avatarPendiente : styles.avatarSincronizado,
          ]}
        >
          <Ionicons
            name="location-sharp"
            size={20}
            color={esPendiente ? Theme.colors.accentAmber : Theme.colors.primary}
          />
        </View>

        <View style={styles.infoCol}>
          <View style={styles.nombreRow}>
            <Text style={styles.nombre} numberOfLines={1}>
              {ubicacion.nombre}
            </Text>
            {esPendiente ? (
              <View style={styles.badgePendiente}>
                <Ionicons
                  name="time-outline"
                  size={11}
                  color={Theme.colors.badgePendingText}
                />
                <Text style={styles.badgePendienteTexto}>PENDIENTE</Text>
              </View>
            ) : (
              <View style={styles.badgeSincronizado}>
                <Ionicons
                  name="checkmark-circle"
                  size={11}
                  color={Theme.colors.badgeOnlineText}
                />
                <Text style={styles.badgeSincronizadoTexto}>SINCRONIZADO</Text>
              </View>
            )}
          </View>

          <View style={styles.coordsChip}>
            <Ionicons name="navigate-outline" size={11} color={Theme.colors.textMuted} />
            <Text style={styles.coordsTexto}>
              {formatCoord(ubicacion.latitud)}, {formatCoord(ubicacion.longitud)}
            </Text>
          </View>
        </View>

        <View style={styles.actionsCol}>
          <TouchableOpacity
            style={[styles.btnAccion, styles.btnEditar]}
            onPress={() => onEditar(ubicacion)}
            disabled={esPendiente}
            activeOpacity={0.7}
          >
            <Ionicons
              name="pencil-sharp"
              size={15}
              color={esPendiente ? "#94A3B8" : Theme.colors.primary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btnAccion, styles.btnEliminar]}
            onPress={() => onEliminar(ubicacion.id)}
            activeOpacity={0.7}
          >
            <Ionicons name="trash-outline" size={15} color={Theme.colors.accentRed} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.radius.lg,
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    shadowColor: Theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  cardPendiente: {
    backgroundColor: "#FFFDF5",
    borderColor: Theme.colors.accent,
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarSincronizado: {
    backgroundColor: Theme.colors.primaryLight,
  },
  avatarPendiente: {
    backgroundColor: Theme.colors.badgePendingBg,
  },
  infoCol: {
    flex: 1,
    justifyContent: "center",
  },
  nombreRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 4,
  },
  nombre: {
    fontSize: 15,
    fontWeight: "700",
    color: Theme.colors.textMain,
    flexShrink: 1,
  },
  badgePendiente: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgePendienteTexto: {
    fontSize: 9,
    fontWeight: "800",
    color: Theme.colors.badgePendingText,
  },
  badgeSincronizado: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeSincronizadoTexto: {
    fontSize: 9,
    fontWeight: "700",
    color: Theme.colors.badgeOnlineText,
  },
  coordsChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    alignSelf: "flex-start",
    backgroundColor: Theme.colors.background,
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  coordsTexto: {
    fontSize: 11,
    color: Theme.colors.textMuted,
    fontWeight: "600",
  },
  actionsCol: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginLeft: 10,
  },
  btnAccion: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  btnEditar: {
    backgroundColor: Theme.colors.surface,
    borderColor: Theme.colors.border,
  },
  btnEliminar: {
    backgroundColor: Theme.colors.surface,
    borderColor: Theme.colors.border,
  },
});
