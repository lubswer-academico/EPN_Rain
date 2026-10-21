// importamos los hooks de time stack query
//useQuery para consultas get
//useMutation para consultas post, put, delete
//useQueryCliente: Interactuar con la cache , invalidar refresacar
import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query"
import {Carro} from "../types/carro"
import {carrosService} from "../api/carros.service"

//Definir constante key que servirá como identificador único para las Querys relacionadas con carros
const KEY = ["carros"]

export function useCarros() {
    return useQuery({
        queryKey: ["carros"],
        queryFn: () => {
            console.log("Get ejecutado con axios desde hook useCarros.ts")
            return carrosService.getAll()},
        staleTime: 1000 * 60 * 5, //Significa cuanto tiemo los datos se consideran Frescos
    })
}

//Hook personalizado para agregar un nuevo carro y encapsula la logica de agregar un carro nuevo
// Usa useMutation con mutationFn que llama a carrosService.sdd()
//onSuccess: invalidar la query de carros para que se refresque la lista de carros despues de agregar uno nuevo

export function useAgregarCarro() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (marca: string) => carrosService.add(marca),
        onSuccess: () => qc.invalidateQueries({queryKey: KEY})  
    })
}