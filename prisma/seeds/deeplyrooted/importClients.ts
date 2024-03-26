import axios from "axios";
import Bottleneck from "bottleneck";
import { parse } from "csv-parse/sync";
import csv from "csv-parser";
import fs from "fs";
import path from "path";
// import { fileURLToPath } from 'url'; // For TS DEBUG
// import { dirname } from 'path'; // For TS DEBUG

// // For TS DEBUG
// //
// // need to export GOOGLE_API_KEY FIRST, then uncomment other
// // For TS DEBUG dir paths (Next js runs from a different place)
// //
// // and then run within this seed directory
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

const GOOGLE_GEOCODING_ENDPOINT =
  "https://maps.googleapis.com/maps/api/geocode/json";

let geocodeCache = {};
const geocodeCacheFilePath = path.join(process.cwd(), "geocodeCache.json");
let newGeocodesCount = 0;

try {
  if (fs.existsSync(geocodeCacheFilePath)) {
    geocodeCache = JSON.parse(fs.readFileSync(geocodeCacheFilePath, "utf8"));
  }
} catch (error) {
  console.error("Failed to load geocode cache from disk:", error);
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

function importClientsFromPackList(filePath: string): Customer[] {
  const fileContent = fs.readFileSync(filePath, "utf-8");

  const csvBlocks = constructCsvBlocks(fileContent);

  const customers = parseCsvBlocks(csvBlocks);

  customers.forEach(async (customer) => {
    await geocodeAddress(customer.address).then((cachedData) => {
      if (cachedData) {
        customer.lat = cachedData.lat;
        customer.lon = cachedData.lon;
        customer.address = cachedData.full_address;
      }
    });
  });

  return customers;
}

const delimiter = ",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,";
// Add delimiter to the start of the file content if not already present
function constructCsvBlocks(fileContent: string): string[] {
  if (!fileContent.startsWith(delimiter)) {
    fileContent = delimiter + "\n" + fileContent;
  }

  // This regex is used to match each customer block in the file content.
  // It looks for the delimiter, followed by any character or newline lazily (*) until it finds the line starting with 'Grand Total'.
  const regex = new RegExp(`(?=${delimiter})(.|\\n)*?^Grand Total.*\\n`, "gm");
  const matches = fileContent.match(regex);

  if (matches) {
    // For each match, remove the delimiter line if it's alone on a line and trim trailing commas and whitespace.
    return matches.map((match) =>
      match
        .replace(new RegExp(`^${delimiter}$`, "gm"), "") // Remove the delimiter if it's alone on a line.
        .replace(/,+$/gm, "") // Remove trailing commas.
        .trim()
    ); // Trim leading and trailing whitespace.
  }

  return [];
}

function parseCsvBlocks(csvBlocks: string[]): Customer[] {
  const customers: Customer[] = [];
  const csvHeader =
    ",Order,Date,Order Status,Payment Status,Payment Method,Product,Vendor,Internal Product ID,# of Items,Quantity,Package Name,Product Subtotal,Product Sales Tax,Order Discount,Store Credit Applied,Fulfillment Fee,Fulfillment Tax,Total,Fulfillment Date,Fulfillment Type,Fulfillment Name,Fulfillment Address,Order Placed Time,Order Note,Backoffice Product Tags,Fulfillment Street Address,Fulfillment City,Fulfillment State,Fulfillment ZIP Code,Fulfillment Country,Payment Fee,Payment Fee Amount,Payment Fee Tax";

  for (const block of csvBlocks) {
    const rows = block.trim().split("\n");
    let nameRow = rows[0].trim();
    if ((nameRow.match(/,/g) || []).length > 5) {
      const match = nameRow.match(/,(\d+),/);
      nameRow = match ? match[1] : nameRow;
    }
    const contactRowRegex = {
      phone: /\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/,
      email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/,
    };
    const contactRows = rows.slice(1, 3).map((row) => row.trim());
    const phoneRow =
      contactRows.find((row) => contactRowRegex.phone.test(row)) || "";
    const emailRow =
      contactRows.find((row) => contactRowRegex.email.test(row)) || "";
    const headerRow = rows.find((row) =>
      row.startsWith(",Order,Date,Order Status,")
    );
    const headerRowIndex = rows.findIndex((row) =>
      row.startsWith(",Order,Date,Order Status,")
    );
    const dataRows = parse(rows.slice(headerRowIndex + 1).join("\n"), {
      columns: csvHeader.split(","),
      skip_empty_lines: true,
      trim: true,
    });

    const customer: Customer = {
      name: nameRow,
      address: "",
      email: emailRow,
      phone: phoneRow,
      prep_time: 5,
      service_time: 5,
      priority: 1,
      time_start: "09:00",
      time_end: "17:00",
      lat: 0, // Placeholder value, should be filled from geoCode cachedData lookup
      lon: 0, // Placeholder value, should be filled from geoCode cachedData lookup
      order: "",
      notes: "",
    };

    for (const row of dataRows) {
      const orderStatus = row["Order Status"];
      const paymentStatus = row["Payment Status"];
      const paymentMethod = row["Payment Method"];
      const product = row["Product"];
      const fulfillmentType = row["Fulfillment Type"];
      const fulfillmentName = row["Fulfillment Name"];
      const fulfillmentAddress = row["Fulfillment Address"];
      const orderNote = row["Order Note"];

      if (orderStatus && paymentStatus && product) {
        customer.order += customer.order
          ? ` | Status: ${orderStatus}, Payment Status: ${paymentStatus}, Product: ${product}`
          : `Status: ${orderStatus}, Payment Status: ${paymentStatus}, Product: ${product}`;
      }

      if (fulfillmentType && fulfillmentName) {
        customer.notes += customer.notes
          ? ` | Order Note: ${orderNote}, Payment Method: ${paymentMethod}, type: ${fulfillmentType}, Fulfillment Name: ${fulfillmentName}`
          : `Order Note: ${orderNote}, Payment Method: ${paymentMethod}, type: ${fulfillmentType}, Fulfillment Name: ${fulfillmentName}`;
      }

      if (fulfillmentAddress && customer.address !== fulfillmentAddress) {
        customer.address += customer.address
          ? ` | ${fulfillmentAddress}`
          : fulfillmentAddress;
      }
    }

    customer.address = limitedGeocodeAddress(
      customer.address + " Detroit, MI "
    );
    customers.push(customer);
  }

  return customers;
}

async function importClientsFromConsolidatedCSV(filePath: string) {
  const rows = [];
  const stream = fs.createReadStream(filePath).pipe(csv());
  const promises = [];

  console.log("... in from consolidated!");

  await new Promise<void>((resolve, reject) => {
    stream
      .on("data", (row) => {
        const promise = (async () => {
          const contactInfo = row["Contact Related"];
          const emailRegex = /\S+@\S+\.\S+/;
          const phoneRegex =
            /(?:\d{1}\s)?\(?(\d{3})\)?[\s.-]?(\d{3})[\s.-]?(\d{4})/;
          const emailMatch = contactInfo.match(emailRegex);
          const phoneMatch = contactInfo.match(phoneRegex);
          const email = emailMatch ? emailMatch[0] : "";
          var phone = phoneMatch
            ? `${phoneMatch[1]}-${phoneMatch[2]}-${phoneMatch[3]}`
            : "";
          var name = row["Reference to Customer"];

          if (
            !phone &&
            /^\d{10}$/.test(row["Reference to Customer"].replace(/\D/g, ""))
          ) {
            phone = row["Reference to Customer"];
            name = row["Delivery Type"];
          }

          const geocode_this_address = `${row.Address} Detroit, MI`;
          await limitedGeocodeAddress(geocode_this_address).then(
            (cachedData) => {
              if (cachedData) {
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
                  order: row["Delivery Type Field"],
                  notes:
                    "We copied this from" +
                    " " +
                    row["Reference field"] +
                    " " +
                    row["Address field"] +
                    " " +
                    row["Contact Related field"] +
                    " " +
                    row["Source file"] +
                    " " +
                    row["Source Sheet"],
                });
              }
            }
          );
        })();
        promises.push(promise);
      })
      .on("end", () => {
        Promise.all(promises)
          .then(() => {
            saveGeocodeCache(true); // Ensure the cache is saved at the end, regardless of count
            resolve();
          })
          .catch(reject);
      })
      .on("error", (error) => {
        reject(error);
      });
  });

  return rows;
}

