// src/components/LandmarkFilters.tsx

import React from 'react';
import { categories } from '@/utils/landMarkCategories';

interface LandmarkFiltersProps {
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
}

const LandmarkFilters: React.FC<LandmarkFiltersProps> = ({
  selectedCategories,
  setSelectedCategories,
}) => {

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
      {categories.map(category => (
        <label 
          key={category} 
          className={`relative flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 text-sm font-medium ${
            selectedCategories.includes(category)
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
          }`}
        >
          <input
            type="checkbox"
            checked={selectedCategories.includes(category)}
            onChange={() => toggleCategory(category)}
            className="sr-only"
          />
          <span className="text-center leading-tight">{category}</span>
          {selectedCategories.includes(category) && (
            <div className="absolute top-1 right-1 w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
              <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </label>
      ))}
    </div>
  );
};

export default LandmarkFilters;
