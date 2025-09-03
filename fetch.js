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
      // "status": "success",
      // "message": "retrieved",
      // "totalSolved": 360,
      // "totalQuestions": 1735,
      // "easySolved": 146,
      // "totalEasy": 458,
      // "mediumSolved": 196,
      // "totalMedium": 904,
      // "hardSolved": 21,
      // "totalHard": 368,
      // "acceptanceRate": 50.92,
      // "ranking": 47657,
      // "contributionPoints": 2534,
      // "reputation": 1,
      // "submissionCalendar": {}

      // Append new entry (excluding submissionCalendar)
      const { submissionCalendar, ...dataWithoutCalendar } = parsed;
      
      const newEntry = {
        timestamp: new Date().getTime(),
        ...dataWithoutCalendar // spread all fields except submissionCalendar
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
