// src/app/api/places/route.ts
import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_API_KEY = process.env.GOOGLE_GEOCODING_API_KEY;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  if (!lat || !lng) {
    return NextResponse.json({ error: 'Missing lat or lng' }, { status: 400 });
  }

  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&rankby=distance&keyword=grocery&key=${GOOGLE_API_KEY}`;

  const res = await fetch(url);
  const data = await res.json();

  return NextResponse.json(data.results);
}
