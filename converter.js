const fs = require('fs');
const readline = require('readline');
const { createObjectCsvWriter } = require('csv-writer');

const convertToCSV = (asciiFilePath, csvFilePath) => {
  // Create an instance of the CSV writer with the header

  return new Promise((res, rej) => {
    const csvWriter = createObjectCsvWriter({
      path: csvFilePath,
      header: [
        { id: 'line', title: 'line' },
      ]
    });

    // Create a read stream to read the ASCII file line by line
    const readStream = fs.createReadStream(asciiFilePath, { encoding: 'utf-8' });
    const rl = readline.createInterface({
      input: readStream,
      crlfDelay: Infinity
    });

    let headerProcessed = false;
    let headers = [];

    // Initialize an array to store CSV records
    let records = [];

    // Process each line of the ASCII file
    rl.on('line', (line) => {
      // Split the line into values based on the delimiter (e.g., comma, space)
      // const values = line.split(','); // Adjust delimiter based on the ASCII file structure
      console.log(line)
      // If headers are not yet processed, set them

      // Construct an object with keys as headers and values as line values
      let index = records.length
      const record = { "line": line };
      console.log(record)
      records.push(record);
    });

    // After reading all lines, write records to the CSV file
    rl.on('close', () => {
      console.log(records)
      csvWriter.writeRecords(records)
        .then(() => {
          res(true)
          console.log('CSV file written successfully')
        })
        .catch(error => {
          console.error('Error writing CSV file:', error)
          rej(false)
        });
    });
  })

}

module.exports = { convertToCSV };