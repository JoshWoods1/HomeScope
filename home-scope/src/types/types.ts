export interface PlaceResult {
  types: never[];
  place_id: string;
  name: string;
  vicinity: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

export interface Landmark {
  id: string;
  name: string;
  category: string;
  distanceMiles: number;
}