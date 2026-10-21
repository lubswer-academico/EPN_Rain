import axios from "axios"
 
//Crear un cliente de axios configurad
// Base URL : La URL de la API , tomando de variables de entorno EXPO
// Headers : Los encabezados por defecto para todas las solicitudes
export const client = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers:{
    "Content-Type": "application/json"
  }
})

