import { MAPBOX_ACCESS_TOKEN } from '../config/mapbox';

const POPULAR_LOCATIONS = [
  { name: 'Visakhapatnam (RTC Complex)', place_name: 'RTC Complex, Dwaraka Nagar, Visakhapatnam', lat: 17.7231, lng: 83.3012 },
  { name: 'Maddilapalem Bus Station', place_name: 'Maddilapalem Bus Station, Visakhapatnam', lat: 17.7340, lng: 83.3175 },
  { name: 'NAD Junction', place_name: 'NAD Flyover Junction, Gopalapatnam, Visakhapatnam', lat: 17.7490, lng: 83.2450 },
  { name: 'Gajuwaka Bus Depot', place_name: 'Gajuwaka Bus Station, Visakhapatnam', lat: 17.6900, lng: 83.2100 },
  { name: 'Anakapalle Bus Station', place_name: 'NTR Bus Station, Anakapalle', lat: 17.6895, lng: 83.0024 },
  { name: 'Pendurthi', place_name: 'Pendurthi Railway Station Road, Visakhapatnam', lat: 17.7950, lng: 83.2050 },
  { name: 'Vizianagaram Bus Stand', place_name: 'RTC Complex, Vizianagaram', lat: 18.1130, lng: 83.4020 },
  { name: 'Srikakulam Complex', place_name: 'RTC Bus Stand, Srikakulam', lat: 18.2970, lng: 83.8960 },
  { name: 'Vijayawada Pandit Nehru Bus Station', place_name: 'PNBS, Vijayawada', lat: 16.5062, lng: 80.6480 },
  { name: 'Guntur Bus Stand', place_name: 'NTR Bus Station, Guntur', lat: 16.3067, lng: 80.4365 },
  { name: 'Tirupati Central Bus Station', place_name: 'APSRTC Bus Station, Tirupati', lat: 13.6288, lng: 79.4192 },
  { name: 'Hyderabad MGBS', place_name: 'Mahatma Gandhi Bus Station, Hyderabad', lat: 17.3780, lng: 78.4800 }
];

export async function fetchPlaceSuggestions(query) {
  if (!query || query.trim().length === 0) return [];

  const cleanQuery = query.trim().toLowerCase();

  // Local filter matching exact typed spelling - startsWith first, then includes
  const startsWithMatches = POPULAR_LOCATIONS.filter((loc) =>
    loc.name.toLowerCase().startsWith(cleanQuery) || loc.place_name.toLowerCase().startsWith(cleanQuery)
  );
  const includesMatches = POPULAR_LOCATIONS.filter((loc) =>
    (loc.name.toLowerCase().includes(cleanQuery) || loc.place_name.toLowerCase().includes(cleanQuery)) &&
    !loc.name.toLowerCase().startsWith(cleanQuery) && !loc.place_name.toLowerCase().startsWith(cleanQuery)
  );

  const localMatches = [...startsWithMatches, ...includesMatches];

  try {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_ACCESS_TOKEN}&autocomplete=true&fuzzyMatch=true&country=IN&proximity=83.3012,17.7231&limit=6`;
    const res = await fetch(url);
    const data = await res.json();

    if (data && data.features) {
      const apiMatches = data.features.map((feat) => ({
        name: feat.text || feat.place_name.split(',')[0],
        place_name: feat.place_name,
        lng: feat.center ? feat.center[0] : 83.3012,
        lat: feat.center ? feat.center[1] : 17.7231
      }));

      // Combine local matches + Mapbox API matches removing duplicates
      const combined = [...localMatches, ...apiMatches];
      
      // Sort combined array so items starting with cleanQuery are at top
      combined.sort((a, b) => {
        const aStarts = a.name.toLowerCase().startsWith(cleanQuery) ? 0 : 1;
        const bStarts = b.name.toLowerCase().startsWith(cleanQuery) ? 0 : 1;
        return aStarts - bStarts;
      });

      const unique = [];
      const seen = new Set();

      for (const item of combined) {
        if (!seen.has(item.name.toLowerCase())) {
          seen.add(item.name.toLowerCase());
          unique.push(item);
        }
      }

      return unique.slice(0, 6);
    }
  } catch (e) {
    console.log('Mapbox Geocoding API fallback to local search');
  }

  return localMatches;
}
