import { useQuery } from "@tanstack/react-query";
import { openMeteoService } from "../api/openMeteo.service";
import { queryKeys } from "../constants/queryKeys";
import { MAX_AGE_PERSISTENCIA } from "../config/queryClient";

export function useWeather(lat: number, lon: number) {
  return useQuery({
    queryKey: queryKeys.climaPublico.pronostico(lat, lon),
    queryFn: () => openMeteoService.getClima(lat, lon),
    staleTime: 1000 * 60 * 15,
    gcTime: MAX_AGE_PERSISTENCIA,
    enabled: !isNaN(lat) && !isNaN(lon),
  });
}
