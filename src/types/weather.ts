export interface ClimaActual {
  time: string;
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  precipitation?: number;
  weather_code: number;
  wind_speed_10m: number;
}

export interface ClimaPorHora {
  time: string[];
  temperature_2m: number[];
  precipitation_probability?: number[];
  weather_code?: number[];
}

export interface RespuestaClimaApi {
  latitude: number;
  longitude: number;
  timezone: string;
  current: ClimaActual;
  hourly: ClimaPorHora;
}

export interface ItemHoraPronostico {
  hora: string;
  temperatura: number;
  codigoClima?: number;
  probabilidadLluvia: number;
}

export interface PronosticoClima {
  actual: ClimaActual;
  proximas24Horas: ItemHoraPronostico[];
  porHora: ItemHoraPronostico[];
  nombreCiudad?: string;
}
