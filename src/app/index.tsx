import {useEffect, useState} from "react"
import {View, Text, TextInput, Button, FlatList} from "react-native"
import {Carro} from "../types/carro" 
import {carrosService} from "../api/carros.service"
import {useCarros, useAgregarCarro} from "../hooks/useCarros"


export default function App() {
  
  //Estado para manejar el tecxto ingresado de la marca del carro
  const [marca, setMarca] = useState<string>("")
  //Get: funcon reutilizable par traer la lista desede el backend

  //Get. de tanstackQuery para manejar a caga en cache y los estados
  const {data: carros = [], isLoading, error} = useCarros()

  //Post: invalida y refrescar la lista de carros

  const {mutate: agregarCarro} = useAgregarCarro()




  //Post: funcion para agrewgar un nuevo carro

  const agregar = async () => {
    agregarCarro(marca, {onSuccess: () => setMarca("")})
  }
  //isLoading y error
  //True durante la primera carga cuando aun no hya datos
  //Mientras tanto un texto en lugar de la patalla con la lista de carros
  if(isLoading) return <Text>Cargando...</Text> 
  //Si el get falló, serviicio caido etc, Este metodo trae la exepcion
  if(error) return <Text>Error: {error.message}</Text>


  return (
    <View style={{flex: 1, backgroundColor: "#fff"}}>
      <TextInput
        placeholder="Ingrese la marca del carro"
        value={marca}
        onChangeText={setMarca}
        style= {{borderWidth: 3}}
      />
      <Button title="Agregar" onPress={agregar} />
      <Text style = {{paddingTop: 20, paddingBottom: 10, display: "flex", textAlign: "center"}}>Lista de Carros</Text>
      <FlatList
      data = {carros}
      keyExtractor={(item) => item.id}
      renderItem={({item}) => 
      <Text>{item.id} - {item.marca}</Text>}
      ></FlatList>
    </View>
  )
}
