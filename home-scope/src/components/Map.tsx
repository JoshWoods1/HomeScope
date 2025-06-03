'use client';

import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

interface MapProps {
  selectedLocation: { lat: number; lng: number } | null;
  setSelectedLocation: React.Dispatch<React.SetStateAction<{ lat: number; lng: number } | null>>;
  selectedCategories: string[];
}

const containerStyle = {
  width: '100%',
  height: '400px',
};

const defaultCenter = {
  lat: 43.8231,
  lng: -111.7908, // Rexburg, ID
};

const Map: React.FC<MapProps> = ({
  selectedLocation,
  setSelectedLocation,
}) => {
  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      setSelectedLocation({
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      });
    }
  };

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={selectedLocation || defaultCenter}
        zoom={12}
        onClick={handleMapClick}
      >
        {selectedLocation && <Marker position={selectedLocation} />}
        {/* TODO: Add landmark markers here */}
      </GoogleMap>
    </LoadScript>
  );
};

export default Map;
