/**
 * Mengonversi derajat ke radian
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Menghitung jarak antara dua titik koordinat GPS menggunakan formula Haversine.
 * @param lat1 Latitude titik 1 (pengguna)
 * @param lon1 Longitude titik 1 (pengguna)
 * @param lat2 Latitude titik 2 (pemberi jasa)
 * @param lon2 Longitude titik 2 (pemberi jasa)
 * @returns Jarak dalam satuan kilometer (km), dibulatkan 2 angka di belakang koma
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const EARTH_RADIUS_KM = 6371; // Radius rata-rata bumi dalam km

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const radLat1 = toRadians(lat1);
  const radLat2 = toRadians(lat2);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = EARTH_RADIUS_KM * c;

  return Math.round(distance * 100) / 100;
}
