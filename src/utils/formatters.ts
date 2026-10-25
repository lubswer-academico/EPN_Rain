export function formatTemp(valor?: number): string {
  if (valor === undefined || isNaN(valor)) return "--°C";
  return `${Math.round(valor)}°C`;
}

export function formatCoord(valor?: number): string {
  if (valor === undefined || isNaN(valor)) return "0.0000";
  return valor.toFixed(4);
}

export function formatHora(isoString: string): string {
  try {
    if (isoString.includes("T")) {
      const parteHora = isoString.split("T")[1];
      const horas = parseInt(parteHora.substring(0, 2), 10);
      const ampm = horas >= 12 ? "PM" : "AM";
      const hora12 = horas % 12 || 12;
      return `${hora12} ${ampm}`;
    }
    const fecha = new Date(isoString);
    const horas = fecha.getHours();
    const ampm = horas >= 12 ? "PM" : "AM";
    const hora12 = horas % 12 || 12;
    return `${hora12} ${ampm}`;
  } catch {
    return isoString;
  }
}
