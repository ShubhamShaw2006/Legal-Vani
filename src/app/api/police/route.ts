import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { lat, lng } = await req.json();

    if (!lat || !lng) {
      return NextResponse.json({ error: "Latitude and Longitude required" }, { status: 400 });
    }

    // Overpass API Query: Finds 'amenity=police' within roughly 15000 meters of the coordinates
    const overpassQuery = `
      [out:json];
      node
        ["amenity"="police"]
        (around:15000, ${lat}, ${lng});
      out body;
    `;

    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: overpassQuery,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "LegalVani-App/1.0 (legalvani@example.com)"
      }
    });

    if (!response.ok) {
      throw new Error("Overpass API responded with an error");
    }

    const data = await response.json();
    
    // Process and sort results by rudimentary distance calculation (Pythagorean on lat/lng is okay for small radius)
    const stations = data.elements.map((el: any) => {
      const dLat = el.lat - lat;
      const dLng = el.lon - lng;
      const distSq = (dLat * dLat) + (dLng * dLng);
      return {
        id: el.id,
        name: el.tags.name || "Police Station",
        lat: el.lat,
        lng: el.lon,
        distanceApprox: distSq
      };
    }).sort((a: any, b: any) => a.distanceApprox - b.distanceApprox).slice(0, 3); // Get closest 3

    return NextResponse.json({ success: true, stations });

  } catch (error) {
    console.error("Police Locator API Error:", error);
    return NextResponse.json({ error: "Failed to locate police stations" }, { status: 500 });
  }
}
