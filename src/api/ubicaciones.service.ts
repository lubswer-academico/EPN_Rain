import { mockApiClient } from "./client";
import { Ubicacion, NuevaUbicacionInput, ActualizarUbicacionInput } from "../types/location";

const RECURSO = "data";

export const ubicacionesService = {
  obtenerTodas: async (): Promise<Ubicacion[]> => {
    const { data } = await mockApiClient.get<Ubicacion[]>(RECURSO);
    return data;
  },

  obtenerPorId: async (id: string): Promise<Ubicacion> => {
    const { data } = await mockApiClient.get<Ubicacion>(`${RECURSO}/${id}`);
    return data;
  },

  agregar: async (ubicacion: NuevaUbicacionInput): Promise<Ubicacion> => {
    const { data } = await mockApiClient.post<Ubicacion>(RECURSO, ubicacion);
    return data;
  },

  actualizar: async ({ id, ...resto }: ActualizarUbicacionInput): Promise<Ubicacion> => {
    const { data } = await mockApiClient.put<Ubicacion>(`${RECURSO}/${id}`, resto);
    return data;
  },

  eliminar: async (id: string): Promise<void> => {
    await mockApiClient.delete(`${RECURSO}/${id}`);
  },
};
