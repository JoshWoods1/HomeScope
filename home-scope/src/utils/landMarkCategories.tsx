// src/utils/landMarkCategories.tsx

export interface CategoryMapping {
  displayName: string;
  googleKeyword?: string;
  googleType?: string;
}

// Mapping between display categories and Google Places API parameters
export const categoryMappings: Record<string, CategoryMapping> = {
  'Grocery Store': {
    displayName: 'Grocery Store',
    googleKeyword: 'grocery',
    googleType: 'grocery_or_supermarket'
  },
  'Gas Station': {
    displayName: 'Gas Station',
    googleKeyword: 'gas station',
    googleType: 'gas_station'
  },
  'Church': {
    displayName: 'Church',
    googleKeyword: 'church',
    googleType: 'place_of_worship'
  },
  'Park': {
    displayName: 'Park',
    googleKeyword: 'park',
    googleType: 'park'
  },
  'Restaurant': {
    displayName: 'Restaurant',
    googleKeyword: 'restaurant',
    googleType: 'restaurant'
  },
  'Hospital': {
    displayName: 'Hospital',
    googleKeyword: 'hospital',
    googleType: 'hospital'
  },
  'Theater': {
    displayName: 'Theater',
    googleKeyword: 'movie theater',
    googleType: 'movie_theater'
  },
  'Entertainment': {
    displayName: 'Entertainment',
    googleKeyword: 'entertainment',
    googleType: 'amusement_park'
  }
};

export const categories = Object.keys(categoryMappings);
