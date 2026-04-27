import { NextResponse } from "next/server";

const DATA: Record<string, string[]> = {
  "India": [
    "Chennai, Tamil Nadu", "Bengaluru, Karnataka", "Hyderabad, Telangana", 
    "Mumbai, Maharashtra", "Pune, Maharashtra", "Delhi", "Gurgaon, Haryana", 
    "Noida, Uttar Pradesh", "Coimbatore, Tamil Nadu", "Madurai, Tamil Nadu"
  ],
  "USA": [
    "New York, NY", "San Francisco, CA", "Seattle, WA", "Austin, TX", 
    "Boston, MA", "Los Angeles, CA", "Chicago, IL", "Denver, CO"
  ],
  "UK": [
    "London", "Manchester", "Birmingham", "Edinburgh", "Leeds"
  ],
  "Canada": [
    "Toronto", "Vancouver", "Montreal", "Ottawa", "Calgary"
  ],
  "Germany": [
    "Berlin", "Munich", "Hamburg", "Frankfurt"
  ],
  "Japan": [
    "Tokyo", "Osaka", "Kyoto", "Yokohama"
  ],
  "Remote": ["Remote Worldwide"]
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type"); // 'countries' or 'cities'
  const country = searchParams.get("country");
  const q = searchParams.get("q")?.toLowerCase() || "";

  if (type === "countries") {
    const countries = Object.keys(DATA).filter(c => c.toLowerCase().includes(q));
    return NextResponse.json(countries);
  }

  if (type === "cities" && country && DATA[country]) {
    const cities = DATA[country].filter(c => c.toLowerCase().includes(q));
    return NextResponse.json(cities);
  }

  return NextResponse.json([]);
}
