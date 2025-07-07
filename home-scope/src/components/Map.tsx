'use client';

import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Landmark } from '@/types/types';

interface MapProps {
  selectedLocation: { lat: number; lng: number } | null; // This is now the map center
  setSelectedLocation: React.Dispatch<React.SetStateAction<{ lat: number; lng: number } | null>>;
  selectedCategories: string[];
  landmarks: Landmark[];
  focusedLandmark: string | null;
  setFocusedLandmark: React.Dispatch<React.SetStateAction<string | null>>;
  searchLocation?: { lat: number; lng: number } | null; // Add original search location
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
  landmarks,
  focusedLandmark,
  setFocusedLandmark,
  searchLocation,
}) => {
  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      setSelectedLocation({
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      });
      setFocusedLandmark(null); // Clear focused landmark when clicking on map
    }
  };

  // Function to get marker color based on category
  const getMarkerIcon = (category: string, isSelected: boolean) => {
    const baseUrl = 'http://maps.google.com/mapfiles/ms/icons/';
    
    if (isSelected) {
      return `${baseUrl}yellow-dot.png`; // Highlighted color for selected landmark
    }
    
    // Different colors for different categories
    switch (category.toLowerCase()) {
      case 'grocery store':
        return `${baseUrl}green-dot.png`;
      case 'gas station':
        return `${baseUrl}blue-dot.png`;
      case 'restaurant':
        return `${baseUrl}orange-dot.png`;
      case 'church':
        return `${baseUrl}purple-dot.png`;
      case 'park':
        return `${baseUrl}ltblue-dot.png`;
      case 'hospital':
        return `${baseUrl}red-dot.png`;
      case 'theater':
        return `${baseUrl}pink-dot.png`;
      case 'entertainment':
        return `${baseUrl}yellow-dot.png`;
      default:
        return `${baseUrl}gray-dot.png`;
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
        {/* Original search location marker */}
        {searchLocation && (
          <Marker 
            position={searchLocation}
            icon={{
              url: 'http://maps.google.com/mapfiles/ms/icons/red-pushpin.png',
              scaledSize: new google.maps.Size(32, 32)
            }}
            title="Your Search Location"
            onClick={() => {
              setSelectedLocation(searchLocation);
              setFocusedLandmark(null);
            }}
          />
        )}
        
        {/* Landmark markers */}
        {landmarks.map((landmark) => (
          <Marker
            key={landmark.id}
            position={{ lat: landmark.lat, lng: landmark.lng }}
            icon={{
              url: getMarkerIcon(landmark.category, landmark.id === focusedLandmark),
              scaledSize: new google.maps.Size(24, 24)
            }}
            title={`${landmark.name} (${landmark.category})`}
            onClick={() => setFocusedLandmark(landmark.id)}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
};

export default Map;
