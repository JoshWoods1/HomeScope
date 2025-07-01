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
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [address, setAddress] = useState("");
  const [landmarks, setLandmarks] = useState<Landmark[]>([]); // updated type

  useEffect(() => {
    const fetchNearbyPlaces = async () => {
      if (!selectedLocation) {
        setLandmarks([]);
        return;
      }

      try {
        // If no categories selected, fetch top 10 closest places of any type
        if (selectedCategories.length === 0) {
          const res = await fetch(
            `/api/nearby?lat=${selectedLocation.lat}&lng=${selectedLocation.lng}`
          );
          
          if (res.ok) {
            const data: PlaceResult[] = await res.json();
            const landmarks = data.map((place, i) => {
              const lat = place.geometry?.location.lat;
              const lng = place.geometry?.location.lng;
              
              const distanceMiles = lat && lng
                ? getDistanceMiles(selectedLocation.lat, selectedLocation.lng, lat, lng)
                : 0;
              
              return {
                id: place.place_id || `${i}`,
                name: place.name || 'Unknown',
                category: detectCategory(place),
                distanceMiles,
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
            `/api/places?lat=${selectedLocation.lat}&lng=${selectedLocation.lng}&category=${encodeURIComponent(category)}`
          );
          
          if (res.ok) {
            const data: PlaceResult[] = await res.json();
            return convertPlaceResultsToLandmarks(
              data,
              selectedLocation,
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
  }, [selectedLocation, selectedCategories]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-300 text-gray-800 font-sans">
      {/* Header */}
      <header className="px-6 py-4 border-b border-gray-200 text-center">
        <h1 className="text-2xl font-medium tracking-tight">HomeScope</h1>
      </header>

      {/* Controls */}
      <section className="px-4 py-6 border-b border-gray-100">
        <div className="max-w-xl mx-auto space-y-4">
          <input
            type="text"
            placeholder="Enter address or coordinates (lat,lng)"
            className="w-full p-2 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
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
                    setSelectedLocation({
                      lat: parseFloat(data.lat),
                      lng: parseFloat(data.lng),
                    });
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

          <LandmarkFilters
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
          />
        </div>
      </section>

      {/* Main content - Map + Landmark List */}
      <main className="flex flex-col md:flex-row flex-grow">
        {/* Map */}
        <div className="flex-1 min-h-[400px]">
          <Map
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
            selectedCategories={selectedCategories}
          />
        </div>

        {/* Landmark List */}
        <aside className="md:w-1/3 border-t md:border-t-0 md:border-l border-gray-200 p-4 overflow-auto max-h-[400px] bg-gray-50">
          <LandmarkList
            location={selectedLocation}
            categories={selectedCategories}
            landmarks={landmarks}
          />
        </aside>
      </main>

      {/* Footer */}
      <footer className="px-4 py-4 border-t border-gray-200 text-center text-sm text-gray-500">
        &copy; 2025 Josh Woods — HomeScope
      </footer>
    </div>
  );
}
