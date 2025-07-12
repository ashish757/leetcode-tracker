const https = require('https');
const fs = require('fs');

const url = 'https://leetcode-stats-api.herokuapp.com/ashish757'; // Replace with your API URL

https.get(url, (res) => {
  let data = '';

  // Concatenate chunks of data
  res.on('data', (chunk) => {
    data += chunk;
  });

  // On complete response
  res.on('end', () => {
    try {
      const apiData = JSON.parse(data);

      const newData = {
        lastUpdated: new Date().toISOString(),
        value: apiData // Adjust according to actual API structure
      };

      fs.writeFileSync('data.json', JSON.stringify(newData, null, 2));
      console.log('Data written to data.json');
    } catch (err) {
      console.error('Error parsing or writing data:', err);
      process.exit(1);
    }
  });
}).on('error', (err) => {
  console.error('HTTP request failed:', err);
  process.exit(1);
});
