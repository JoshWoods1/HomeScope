"use client";

import React, { useEffect, useState } from "react";
import Map from "../components/Map";
import LandmarkFilters from "../components/LandmarkFilters";
import LandmarkList from "../components/LandmarkList";
import { PlaceResult } from "@/types/types";
import { Landmark } from "@/types/types";
import { convertPlaceResultsToLandmarks } from "@/utils/convertPlaceResults";
import { detectCategory } from "@/utils/categoryDetector";

// Distance calculation function
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

export default function HomePage() {
  const [searchLocation, setSearchLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null); // The original searched location
  const [mapCenter, setMapCenter] = useState<{
    lat: number;
    lng: number;
  } | null>(null); // The current map center (can change when clicking landmarks)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [address, setAddress] = useState("");
  const [landmarks, setLandmarks] = useState<Landmark[]>([]); // updated type
  const [focusedLandmark, setFocusedLandmark] = useState<string | null>(null);

  // Function to handle landmark click and center map
  const handleLandmarkClick = (landmarkId: string) => {
    setFocusedLandmark(landmarkId);
    
    // Find the landmark and center map on it (but don't change search location)
    const landmark = landmarks.find(l => l.id === landmarkId);
    if (landmark) {
      setMapCenter({ lat: landmark.lat, lng: landmark.lng });
    }
  };

  useEffect(() => {
    const fetchNearbyPlaces = async () => {
      if (!searchLocation) {
        setLandmarks([]);
        return;
      }

      // Clear focused landmark when location changes
      setFocusedLandmark(null);

      try {
        // If no categories selected, fetch top 10 closest places of any type
        if (selectedCategories.length === 0) {
          const res = await fetch(
            `/api/nearby?lat=${searchLocation.lat}&lng=${searchLocation.lng}`
          );
          
          if (res.ok) {
            const data: PlaceResult[] = await res.json();
            const landmarks = data.map((place, i) => {
              const lat = place.geometry?.location.lat;
              const lng = place.geometry?.location.lng;
              
              const distanceMiles = lat && lng
                ? getDistanceMiles(searchLocation.lat, searchLocation.lng, lat, lng)
                : 0;
              
              return {
                id: place.place_id || `${i}`,
                name: place.name || 'Unknown',
                category: detectCategory(place),
                distanceMiles,
                lat: lat || 0,
                lng: lng || 0,
              };
            });
            
            setLandmarks(landmarks);
          } else {
            console.error('Failed to fetch nearby places', await res.json());
          }
          return;
        }

        // If categories are selected, fetch places for each selected category
        const promises = selectedCategories.map(async (category) => {
          const res = await fetch(
            `/api/places?lat=${searchLocation.lat}&lng=${searchLocation.lng}&category=${encodeURIComponent(category)}`
          );
          
          if (res.ok) {
            const data: PlaceResult[] = await res.json();
            return convertPlaceResultsToLandmarks(
              data,
              searchLocation,
              category
            );
          } else {
            console.error(`Failed to fetch ${category}`, await res.json());
            return [];
          }
        });

        const results = await Promise.all(promises);
        const allLandmarks = results.flat();
        
        // Deduplicate by place_id and combine categories
        const landmarkMap: { [key: string]: Landmark } = {};
        
        allLandmarks.forEach(landmark => {
          const existingLandmark = landmarkMap[landmark.id];
          if (existingLandmark) {
            // If landmark already exists, combine categories
            if (!existingLandmark.category.includes(landmark.category)) {
              existingLandmark.category = `${existingLandmark.category}, ${landmark.category}`;
            }
          } else {
            landmarkMap[landmark.id] = { ...landmark };
          }
        });
        
        // Convert back to array and sort by distance
        const uniqueLandmarks: Landmark[] = Object.values(landmarkMap);
        uniqueLandmarks.sort((a, b) => a.distanceMiles - b.distanceMiles);
        
        setLandmarks(uniqueLandmarks);
      } catch (err) {
        console.error("Error fetching places", err);
      }
    };

    fetchNearbyPlaces();
  }, [searchLocation, selectedCategories]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">HomeScope</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Controls */}
      <section className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Search Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Enter address or coordinates (lat,lng)"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 shadow-sm"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                onKeyDown={async (e) => {
                  if (e.key === "Enter" && address.trim()) {
                    try {
                      const res = await fetch(
                        `/api/geocode?address=${encodeURIComponent(address)}`
                      );
                      const data = await res.json();

                      if (res.ok && data.lat && data.lng) {
                        const newLocation = {
                          lat: parseFloat(data.lat),
                          lng: parseFloat(data.lng),
                        };
                        setSearchLocation(newLocation);
                        setMapCenter(newLocation); // Also center the map on the new search location
                      } else {
                        alert(`Error: ${data.error}`);
                      }
                    } catch (error) {
                      console.error("Geocoding request failed", error);
                      alert("Geocoding request failed.");
                    }
                  }
                }}
              />
            </div>

            {/* Category Filters */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Filter by Category</h3>
              <LandmarkFilters
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
              />
            </div>
            
            {/* Back to search location button */}
            {searchLocation && mapCenter && 
             (searchLocation.lat !== mapCenter.lat || searchLocation.lng !== mapCenter.lng) && (
              <button
                onClick={() => {
                  setMapCenter(searchLocation);
                  setFocusedLandmark(null);
                }}
                className="w-full p-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 text-sm font-medium shadow-sm flex items-center justify-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
                <span>Return to Search Location</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Main content - Map + Landmark List */}
      <main className="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 gap-6">
        {/* Map */}
        <div className="flex-1 bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="h-[600px] w-full">
            <Map
              selectedLocation={mapCenter}
              setSelectedLocation={setMapCenter}
              selectedCategories={selectedCategories}
              landmarks={landmarks}
              focusedLandmark={focusedLandmark}
              setFocusedLandmark={setFocusedLandmark}
              searchLocation={searchLocation}
            />
          </div>
        </div>

        {/* Landmark List */}
        <aside className="lg:w-96 bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col">
          <div className="h-[600px] overflow-y-auto">
            <LandmarkList
              location={searchLocation}
              categories={selectedCategories}
              landmarks={landmarks}
              focusedLandmark={focusedLandmark}
              onLandmarkClick={handleLandmarkClick}
            />
          </div>
        </aside>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-gray-500">
            &copy; 2025 Josh Woods — HomeScope
          </p>
        </div>
      </footer>
    </div>
  );
}
