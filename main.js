fetch('/data.json')
  .then(response => response.json())
  .then(data => {
    console.log("Data from API:", data);
    // Display or use the data as needed
  });
