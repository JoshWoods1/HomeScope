import { PlaceResult, Landmark } from '@/types/types';

export function convertPlaceResultsToLandmarks(
  places: PlaceResult[],
  userLocation: { lat: number; lng: number },
  category: string
): Landmark[] {
  return places.map((place, i) => {
    const lat = place.geometry?.location.lat;
    const lng = place.geometry?.location.lng;

    const distanceMiles = lat && lng
      ? getDistanceMiles(userLocation.lat, userLocation.lng, lat, lng)
      : 0;

    return {
      id: place.place_id || `${i}`,
      name: place.name || 'Unknown',
      category,
      distanceMiles,
      lat: lat || 0,
      lng: lng || 0,
    };
  });
}

function getDistanceMiles(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 3958.8; // miles
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(2));
}
