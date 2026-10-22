import { client } from "./client";
import { Carro } from "../types/carro";

export const carrosService = {
  getAll: async (): Promise<Carro[]> => {
    const { data } = await client.get<Carro[]>("patio");
    return data;
  },

  add: async (
    carro: Omit<Carro, "id"> | { marca: string } | string
  ): Promise<Carro> => {
    const payload = typeof carro === "string" ? { marca: carro } : carro;
    const { data } = await client.post<Carro>("patio", payload);
    return data;
  },

  update: async (carro: Carro): Promise<Carro> => {
    const { data } = await client.put<Carro>(`patio/${carro.id}`, carro);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await client.delete(`patio/${id}`);
  },
};