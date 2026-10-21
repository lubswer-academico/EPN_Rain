import {Tabs} from "expo-router"; //Tipo de navegacion 
import {QueryClient,QueryClientProvider} from "@tanstack/react-query";//configuracion y provedor de queries

const qc = new QueryClient() //Este bjeto administra el cache de la vida de querys
//Componente Layout para envolver la navegacion dentro del Query cliente provider
//Con esto todos los componentes hijos pueden usar useQuery y useMutation
//Este es el punto de integracion entre tnstackQuery y la navegacion de Expo Router

export default function Layout() {
  return (
    <QueryClientProvider client={qc}>
      <Tabs>
        <Tabs.Screen name="index" options={{title: "Home"}} />
        <Tabs.Screen name="explore" options={{title: "Explore"}} />
      </Tabs>
    </QueryClientProvider>
  )
}
