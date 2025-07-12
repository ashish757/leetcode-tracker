fetch('/data.json')
  .then(response => response.json())
  .then(data => {
    console.log("Data from API:", data);
    // Display or use the data as needed
//     {
//   "status": "success",
//   "message": "retrieved",
//   "totalSolved": 360,
//   "totalQuestions": 1735,
//   "easySolved": 146,
//   "totalEasy": 458,
//   "mediumSolved": 196,
//   "totalMedium": 904,
//   "hardSolved": 21,
//   "totalHard": 368,
//   "acceptanceRate": 50.92,
//   "ranking": 47657,
//   "contributionPoints": 2534,
//   "reputation": 1,
//   "submissionCalendar": {}
//   }
  });
