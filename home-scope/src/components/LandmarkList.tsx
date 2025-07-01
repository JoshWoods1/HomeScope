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
  landmarks: Landmark[];
}

const LandmarkList: React.FC<LandmarkListProps> = ({
  location,
  categories,
  landmarks,
}) => {
  if (!location) {
    return <p className="text-gray-500">Please enter an address to see results.</p>;
  }

  const filtered = categories.length
    ? landmarks.filter((l) => categories.includes(l.category))
    : landmarks;

  if (!filtered.length) {
    return <p className="text-gray-500">No landmarks found nearby.</p>;
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Nearby Grocery Stores</h2>
      <ul className="space-y-2">
        {filtered.map((landmark) => (
          <li key={landmark.id} className="p-3 border rounded bg-white">
            <h3 className="font-medium">{landmark.name}</h3>
            <p className="text-sm text-gray-600">
              {landmark.category} — {landmark.distanceMiles} mi
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LandmarkList;
