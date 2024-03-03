import axios from "axios";
import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';

// Unclear why pulling from google-processor wipes endpoint address
const GOOGLE_GEOCODING_ENDPOINT =
  "https://maps.googleapis.com/maps/api/geocode/json";

// Initialize a cache for memoization
const geocodeCache = {};

async function importClientsFromOneCSV(filePath: string) {
  const rows = []; // Initialize rows array to collect client data
  const stream = fs.createReadStream(filePath).pipe(csv());
  const promises = []; // Collect promises for asynchronous operations

  await new Promise<void>((resolve, reject) => {
    stream.on('data', (row) => {
      // Wrap the asynchronous part in a function to call it immediately
      const promise = (async () => {
        const contactInfo = row["Contact Related"];
        const emailRegex = /\S+@\S+\.\S+/;
        const phoneRegex = /(?:\d{1}\s)?\(?(\d{3})\)?[\s.-]?(\d{3})[\s.-]?(\d{4})/;
        const emailMatch = contactInfo.match(emailRegex);
        const phoneMatch = contactInfo.match(phoneRegex);
        const email = emailMatch ? emailMatch[0] : '';
        var phone = phoneMatch ? `${phoneMatch[1]}-${phoneMatch[2]}-${phoneMatch[3]}` : '';
        var name = row["Reference to Customer"]

        if (!phone && /^\d{10}$/.test(row["Reference to Customer"].replace(/\D/g, ''))) {
          phone = row["Reference to Customer"];
          name = row["Delivery Type"]
        }

        // should probably memo this
        const geocode_this_address = `${row.Address} Detroit, MI`;
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
            }
          } catch (error) {
            console.error('Failed to geocode address:', geocode_this_address, error);
          }
        }

        const cachedData = geocodeCache[geocode_this_address];
        if (cachedData) {
          // Push client data to rows array
          rows.push({
            name: name,
            address: cachedData.full_address,
            email: email,
            phone: phone,
            prep_time: 5,
            service_time: 5,
            priority: 1,
            time_start: "09:00",
            time_end: "17:00",
            lat: cachedData.lat,
            lon: cachedData.lon,
            order: row['Delivery Type Field'],
            notes: "We copied this from"+ " " + row['Reference field'] + " " + row['Address field'] + " " + row['Contact Related field'] + " " + row['Source file'] + " " + row['Source Sheet']
          });
        }
      })();

      promises.push(promise); // Collect each promise
    }).on('end', () => {
      Promise.all(promises).then(() => resolve()).catch(reject); // Wait for all promises
    }).on('error', (error) => {
      reject(error);
    });
  });

  return rows; // Return the collected rows after processing all CSV data
}

export async function importClientsFromAllCSV(seedName: string) {
  const directoryPath = path.join(__dirname, `../../../../prisma/seeds/${seedName}`);
  const files = fs.readdirSync(directoryPath).filter(file => file.endsWith('.csv'));
  
  if (files.length > 0) {
    const clients = await importClientsFromOneCSV(
      path.join(directoryPath, files[0])
    );

    return clients
  }

  return null;
}

