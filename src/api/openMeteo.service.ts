import axios from "axios";
import { RespuestaClimaApi, PronosticoClima, ItemHoraPronostico } from "../types/weather";

const OPEN_METEO_URL = process.env.EXPO_PUBLIC_OPEN_METEO_URL as string;

export const openMeteoService = {
  getClima: async (lat: number, lon: number): Promise<PronosticoClima> => {
    const params = {
      latitude: lat,
      longitude: lon,
      current: "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m",
      hourly: "temperature_2m,precipitation_probability,weather_code",
      models: "icon_seamless",
      timezone: "auto",
    };

    const { data } = await axios.get<RespuestaClimaApi>(OPEN_METEO_URL, { params });

    const horaLocal = data.current.time ? data.current.time.substring(0, 13) : "";
    const indiceInicio = data.hourly.time.findIndex((t) => t.substring(0, 13) >= horaLocal);
    const inicio = indiceInicio >= 0 ? indiceInicio : 0;
    const totalHoras = Math.min(24, data.hourly.time.length - inicio);

    const proximas24Horas: ItemHoraPronostico[] = [];
    for (let i = 0; i < totalHoras; i++) {
      const idx = inicio + i;
      proximas24Horas.push({
        hora: data.hourly.time[idx],
        temperatura: data.hourly.temperature_2m[idx],
        codigoClima: data.hourly.weather_code ? data.hourly.weather_code[idx] : undefined,
        probabilidadLluvia: data.hourly.precipitation_probability ? Math.round(data.hourly.precipitation_probability[idx]) : 0,
      });
    }

    return {
      actual: data.current,
      proximas24Horas,
      porHora: proximas24Horas,
    };
  },
};
