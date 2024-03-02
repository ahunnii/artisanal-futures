import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';

async function importClientsFromOneCSV(filePath: string) {

    const parentDirName = path.basename(path.dirname(__dirname));

    let csvTextBlob = '';

    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          reject(err);
        } else {
          csvTextBlob = data;
          const rows = [];
          fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {

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
              
              rows.push({
                name: name,
                address: row.Address,
                email: email,
                phone: phone,
                prep_time: 5,
                service_time: 5,
                priority: 1,
                time_start: "9:00",
                time_end: "17:00",
                order: row["Delivery Type"],
                notes: row["Source file"] + " " + row["Source Sheet"]
              });
            })
            .on('end', () => {
              const modifiedCsvTextBlob = rows.map(row => Object.values(row).join(',')).join('\n');
              resolve(modifiedCsvTextBlob);
            });
        }
      });
    });
}

export async function importClientsFromAllCSV(seedName: string) {
  const directoryPath = path.join(__dirname, `../../../../prisma/seeds/${seedName}`);
  const files = fs.readdirSync(directoryPath).filter(file => file.endsWith('.csv'));
  
  if (files.length > 0) {
    const modifiedCsvTextBlob = await importClientsFromOneCSV(path.join(directoryPath, files[0]));
    return modifiedCsvTextBlob; // Return the first .csv as a modified text blob
  }

  return null;
}

