import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Ubicacion, NuevaUbicacionInput } from "../../types/location";
import { useCrearUbicacion, useEditarUbicacion } from "../../hooks/useUbicaciones";
import { Theme } from "../../constants/theme";

interface Props {
  visible: boolean;
  onCerrar?: () => void;
  onClose?: () => void;
  ubicacionEditar?: Ubicacion | null;
  latInicial?: number;
  lonInicial?: number;
  nombreInicial?: string;
  defaultLat?: number;
  defaultLon?: number;
  defaultNombre?: string;
  onSubmit?: (data: NuevaUbicacionInput, idEditar?: string) => Promise<void> | void;
  isSubmitting?: boolean;
}

export function LocationModalForm({
  visible,
  onCerrar,
  onClose,
  ubicacionEditar,
  latInicial,
  lonInicial,
  nombreInicial,
  defaultLat = -0.1807,
  defaultLon = -78.4678,
  defaultNombre = "",
  onSubmit,
  isSubmitting = false,
}: Props) {
  const cerrar = onCerrar ?? onClose ?? (() => {});
  const latBase = latInicial ?? defaultLat;
  const lonBase = lonInicial ?? defaultLon;
  const nombreBase = nombreInicial ?? defaultNombre;

  const [nombre, setNombre] = useState(ubicacionEditar?.nombre ?? nombreBase ?? "");
  const [latitud, setLatitud] = useState(ubicacionEditar ? String(ubicacionEditar.latitud) : (latInicial !== undefined ? String(latInicial) : ""));
  const [longitud, setLongitud] = useState(ubicacionEditar ? String(ubicacionEditar.longitud) : (lonInicial !== undefined ? String(lonInicial) : ""));

  const crearMutacion = useCrearUbicacion();
  const editarMutacion = useEditarUbicacion();

  const guardando = isSubmitting || crearMutacion.isPending || editarMutacion.isPending;

  const handleGuardar = async () => {
    if (!nombre.trim()) {
      Alert.alert("Campo requerido", "Por favor ingresa un nombre para la ubicación.");
      return;
    }

    const latNum = parseFloat(latitud);
    const lonNum = parseFloat(longitud);

    if (isNaN(latNum) || latNum < -90 || latNum > 90) {
      Alert.alert("Latitud inválida", "La latitud debe ser un número entre -90 y 90.");
      return;
    }
    if (isNaN(lonNum) || lonNum < -180 || lonNum > 180) {
      Alert.alert("Longitud inválida", "La longitud debe ser un número entre -180 y 180.");
      return;
    }

    const payload: NuevaUbicacionInput = {
      nombre: nombre.trim(),
      latitud: latNum,
      longitud: lonNum,
      esFavorita: true,
    };

    if (onSubmit) {
      await onSubmit(payload, ubicacionEditar ? ubicacionEditar.id : undefined);
      cerrar();
      return;
    }

    if (ubicacionEditar) {
      editarMutacion.mutate({ id: ubicacionEditar.id, ...payload });
    } else {
      crearMutacion.mutate(payload);
    }

    cerrar();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={cerrar}>
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <View style={styles.header}>
            <Text style={styles.modalTitle}>
              {ubicacionEditar ? "Editar Ubicación" : "Nueva Ubicación"}
            </Text>
            <TouchableOpacity onPress={cerrar} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={Theme.colors.textMuted} />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Nombre de la Ubicación *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Mi Casa"
            value={nombre}
            onChangeText={setNombre}
          />

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={styles.label}>Latitud</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: -0.1807"
                value={latitud}
                onChangeText={setLatitud}
                keyboardType="numeric"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Longitud</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: -78.4678"
                value={longitud}
                onChangeText={setLongitud}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.btnCancel} onPress={cerrar} disabled={guardando}>
              <Text style={styles.btnCancelText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnSave} onPress={handleGuardar} disabled={guardando}>
              {guardando ? (
                <ActivityIndicator color={Theme.colors.primary} size="small" />
              ) : (
                <Text style={styles.btnSaveText}>
                  {ubicacionEditar ? "Actualizar" : "Guardar Ubicación"}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(13, 28, 51, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalBox: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.radius.lg,
    padding: 20,
    width: "100%",
    maxWidth: 380,
    shadowColor: Theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Theme.colors.textMain,
  },
  closeBtn: {
    padding: 6,
  },
  hint: {
    fontSize: 12,
    color: Theme.colors.textMuted,
    marginTop: 4,
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: Theme.colors.textMain,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: Theme.colors.border,
    borderRadius: Theme.radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 7,
    fontSize: 13,
    marginBottom: 10,
    backgroundColor: Theme.colors.background,
    color: Theme.colors.textMain,
  },
  row: {
    flexDirection: "row",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 6,
  },
  btnCancel: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: Theme.radius.sm,
    backgroundColor: Theme.colors.background,
  },
  btnCancelText: {
    color: Theme.colors.textMuted,
    fontWeight: "600",
    fontSize: 13,
  },
  btnSave: {
    backgroundColor: Theme.colors.accent,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: Theme.radius.sm,
    minWidth: 90,
    alignItems: "center",
  },
  btnSaveText: {
    color: Theme.colors.primary,
    fontWeight: "700",
    fontSize: 13,
  },
});
