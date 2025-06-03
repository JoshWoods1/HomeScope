export const geocodeAddress = async (address: string, apiKey: string) => {
    try {
        const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
        );
    
        if (!response.ok) {
        throw new Error(`Geocoding API error: ${response.statusText}`);
        }
    
        const data = await response.json();
    
        if (data.status !== "OK") {
        throw new Error(`Geocoding failed: ${data.status}`);
        }
    
        const location = data.results[0].geometry.location;
        return {
        lat: location.lat,
        lng: location.lng,
        };
    } catch (error) {
        console.error("Geocoding error:", error);
        return null;
    }
}