export function calcularDistanciaKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radio de la Tierra en km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(1));
}

export function ordenarPorCercania(lat, lng, sucursales, cantidad = 4) {
  return sucursales
    .map((suc) => ({
      ...suc,
      distanciaKm: calcularDistanciaKm(lat, lng, suc.lat, suc.lng)
    }))
    .sort((a, b) => a.distanciaKm - b.distanciaKm)
    .slice(0, cantidad);
}