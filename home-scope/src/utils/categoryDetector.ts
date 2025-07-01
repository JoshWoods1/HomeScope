// src/utils/categoryDetector.ts
import { PlaceResult } from '@/types/types';

// Function to determine category based on Google Places types
export function detectCategory(place: PlaceResult): string {
  const types = place.types || [];
  
  // Priority order for category detection
  if (types.includes('grocery_or_supermarket') || types.includes('supermarket')) {
    return 'Grocery Store';
  }
  
  if (types.includes('gas_station')) {
    return 'Gas Station';
  }
  
  if (types.includes('restaurant') || types.includes('meal_takeaway') || types.includes('food')) {
    return 'Restaurant';
  }
  
  if (types.includes('place_of_worship') || types.includes('church')) {
    return 'Church';
  }
  
  if (types.includes('park') || types.includes('rv_park') || types.includes('amusement_park')) {
    return 'Park';
  }
  
  if (types.includes('hospital') || types.includes('doctor') || types.includes('pharmacy')) {
    return 'Healthcare';
  }
  
  if (types.includes('bank') || types.includes('atm')) {
    return 'Banking';
  }
  
  if (types.includes('school') || types.includes('university')) {
    return 'Education';
  }
  
  if (types.includes('shopping_mall') || types.includes('clothing_store') || types.includes('store')) {
    return 'Shopping';
  }
  
  // Default to the first type if no specific category matches
  return types.length > 0 ? types[0].replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Other';
}
