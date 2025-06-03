// src/components/LandmarkList.tsx

import React from 'react';

interface Landmark {
  id: string;
  name: string;
  category: string;
  distanceMiles: number;
}

interface LandmarkListProps {
  location: { lat: number; lng: number } | null;
  categories: string[];
  landmarks?: Landmark[]; // You’ll replace with your actual data fetching
}

const dummyLandmarks: Landmark[] = [
  { id: '1', name: 'Fresh Market', category: 'Grocery Store', distanceMiles: 1.2 },
  { id: '2', name: 'Main St Gas', category: 'Gas Station', distanceMiles: 0.5 },
  { id: '3', name: 'St. Mary Church', category: 'Church', distanceMiles: 2.3 },
  { id: '4', name: 'Central Park', category: 'Park', distanceMiles: 1.0 },
];

const LandmarkList: React.FC<LandmarkListProps> = ({ location, categories, landmarks = dummyLandmarks }) => {
  if (!location) {
    return <p className="text-gray-500">Please select a location to see nearby landmarks.</p>;
  }

  // Filter landmarks based on selected categories
  const filtered = categories.length > 0
    ? landmarks.filter(l => categories.includes(l.category))
    : landmarks;

  if (filtered.length === 0) {
    return <p className="text-gray-500">No landmarks found for the selected categories.</p>;
  }

  return (
    <ul className="space-y-3">
      {filtered.map(landmark => (
        <li key={landmark.id} className="border-b pb-2">
          <div className="font-semibold">{landmark.name}</div>
          <div className="text-sm text-gray-600">
            {landmark.category} - {landmark.distanceMiles.toFixed(1)} miles away
          </div>
        </li>
      ))}
    </ul>
  );
};

export default LandmarkList;
