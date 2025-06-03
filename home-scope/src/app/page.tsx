"use client";

import React, { useState } from "react";
import Map from "../components/Map";
import LandmarkFilters from "../components/LandmarkFilters";
import LandmarkList from "../components/LandmarkList";

export default function HomePage() {
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [address, setAddress] = useState("");

  return (
    <div className="flex flex-col min-h-screen bg-gray-300 text-gray-800 font-sans">
      {/* Header */}
      <header className="px-6 py-4 border-b border-gray-200 text-center">
        <h1 className="text-2xl font-medium tracking-tight">
          Landmark Distance Finder
        </h1>
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
          />
        </aside>
      </main>

      {/* Footer */}
      <footer className="px-4 py-4 border-t border-gray-200 text-center text-sm text-gray-500">
        &copy; 2025 Josh Woods — Landmark Distance Finder
      </footer>
    </div>
  );
}
