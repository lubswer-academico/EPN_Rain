//importar axios y el tipo carro

import {client} from "./client"
import {Carro} from "../types/carro"

//Definir un servicio llamado carro service
// EL SERVICIO centraliza las opreaciones de la entidad carro
// Retorna una promise con un arreglo de objetos
//Poner metodos asincronicos para interactuar con la API

export const carrosService = {
    getAll: async (): Promise<Carro[]> => {
        const {data} = await client.get<Carro[]>("patio")
        return data
    },

    //Metodo Post : agregar un nuevo carro y retornmar la promesa con el bjeo
    add: async (marca: string): Promise<Carro> => {
        const {data} = await client.post<Carro>("patio", {marca})
        return data
    }
}