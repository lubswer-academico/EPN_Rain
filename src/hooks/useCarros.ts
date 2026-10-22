import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import { Carro } from "../types/carro";
import { carrosService } from "../api/carros.service";

const KEY = ["carros"];

export function useCarros() {
  return useQuery({
    queryKey: KEY,
    queryFn: () => carrosService.getAll(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useAgregarCarro() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (carro: Omit<Carro, "id"> | { marca: string } | string) =>
      carrosService.add(carro),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useActualizarCarro() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (carro: Carro) => carrosService.update(carro),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useEliminarCarro() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => carrosService.delete(id),
    onMutate: async (id: string) => {
      await qc.cancelQueries({ queryKey: KEY });
      const previousCarros = qc.getQueryData<Carro[]>(KEY);

      qc.setQueryData<Carro[]>(KEY, (old) => {
        return old ? old.filter((carro) => carro.id !== id) : [];
      });

      return { previousCarros };
    },
    onSuccess: () => {
      Alert.alert("Éxito", "Carro eliminado con éxito");
    },
    onError: (err, id, context) => {
      if (context?.previousCarros) {
        qc.setQueryData(KEY, context.previousCarros);
      }
      Alert.alert(
        "Error al eliminar",
        "No fue posible eliminar el carro en el servidor. Se ha restaurado en la lista."
      );
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: KEY });
    },
  });
}