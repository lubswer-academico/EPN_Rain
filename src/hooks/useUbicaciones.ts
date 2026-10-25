import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import { ubicacionesService } from "../api/ubicaciones.service";
import { MAX_AGE_PERSISTENCIA } from "../config/queryClient";
import { queryKeys } from "../constants/queryKeys";
import {
  ActualizarUbicacionInput,
  NuevaUbicacionInput,
  Ubicacion,
} from "../types/location";

export function useUbicaciones() {
  return useQuery({
    queryKey: queryKeys.ubicacionesMock.lista,
    queryFn: () => ubicacionesService.obtenerTodas(),
    staleTime: 1000 * 30, 
    gcTime: MAX_AGE_PERSISTENCIA, 
  });
}

export function useCrearUbicacion() {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: queryKeys.mutaciones.crearUbicacion,
    mutationFn: (nueva: NuevaUbicacionInput) =>ubicacionesService.agregar(nueva),
    onMutate: async (nueva) => {
      await qc.cancelQueries({ queryKey: queryKeys.ubicacionesMock.lista });
      const anterior = qc.getQueryData<Ubicacion[]>(
        queryKeys.ubicacionesMock.lista,
      );
      const optimista: Ubicacion = {
        ...nueva,
        id: `temp-${Date.now()}`,
        _pendienteSync: true,
        createdAt: new Date().toISOString(),
      };
      qc.setQueryData<Ubicacion[]>(
        queryKeys.ubicacionesMock.lista,
        (old = []) => [optimista, ...old],
      );
      return { anterior };
    },
    onError: (err, variables, context) => {
      if (context?.anterior) {
        qc.setQueryData(queryKeys.ubicacionesMock.lista, context.anterior);
      }
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: queryKeys.ubicacionesMock.lista });
    },
  });
}

export function useEditarUbicacion() {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: queryKeys.mutaciones.editarUbicacion,
    mutationFn: (actualizada: ActualizarUbicacionInput) =>
      ubicacionesService.actualizar(actualizada),

    onMutate: async (actualizada) => {
      await qc.cancelQueries({ queryKey: queryKeys.ubicacionesMock.lista });
      const anterior = qc.getQueryData<Ubicacion[]>(
        queryKeys.ubicacionesMock.lista,
      );

      qc.setQueryData<Ubicacion[]>(
        queryKeys.ubicacionesMock.lista,
        (old = []) =>
          old.map((item) =>
            item.id === actualizada.id
              ? { ...item, ...actualizada, _pendienteSync: true }
              : item,
          ),
      );

      return { anterior };
    },

    onError: (err, variables, context) => {
      if (context?.anterior) {
        qc.setQueryData(queryKeys.ubicacionesMock.lista, context.anterior);
      }
    },

    onSettled: (data, err, variables) => {
      qc.invalidateQueries({ queryKey: queryKeys.ubicacionesMock.lista });
      qc.invalidateQueries({
        queryKey: queryKeys.ubicacionesMock.detalle(variables.id),
      });
    },
  });
}

export function useEliminarUbicacion() {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: queryKeys.mutaciones.eliminarUbicacion,
    mutationFn: (id: string) => ubicacionesService.eliminar(id),

    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: queryKeys.ubicacionesMock.lista });
      const anterior = qc.getQueryData<Ubicacion[]>(
        queryKeys.ubicacionesMock.lista,
      );

      qc.setQueryData<Ubicacion[]>(
        queryKeys.ubicacionesMock.lista,
        (old = []) => old.filter((item) => item.id !== id),
      );

      return { anterior };
    },

    onError: (err, id, context) => {
      if (context?.anterior) {
        qc.setQueryData(queryKeys.ubicacionesMock.lista, context.anterior);
      }
      Alert.alert("Error", "No se pudo eliminar la ubicación en el servidor.");
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: queryKeys.ubicacionesMock.lista });
    },
  });
}
