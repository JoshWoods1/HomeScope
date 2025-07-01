// src/app/api/places/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { categoryMappings } from '@/utils/landMarkCategories';

const GOOGLE_API_KEY = process.env.GOOGLE_GEOCODING_API_KEY;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const category = searchParams.get('category');

  if (!lat || !lng) {
    return NextResponse.json({ error: 'Missing lat or lng' }, { status: 400 });
  }

  if (!category) {
    return NextResponse.json({ error: 'Missing category' }, { status: 400 });
  }

  // Get the mapping for the category
  const categoryMapping = categoryMappings[category];
  if (!categoryMapping) {
    return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
  }

  // Build the URL with either keyword or type
  let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&rankby=distance`;
  
  if (categoryMapping.googleKeyword) {
    url += `&keyword=${encodeURIComponent(categoryMapping.googleKeyword)}`;
  }
  
  url += `&key=${GOOGLE_API_KEY}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(`Google Places API error: ${data.error_message || 'Unknown error'}`);
    }

    return NextResponse.json(data.results || []);
  } catch (error) {
    console.error('Error fetching places:', error);
    return NextResponse.json({ error: 'Failed to fetch places' }, { status: 500 });
  }
}
