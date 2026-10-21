import {useState, useEffect} from "react"
import {View, Text, TextInput, Button, FlatList} from "react-native"
import {Carro} from "../types/carro"
import {carrosService} from "../api/carros.service"
import {useCarros} from "../hooks/useCarros"




export default function Explore() {

  //Misma queryKey que index: Comparten la cache con esa vista, asi que no se repite el get
  //Pero mientras los datos esten frescos

  const {data: carros = []} = useCarros()

  return(
    <View style={{flex: 1, paddingTop: 60, backgroundColor: "#fff"}}>
      <FlatList
        data={carros}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => <Text>{item.id} - {item.marca}</Text>}
      />
    </View>
  )
}