// Initialize the rate limiter with 1 request per 25 milliseconds
const limiter = new Bottleneck({
  maxConcurrent: 1, // Allows only 1 request to be executing at any time
  minTime: 25, // Time between launches to ensure only 1 request per 25 ms
});
const limitedGeocodeAddress = limiter.wrap(geocodeAddress);
async function geocodeAddress(address: string) {
  const geocode_this_address = `${address} Detroit, MI`;
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
          lon: data.geometry.location.lng,
        };
        newGeocodesCount++;
        if (newGeocodesCount >= 10) {
          saveGeocodeCache(); // Save the cache to disk
          newGeocodesCount = 0; // Reset the counter
        }
      }
    } catch (error) {
      console.error("Failed to geocode address:", geocode_this_address, error);
    }
  }

  return geocodeCache[geocode_this_address];
}

function saveGeocodeCache(force = false) {
  console.log("... in geocodecache");

  if (newGeocodesCount >= 10 || force) {
    try {
      fs.writeFileSync(
        geocodeCacheFilePath,
        JSON.stringify(geocodeCache, null, 2),
        "utf8"
      );
      console.log("Geocode cache saved to disk.");
    } catch (error) {
      console.error("Failed to save geocode cache to disk:", error);
    }
  }
}

export async function importClientsFromAllCSV(seedName: string) {
  const directoryPath = path.join(process.cwd(), `prisma/seeds/${seedName}`); // __dirname; // FOR TS DEBUG
  const files = fs
    .readdirSync(directoryPath)
    .filter((file) => file.endsWith(".csv")); // FOR TS DEBUG ?fs.readdirSync(directoryPath);

  const consolidatedFiles = files.filter(
    (file) => file.includes("Consolidated") && file.endsWith(".csv")
  );
  const packListFiles = files.filter(
    (file) => file.includes("packlist") && file.endsWith(".csv")
  );

  let clients: unknown[] = [];
  if (consolidatedFiles.length > 0) {
    for (const file of consolidatedFiles) {
      const result = await importClientsFromConsolidatedCSV(
        path.join(directoryPath, file)
      );
      clients = clients.concat(result);
    }
  }

  if (packListFiles.length > 0) {
    for (const file of packListFiles) {
      const result = importClientsFromPackList(path.join(directoryPath, file));
      clients = clients.concat(result);
    }
  }

  return clients;
}

// // FOR TS DEBUG
// // Main function to detect command line execution and call importClientsFromAllCSV
// async function main() {
//   const seedName = 'deeplyrooted';
//   const results = await importClientsFromAllCSV(seedName);
//   console.log(results, "< results");
// }

// main();
