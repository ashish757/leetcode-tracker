const https = require('https');
const fs = require('fs');

const url = 'https://leetcode-stats-api.herokuapp.com/ashish757'; 

https.get(url, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);

      // Read existing data.json if it exists
      let existing = [];
      if (fs.existsSync('data.json')) {
        const raw = fs.readFileSync('data.json', 'utf-8');
        existing = JSON.parse(raw);
      }

      // Append new entry
      const newEntry = {
        timestamp: new Date().toISOString(),
        value: parsed.value || parsed // adjust to your actual API structure
      };

      existing.push(newEntry);

      // Write back to file
      fs.writeFileSync('data.json', JSON.stringify(existing, null, 2));
      console.log('Data appended!');
    } catch (err) {
      console.error('Error parsing or writing data:', err);
      process.exit(1);
    }
  });
}).on('error', (err) => {
  console.error('HTTP error:', err);
  process.exit(1);
});
