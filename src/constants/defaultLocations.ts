export interface UbicacionPreset {
  nombre: string;
  latitud: number;
  longitud: number;
  pais: string;
}

export const DEFAULT_LOCATIONS: UbicacionPreset[] = [
  { nombre: "EPN", latitud: -0.209541, longitud: -78.489350, pais: "Ecuador" },
];
