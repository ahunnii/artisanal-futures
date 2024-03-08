import Bottleneck from "bottleneck";
import axios from "axios";
import fs from 'fs';
import path from 'path';

// Ann Arbor Demo test import

const GOOGLE_GEOCODING_ENDPOINT =
  "https://maps.googleapis.com/maps/api/geocode/json";

let geocodeCache = {};
const geocodeCacheFilePath = path.join(__dirname, 'geocodeCache.json');
let newGeocodesCount = 0;

try {
  if (fs.existsSync(geocodeCacheFilePath)) {
    geocodeCache = JSON.parse(fs.readFileSync(geocodeCacheFilePath, 'utf8'));
  }
} catch (error) {
  console.error('Failed to load geocode cache from disk:', error);
}

interface Customer {
  name: string;
  address: string;
  email: string;
  phone: string;
  prep_time: number;
  service_time: number;
  priority: number;
  time_start: string;
  time_end: string;
  lat: number;
  lon: number;
  order: string;
  notes: string;
}

// Initialize the rate limiter with 1 request per 25 milliseconds
const limiter = new Bottleneck({
  maxConcurrent: 1, // Allows only 1 request to be executing at any time
  minTime: 25, // Time between launches to ensure only 1 request per 25 ms
});
const limitedGeocodeAddress = limiter.wrap(geocodeAddress);
async function geocodeAddress(address: string) {
  const geocode_this_address = `${address}`;
  if (!geocodeCache[geocode_this_address]) {
    const endpointEncodedAddress = `${GOOGLE_GEOCODING_ENDPOINT}?address=${encodeURIComponent(
             geocode_this_address
    )}&key=${process.env.GOOGLE_API_KEY}`;
    
    try {
      const results = await axios.get(endpointEncodedAddress);
      
      if (results.status === 200) {
        let data = results.data.results[0];
        geocodeCache[geocode_this_address] = {
          full_address: data.formatted_address,
          lat: data.geometry.location.lat,
          lon: data.geometry.location.lng
        };
        newGeocodesCount++;
        if (newGeocodesCount >= 10) {
          saveGeocodeCache(); // Save the cache to disk
          newGeocodesCount = 0; // Reset the counter
        }
      }
    } catch (error) {
      console.error('Failed to geocode address:', geocode_this_address, error);
    }
  }

  return geocodeCache[geocode_this_address];
}

function saveGeocodeCache(force = false) {
  console.log('... in geocodecache')

  if (newGeocodesCount >= 10 || force) {
    try {
      fs.writeFileSync(geocodeCacheFilePath, JSON.stringify(geocodeCache, null, 2), 'utf8');
      console.log('Geocode cache saved to disk.');
    } catch (error) {
      console.error('Failed to save geocode cache to disk:', error);
    }
  }
}

export async function importClientsFromAllCSV(seedName: string) {
    const demoStopInformation = [
        {
            name: "Argus Farm Stop",
            address: "1226 Packard St, Ann Arbor, MI 48104",
            email: "dev@null.com",
            phone: "(734) 997-5448",
            order: "Drop off egg cartons, pick up local food",
            notes: "Say hi to the owners"
        },
        {
            name: "Malletts Creek Branch",
            address: "3090 E Eisenhower Pkwy, Ann Arbor, MI 48108",
            email: "ask@aadl.org",
            phone: "(734) 327-4200",
            order: "Pick up gardening book",
            notes: ""
        },
        {
            name: "Mariah Jones",
            address: "3144 Asher Road, Ann Arbor, MI 48104",
            email: "dev@null.com",
            phone: "(313) 240-5678",
            order: "Drop off gardening book, local food from Argus",
            notes: "Last time they mentioned planting tomatoes"
        }                
    ];

    let clients: Customer[] = [];

    for (const stopInfo of demoStopInformation) {
        const geocodedData = await limitedGeocodeAddress(stopInfo.address);
        const client: Customer = {
            name: stopInfo.name,
            address: geocodedData.full_address || stopInfo.address,
            email: stopInfo.email,
            phone: stopInfo.phone,
            prep_time: 5,
            service_time: 5,
            priority: 1,
            time_start: '09:00',
            time_end: '17:00',
            lat: geocodedData.lat || 0,
            lon: geocodedData.lon || 0,
            order: stopInfo.order,
            notes: stopInfo.notes
        };
        clients.push(client);
    }

    return clients;
}
