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
  focusedLandmark: string | null;
  onLandmarkClick: (landmarkId: string) => void;
}

const LandmarkList: React.FC<LandmarkListProps> = ({
  location,
  categories,
  landmarks,
  focusedLandmark,
  onLandmarkClick,
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
      <h2 className="text-lg font-semibold mb-3">
        {categories.length === 0 
          ? 'Top 10 Closest Places' 
          : categories.length === 1 
          ? `Nearby ${categories[0]}s` 
          : 'Nearby Places'
        }
      </h2>
      <ul className="space-y-2">
        {filtered.map((landmark) => (
          <li 
            key={landmark.id} 
            className={`p-3 border rounded cursor-pointer transition-colors ${
              landmark.id === focusedLandmark 
                ? 'bg-yellow-100 border-yellow-400' 
                : 'bg-white hover:bg-gray-50'
            }`}
            onClick={() => onLandmarkClick(landmark.id)}
          >
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
