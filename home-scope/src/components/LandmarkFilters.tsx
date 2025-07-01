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
    <div className="flex flex-wrap gap-4">
      {categories.map(category => (
        <label key={category} className="inline-flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={selectedCategories.includes(category)}
            onChange={() => toggleCategory(category)}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span>{category}</span>
        </label>
      ))}
    </div>
  );
};

export default LandmarkFilters;
