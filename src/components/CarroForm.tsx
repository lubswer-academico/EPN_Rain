import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useForm } from "@tanstack/react-form";
import { Carro } from "../types/carro";
import { PT } from "../constants/patiotuerca";

interface CarroFormProps {
  carroInicial?: Carro;
  onSubmit: (valores: Carro) => Promise<void> | void;
  onCancel?: () => void;
  textoBoton?: string;
  isSubmittingExterno?: boolean;
}

const anioMaximo = new Date().getFullYear() + 1;

export const validadores = {
  marca: (val: string) => {
    if (!val || !val.trim()) return "La marca es obligatoria.";
    if (/\d/.test(val)) return "La marca solo debe contener letras (no números).";
    if (val.trim().length < 2) return "La marca debe tener al menos 2 letras.";
    return undefined;
  },
  color: (val: string) => {
    if (!val || !val.trim()) return "El color es obligatorio.";
    if (/\d/.test(val)) return "El color solo debe contener letras (no números).";
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(val.trim())) {
      return "El color solo debe contener letras.";
    }
    return undefined;
  },
  matricula: (val: string) => {
    if (!val || !val.trim()) return "La matrícula es obligatoria.";
    const formatoPlaca = /^[A-Z]{3}-?\d{3,4}$/i;
    if (!formatoPlaca.test(val.trim())) {
      return "Formato inválido. Ejemplo: ABC-123 o ABC-1234.";
    }
    return undefined;
  },
  anio: (val: string) => {
    if (!val || !val.trim()) return "El año es obligatorio.";
    if (!/^\d+$/.test(val.trim())) return "El año debe ser un número entero.";
    const num = Number(val);
    if (num < 1900 || num > anioMaximo) {
      return `El año debe estar entre 1900 y ${anioMaximo}.`;
    }
    return undefined;
  },
  precio: (val: string) => {
    if (!val || !val.trim()) return "El precio es obligatorio.";
    const num = Number(val);
    if (isNaN(num)) return "El precio debe ser un número válido.";
    if (num <= 0) return "El precio debe ser mayor a 0.";
    return undefined;
  },
};

