import { PrismaClient } from '@prisma/client';
import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';
import {v4 as uuidv4} from 'uuid';

const prisma = new PrismaClient();

async function importClientsFromCSV(filePath: string) {

    const parentDirName = path.basename(path.dirname(__dirname));
    const depot = await prisma.depot.create({
      data: {
        name: parentDirName,
        magicCode: parentDirName,
        ownerId: uuidv4(),
        address: {
          create: {
            formatted: "",
            latitude: 42.33370343157542,
            longitude: -83.04849673684542,
          },
        },
      },
    });

    const results = [];
  
    // fs.createReadStream(filePath)
    //   .pipe(csv(['referenceToCustomer', 'address', 'contactRelated', 'deliveryType', 'deliveryTypeField', 'referenceField', 'addressField', 'contactRelatedField', 'sourceFile', 'sourceSheet']))
    //   .on('data', (data) => results.push(data))
    //   .on('end', async () => {
    //     for (const item of results) {
    //       // Initialize email and phone as empty strings
    //       let email = '';
    //       let phone = '';
  
    //       // Regular expression for identifying email and phone
    //       const emailRegex = /\S+@\S+\.\S+/;
    //       const phoneRegex = /(?:\+?\d{1,3}[\s-]?)?(?:\(\d{3}\)|\d{3})[\s-]?\d{3}[\s-]?\d{4}/; // Adjust regex as needed
  
    //       // Split the contactRelated field by non-email characters, assuming space as a common separator
    //       const contactParts = item.contactRelated.split(/\s+/);
  
    //       // Attempt to identify email and phone number
    //       contactParts.forEach(part => {
    //         if (emailRegex.test(part) && !email) {
    //           email = part;
    //         } else if (phoneRegex.test(part) && !phone) {
    //           phone = part;
    //         }
    //       });
  
    //       await prisma.client.create({
    //         data: {
    //           name: item.referenceToCustomer,
    //           address: item.addressField,
    //           email: email,
    //           phone: phone,
    //           depot: depot
    //         },
    //       });
    //     }
    //     console.log(`Imported clients from ${path.basename(filePath)}`);
    //   });
  }

async function main() {
  const directoryPath = __dirname; // Directory containing this script and the CSV files
  const files = fs.readdirSync(directoryPath).filter(file => file.endsWith('.csv'));

  for (const file of files) {
    await importClientsFromCSV(path.join(directoryPath, file));
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });