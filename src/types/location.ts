export interface Ubicacion {
  id: string;
  nombre: string;
  latitud: number;
  longitud: number;
  esFavorita?: boolean;
  createdAt?: string;
  _pendienteSync?: boolean;
}

export type NuevaUbicacionInput = Omit<Ubicacion, "id" | "createdAt" | "_pendienteSync">;

export type ActualizarUbicacionInput = Partial<NuevaUbicacionInput> & { id: string };
