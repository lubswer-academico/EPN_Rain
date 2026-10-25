
import { ComponentProps } from "react";
import { Ionicons } from "@expo/vector-icons";

type IoniconName = ComponentProps<typeof Ionicons>["name"];

export interface CondicionClimatica {
  descripcion: string;
  icono: IoniconName;
  color: string;
}

export function obtenerCondicionClimatica(codigo?: number): CondicionClimatica {
  if (codigo === undefined || codigo === null) {
    return { descripcion: "Desconocido", icono: "help-circle-outline", color: "#8E8E93" };
  }

  switch (codigo) {
    case 0:
      return { descripcion: "Cielo despejado", icono: "sunny", color: "#F59E0B" };
    case 1:
    case 2:
    case 3:
      return { descripcion: "Nublado", icono: "cloudy", color: "#64748B" };
    case 45:
    case 48:
      return { descripcion: "Niebla", icono: "filter-outline", color: "#94A3B8" };
    case 51:
    case 53:
    case 55:
      return { descripcion: "Llovizna leve", icono: "rainy-outline", color: "#38BDF8" };
    case 61:
    case 63:
    case 65:
      return { descripcion: "Lluvia moderada", icono: "rainy", color: "#2563EB" };
    case 80:
    case 81:
    case 82:
      return { descripcion: "Chubascos", icono: "water-outline", color: "#3B82F6" };
    case 95:
    case 96:
    case 99:
      return { descripcion: "Tormenta eléctrica", icono: "thunderstorm", color: "#7C3AED" };
    default:
      return { descripcion: "Condición mixta", icono: "partly-sunny", color: "#64748B" };
  }
}
