import React from 'react';

interface Landmark {
  id: string;
  name: string;
  category: string;
  distanceMiles: number;
  lat: number;
  lng: number;
}

interface LandmarkListProps {
  location: { lat: number; lng: number } | null;
  categories: string[];
  landmarks: Landmark[];
  focusedLandmark: string | null;
  onLandmarkClick: (landmarkId: string) => void;
}

// Category icons mapping
const getCategoryIcon = (category: string) => {
  const iconMap: { [key: string]: string } = {
    'Grocery Store': '🛒',
    'Gas Station': '⛽',
    'Restaurant': '🍽️',
    'Church': '⛪',
    'Park': '🌳',
    'Hospital': '🏥',
    'Theater': '🎭',
    'Entertainment': '🎢',
  };
  
  return iconMap[category] || '📍';
};

const LandmarkList: React.FC<LandmarkListProps> = ({
  location,
  categories,
  landmarks,
  focusedLandmark,
  onLandmarkClick,
}) => {
  if (!location) {
    return (
      <div className="p-6 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Find Places Near You</h3>
        <p className="text-gray-500">Enter an address to see nearby places and services.</p>
      </div>
    );
  }

  const filtered = categories.length
    ? landmarks.filter((l) => categories.includes(l.category))
    : landmarks;

  if (!filtered.length) {
    return (
      <div className="p-6 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 11.291A7.962 7.962 0 0112 9c-2.34 0-4.29 1.009-5.824 2.709M15 8.291A7.962 7.962 0 0112 6c-2.34 0-4.29 1.009-5.824 2.709" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Places Found</h3>
        <p className="text-gray-500">Try adjusting your search or category filters.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900 mb-1">
          {categories.length === 0 
            ? 'Top 10 Closest Places' 
            : categories.length === 1 
            ? `Nearby ${categories[0]}s` 
            : 'Nearby Places'
          }
        </h2>
        <p className="text-sm text-gray-500">{filtered.length} places found</p>
      </div>
      
      <div className="space-y-2">
        {filtered.map((landmark) => (
          <div
            key={landmark.id} 
            className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
              landmark.id === focusedLandmark 
                ? 'border-blue-500 bg-blue-50 shadow-md' 
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
            }`}
            onClick={() => onLandmarkClick(landmark.id)}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 text-2xl">
                {getCategoryIcon(landmark.category)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 mb-1 leading-tight">
                  {landmark.name}
                </h3>
                <div className="flex items-center text-sm text-gray-600 space-x-2">
                  <span className="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium">
                    {landmark.category}
                  </span>
                  <span>•</span>
                  <span className="font-medium">{landmark.distanceMiles} mi</span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LandmarkList;
