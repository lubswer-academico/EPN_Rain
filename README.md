# 🌦️ Clima Meteo - App Móvil (Expo & TanStack Query Offline)

Aplicación móvil construida en **React Native** con **Expo SDK 57**, diseñada para monitoreo meteorológico consumiendo la API pública de **Open-Meteo** y gestionando ubicaciones personalizadas del usuario en **MockAPI**, implementando **TanStack Query v5** con persistencia en `AsyncStorage` y sincronización de mutaciones sin conexión.

---

## 🏛️ Fuentes de Datos

1. **API Pública de Solo Lectura:** [Open-Meteo Forecast API](https://open-meteo.com/en/docs)
   * Devuelve clima actual, humedad, viento, sensación térmica y pronóstico por horas (24h).
   * No requiere API key y es 100% de solo lectura.
2. **MockAPI (Datos Propios del Usuario):** Recurso `/ubicaciones`
   * Permite registrar, editar y eliminar ubicaciones favoritas con latitud, longitud y notas.
   * Cuenta con soporte completo para operaciones offline y actualización optimista.

---

## 🔑 1. Claves de Consulta (`src/constants/queryKeys.ts`)

Las claves están estructuradas jerárquicamente siguiendo el patrón *Query Key Factory*:

| Ámbito | Clave Jerárquica | Tipo | Invalida tras Mutación | Justificación Técnica |
| :--- | :--- | :--- | :--- | :--- |
| **API Pública** | `['publicWeather', 'forecast', { lat, lon }]` | Consulta | *Ninguna* | Es de solo lectura. No recibe mutaciones locales. |
| **MockAPI (Lista)** | `['mockLocations', 'list']` | Consulta | `crearUbicacion`, `editarUbicacion`, `eliminarUbicacion` | Se invalida tras cualquier mutación para que la lista refleje los IDs asignados por el backend y elimine los temporales optimistas. |
| **MockAPI (Detalle)**| `['mockLocations', 'detail', id]` | Consulta | `editarUbicacion` (por ID) | Invalida la vista individual específica para mantener sincronizado el registro editado. |
| **Mutación Crear** | `['ubicaciones', 'crear']` | Mutación | Invalida lista | Registrada en `setMutationDefaults` para sincronización offline al reiniciar la app. |
| **Mutación Editar** | `['ubicaciones', 'editar']` | Mutación | Invalida lista y detalle | Registrada en `setMutationDefaults` para persistir cambios pendientes. |

---

## ⏱️ 2. Justificación de `staleTime` y `gcTime`

| Fuente | `staleTime` | `gcTime` | Justificación Técnica |
| :--- | :--- | :--- | :--- |
| **Open-Meteo (API Pública)** | **15 minutos** | **24 horas** | El clima físico atmosférico no sufre fluctuaciones drásticas cada segundo. Un `staleTime` de 15 minutos previene solicitudes de red redundantes, ahorrando batería y datos móviles. |
| **MockAPI (Ubicaciones Propias)** | **30 segundos** | **24 horas** | Son datos transaccionales del usuario. Un `staleTime` corto asegura que los datos se consideren desactualizados rápido y se refresquen inmediatamente tras manipular registros. |

### ⚠️ ¿Qué pasaría si `gcTime < maxAge` del persister?
* **`gcTime` (Garbage Collection Time):** Determina cuánto tiempo una consulta inactiva se retiene en la **memoria RAM** antes de ser eliminada por el recolector de basura de TanStack Query.
* **`maxAge`:** Determina la vida útil de los datos serializados en el **disco local (`AsyncStorage`)**.
* **El problema de inconsistencia:** Si `gcTime` fuera menor que `maxAge` (por ejemplo, `gcTime: 5 min` y `maxAge: 24 horas`), la memoria RAM desechará la información a los 5 minutos de inactividad. Si el usuario navega de nuevo a la pantalla sin red, la memoria estará vacía y, aunque los datos sigan existiendo en disco, se producirán desincronizaciones en el ciclo de vida del cliente o flashes de carga innecesarios.
* **Regla:** Mantener siempre **`gcTime >= maxAge`** (en este proyecto ambos están fijados en 24 horas) para que la caché en memoria viva al menos tanto como los datos persistidos en disco.

---

## 📡 3. Mutaciones Sin Conexión y Persistencia

1. **`onlineManager` con NetInfo:** Configurado en `src/config/onlineManager.ts` para detectar en tiempo real si el dispositivo entra en modo avión o recupera conexión.
2. **`setMutationDefaults`:** Las funciones de mutación se asocian de antemano a sus `mutationKeys` en `src/config/queryClient.ts`. Dado que JavaScript no puede guardar funciones dentro de JSON en `AsyncStorage`, este registro permite que, al cerrar la app por completo y volverla a abrir con red, TanStack Query sepa qué función ejecutar para cada mutación pendiente.
3. **`resumePausedMutations()`:** Invocado en el callback `onSuccess` de `PersistQueryClientProvider` en `src/app/_layout.tsx`. Tan pronto la caché se hidrata desde el almacenamiento local, se procesan automáticamente las mutaciones encoladas.
4. **Indicador Visual `[PENDIENTE]`:** Toda ubicación creada sin red se agrega optimísticamente con un ID temporal `temp-...` y un badge ámbar `⏳ PENDIENTE DE SINCRONIZACIÓN`. Al volver la red, se sincroniza con MockAPI y pasa a estado `SINCRONIZADO`.

---

## 🎬 4. Protocolo para el Video Demostrativo (4 a 6 Minutos)

El video debe realizarse desde el APK instalado o emulador, mostrando los logs en consola con timestamps:

1. **Paso 1:** Abrir la app con conexión activa. Mostrar el clima de Quito desde Open-Meteo y la lista de ubicaciones desde MockAPI.
2. **Paso 2:** Desactivar la red (Modo Avión / Wi-Fi apagado). Crear una nueva ubicación (ej: *"Playa Salinas"*). Mostrar en la lista que aparece con el badge **`⏳ PENDIENTE`** (Actualización optimista).
3. **Paso 3:** Cerrar la aplicación por completo (matar el proceso en multitarea).
4. **Paso 4:** Reactivar la red (encender Wi-Fi / datos) y abrir la aplicación.
5. **Paso 5:** Mostrar cómo los datos cargan **de inmediato desde la memoria caché de AsyncStorage antes de la respuesta de red**, y en la consola mostrar el log con hora `[HH:MM:SS] 🔄 [SYNC AUTOMÁTICO]` enviando la mutación pendiente. El badge cambia automáticamente a `SINCRONIZADO`.
6. **Paso 6:** Abrir el navegador en el dashboard de **MockAPI** y verificar que la ubicación creada sin red ya existe en la base de datos con su ID remoto asignado.
7. **Paso 7 (En vivo con el Agente):** Mostrar en pantalla el IDE interactuando con el Agente de IA para validar las reglas del archivo `AGENTS.md` o solicitar una explicación técnica del flujo.
