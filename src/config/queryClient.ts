import { QueryClient } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { queryKeys } from "../constants/queryKeys";
import { ubicacionesService } from "../api/ubicaciones.service";
import { NuevaUbicacionInput, ActualizarUbicacionInput } from "../types/location";

export const MAX_AGE_PERSISTENCIA = 1000 * 60 * 60 * 24;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: MAX_AGE_PERSISTENCIA,
      retry: 2,
    },
  },
});

export const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: "CLIMA_APP_CACHE",
});

queryClient.setMutationDefaults(queryKeys.mutaciones.crearUbicacion, {
  mutationFn: async (variables: NuevaUbicacionInput) => {
    return await ubicacionesService.agregar(variables);
  },
});

queryClient.setMutationDefaults(queryKeys.mutaciones.editarUbicacion, {
  mutationFn: async (variables: ActualizarUbicacionInput) => {
    return await ubicacionesService.actualizar(variables);
  },
});
