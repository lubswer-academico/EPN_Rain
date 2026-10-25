export const queryKeys = {
  climaPublico: {
    pronostico: (lat: number, lon: number) =>
      ["climaPublico", "pronostico", { lat, lon }] as const,
  },
  ubicacionesMock: {
    lista: ["ubicacionesMock", "lista"] as const,
    detalle: (id: string) => ["ubicacionesMock", "detalle", id] as const,
  },
  mutaciones: {
    crearUbicacion: ["ubicaciones", "crear"] as const,
    editarUbicacion: ["ubicaciones", "editar"] as const,
    eliminarUbicacion: ["ubicaciones", "eliminar"] as const,
  },
} as const;
