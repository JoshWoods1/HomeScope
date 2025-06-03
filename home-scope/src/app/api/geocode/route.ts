// src/app/api/geocode/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get('address');

  if (!address) {
    return NextResponse.json({ error: 'Missing address' }, { status: 400 });
  }

  const apiKey = process.env.GOOGLE_GEOCODING_API_KEY;
  const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

  const response = await fetch(geocodeUrl);
  const data = await response.json();

  if (data.status !== 'OK') {
    return NextResponse.json({ error: data.error_message || 'Geocoding failed' }, { status: 500 });
  }
  // console.log(data.results[0]?.geometry.location)
  return NextResponse.json(data.results[0]?.geometry.location);
}