export function CarroForm({
  carroInicial,
  onSubmit,
  onCancel,
  textoBoton = "Guardar",
  isSubmittingExterno = false,
}: CarroFormProps) {
  const form = useForm({
    defaultValues: {
      marca: carroInicial?.marca ?? "",
      color: carroInicial?.color ?? "",
      anio: carroInicial ? String(carroInicial.anio) : "",
      precio: carroInicial ? String(carroInicial.precio) : "",
      matricula: carroInicial?.matricula ?? "",
    },
    validators: {
      onChange: ({ value }) => {
        if (
          validadores.marca(value.marca) ||
          validadores.color(value.color) ||
          validadores.matricula(value.matricula) ||
          validadores.anio(value.anio) ||
          validadores.precio(value.precio)
        ) {
          return "Hay campos con errores en el formulario.";
        }
        return undefined;
      },
      onMount: ({ value }) => {
        if (
          validadores.marca(value.marca) ||
          validadores.color(value.color) ||
          validadores.matricula(value.matricula) ||
          validadores.anio(value.anio) ||
          validadores.precio(value.precio)
        ) {
          return "Por favor completa todos los campos requeridos.";
        }
        return undefined;
      },
    },
    onSubmit: async ({ value }) => {
      const errMarca = validadores.marca(value.marca);
      const errColor = validadores.color(value.color);
      const errMatricula = validadores.matricula(value.matricula);
      const errAnio = validadores.anio(value.anio);
      const errPrecio = validadores.precio(value.precio);

      if (errMarca || errColor || errMatricula || errAnio || errPrecio) {
        return;
      }

      const dataFinal: Carro = {
        id: carroInicial?.id ?? "",
        marca: value.marca.trim(),
        color: value.color.trim(),
        anio: Number(value.anio),
        precio: Number(value.precio),
        matricula: value.matricula.trim().toUpperCase(),
      };
      await onSubmit(dataFinal);
    },
  });

  return (
    <View style={styles.formContainer}>
      <form.Field
        name="marca"
        validators={{
          onChange: ({ value }) => validadores.marca(value),
          onBlur: ({ value }) => validadores.marca(value),
        }}
      >
        {(field) => {
          const tieneError = field.state.meta.errors.length > 0;
          return (
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Marca (Solo letras) *</Text>
              <TextInput
                style={[styles.input, tieneError && styles.inputError]}
                placeholder="Ej: Toyota, Chevrolet, Mazda"
                value={field.state.value}
                onChangeText={field.handleChange}
                onBlur={field.handleBlur}
              />
              {tieneError && (
                <Text style={styles.errorText}>
                  {field.state.meta.errors.join(", ")}
                </Text>
              )}
            </View>
          );
        }}
      </form.Field>

      <View style={styles.row}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <form.Field
            name="color"
            validators={{
              onChange: ({ value }) => validadores.color(value),
              onBlur: ({ value }) => validadores.color(value),
            }}
          >
            {(field) => {
              const tieneError = field.state.meta.errors.length > 0;
              return (
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Color (Solo letras) *</Text>
                  <TextInput
                    style={[styles.input, tieneError && styles.inputError]}
                    placeholder="Ej: Rojo, Azul"
                    value={field.state.value}
                    onChangeText={field.handleChange}
                    onBlur={field.handleBlur}
                  />
                  {tieneError && (
                    <Text style={styles.errorText}>
                      {field.state.meta.errors.join(", ")}
                    </Text>
                  )}
                </View>
              );
            }}
          </form.Field>
        </View>

        <View style={{ flex: 1 }}>
          <form.Field
            name="matricula"
            validators={{
              onChange: ({ value }) => validadores.matricula(value),
              onBlur: ({ value }) => validadores.matricula(value),
            }}
          >
            {(field) => {
              const tieneError = field.state.meta.errors.length > 0;
              return (
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Matrícula (Placa) *</Text>
                  <TextInput
                    style={[styles.input, tieneError && styles.inputError]}
                    placeholder="Ej: ABC-1234"
                    autoCapitalize="characters"
                    value={field.state.value}
                    onChangeText={(text) => field.handleChange(text.toUpperCase())}
                    onBlur={field.handleBlur}
                  />
                  {tieneError && (
                    <Text style={styles.errorText}>
                      {field.state.meta.errors.join(", ")}
                    </Text>
                  )}
                </View>
              );
            }}
          </form.Field>
        </View>
      </View>

      <View style={styles.row}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <form.Field
            name="anio"
            validators={{
              onChange: ({ value }) => validadores.anio(value),
              onBlur: ({ value }) => validadores.anio(value),
            }}
          >
            {(field) => {
              const tieneError = field.state.meta.errors.length > 0;
              return (
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Año (1900-{anioMaximo}) *</Text>
                  <TextInput
                    style={[styles.input, tieneError && styles.inputError]}
                    placeholder={`Ej: ${new Date().getFullYear()}`}
                    keyboardType="numeric"
                    maxLength={4}
                    value={field.state.value}
                    onChangeText={(text) =>
                      field.handleChange(text.replace(/[^0-9]/g, ""))
                    }
                    onBlur={field.handleBlur}
                  />
                  {tieneError && (
                    <Text style={styles.errorText}>
                      {field.state.meta.errors.join(", ")}
                    </Text>
                  )}
                </View>
              );
            }}
          </form.Field>
        </View>

        <View style={{ flex: 1 }}>
          <form.Field
            name="precio"
            validators={{
              onChange: ({ value }) => validadores.precio(value),
              onBlur: ({ value }) => validadores.precio(value),
            }}
          >
            {(field) => {
              const tieneError = field.state.meta.errors.length > 0;
              return (
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Precio ($ mayor a 0) *</Text>
                  <TextInput
                    style={[styles.input, tieneError && styles.inputError]}
                    placeholder="Ej: 15000"
                    keyboardType="numeric"
                    value={field.state.value}
                    onChangeText={(text) =>
                      field.handleChange(text.replace(/[^0-9.]/g, ""))
                    }
                    onBlur={field.handleBlur}
                  />
                  {tieneError && (
                    <Text style={styles.errorText}>
                      {field.state.meta.errors.join(", ")}
                    </Text>
                  )}
                </View>
              );
            }}
          </form.Field>
        </View>
      </View>

      <form.Subscribe
        selector={(state) => ({
          canSubmit: state.canSubmit,
          isSubmitting: state.isSubmitting,
          values: state.values,
        })}
      >
        {({ canSubmit, isSubmitting, values }) => {
          const tieneErrores =
            Boolean(validadores.marca(values.marca)) ||
            Boolean(validadores.color(values.color)) ||
            Boolean(validadores.matricula(values.matricula)) ||
            Boolean(validadores.anio(values.anio)) ||
            Boolean(validadores.precio(values.precio));

          const enviando = isSubmitting || isSubmittingExterno;
          const estaDeshabilitado = Boolean(!canSubmit || tieneErrores || enviando);

          return (
            <View style={styles.buttonRow}>
              {onCancel && (
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={onCancel}
                  disabled={enviando}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[
                  styles.button,
                  styles.submitButton,
                  estaDeshabilitado && styles.disabledButton,
                ]}
                onPress={form.handleSubmit}
                disabled={estaDeshabilitado}
              >
                {enviando ? (
                  <ActivityIndicator color="#ffffff" size="small" />
                ) : (
                  <Text style={styles.submitButtonText}>{textoBoton}</Text>
                )}
              </TouchableOpacity>
            </View>
          );
        }}
      </form.Subscribe>
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    padding: 16,
    backgroundColor: PT.colors.surface,
    borderRadius: PT.radius.widget,
    borderWidth: 1,
    borderColor: PT.colors.border,
  },
  fieldGroup: {
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: PT.colors.textMain,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: PT.colors.border,
    borderRadius: PT.radius.button,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    backgroundColor: PT.colors.surface,
    color: PT.colors.textMain,
  },
  inputError: {
    borderColor: PT.colors.error,
    backgroundColor: PT.colors.errorBg,
  },
  errorText: {
    color: PT.colors.error,
    fontSize: 12,
    marginTop: 3,
    fontWeight: "500",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: PT.radius.button,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 100,
  },
  submitButton: {
    backgroundColor: PT.colors.primary,
  },
  disabledButton: {
    backgroundColor: PT.colors.disabled,
  },
  submitButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 14,
  },
  cancelButton: {
    backgroundColor: "#F4F5F7",
  },
  cancelButtonText: {
    color: PT.colors.textMuted,
    fontWeight: "600",
    fontSize: 14,
  },
});
