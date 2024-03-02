import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';
import {v4 as uuidv4} from 'uuid';

async function importClientsFromOneCSV(filePath: string) {

    const parentDirName = path.basename(path.dirname(__dirname));

    const results = [];
  
    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv(['referenceToCustomer', 'address', 'contactRelated', 'deliveryType', 'deliveryTypeField', 'referenceField', 'addressField', 'contactRelatedField', 'sourceFile', 'sourceSheet']))
        .on('data', (data) => results.push(data))
        .on('end', () => {
          const clients = [];
          for (const item of results) {
            // Initialize email and phone as empty strings
            let email = '';
            let phone = '';
    
            // Regular expression for identifying email and phone
            const emailRegex = /\S+@\S+\.\S+/;
            const phoneRegex = /(?:\+?\d{1,3}[\s-]?)?(?:\(\d{3}\)|\d{3})[\s-]?\d{3}[\s-]?\d{4}/; // Adjust regex as needed
    
            // Split the contactRelated field by non-email characters, assuming space as a common separator
            const contactParts = item.contactRelated.split(/\s+/);
    
            // Attempt to identify email and phone number
            contactParts.forEach(part => {
              if (emailRegex.test(part) && !email) {
                email = part;
              } else if (phoneRegex.test(part) && !phone) {
                phone = part;
              }
            });

            // Construct client object for each item
            const client = {
              id: uuidv4(),
              referenceToCustomer: item.referenceToCustomer,
              address: item.address,
              email: email,
              phone: phone,
              deliveryType: item.deliveryType,
              sourceFile: item.sourceFile,
              sourceSheet: item.sourceSheet
            };
            clients.push(client);
          }
          console.log(`Imported clients from ${path.basename(filePath)}`);
          console.log(clients);
          resolve(clients); // Resolve the promise with the processed clients
        })
        .on('error', reject); // Reject the promise on error
    });
}

export async function importClientsFromAllCSV(seedName: string) {
  const directoryPath = path.join(__dirname, `../../../../prisma/seeds/${seedName}`);
  const files = fs.readdirSync(directoryPath).filter(file => file.endsWith('.csv'));
  const allClients = [];

  for (const file of files) {
    const clientsFromOneCSV = await importClientsFromOneCSV(path.join(directoryPath, file));
    if (clientsFromOneCSV) {
      allClients.push(...clientsFromOneCSV);
    }
  }

  return allClients; // Return all clients from all CSVs as JSON
}
