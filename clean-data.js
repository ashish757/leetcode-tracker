const fs = require('fs');
const path = require('path');

// Read the current data.json file
const dataPath = path.join(__dirname, 'data.json');
const rawData = fs.readFileSync(dataPath, 'utf8');
const data = JSON.parse(rawData);

// Function to remove submissionCalendar from an object
function removeSubmissionCalendar(obj) {
  if (obj && typeof obj === 'object') {
    if (obj.hasOwnProperty('submissionCalendar')) {
      delete obj.submissionCalendar;
    }
    // Recursively check nested objects
    for (const key in obj) {
      if (obj[key] && typeof obj[key] === 'object') {
        removeSubmissionCalendar(obj[key]);
      }
    }
  }
}

// Clean the data
console.log('Cleaning data.json file...');
console.log(`Original entries: ${data.length}`);

data.forEach((entry, index) => {
  removeSubmissionCalendar(entry);
});

// Write the cleaned data back to the file
const cleanedData = JSON.stringify(data, null, 2);
fs.writeFileSync(dataPath, cleanedData);

console.log('✅ Successfully removed submissionCalendar from all entries');
console.log(`Cleaned entries: ${data.length}`);
console.log('File saved successfully!');
