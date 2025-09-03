// Initialize AOS (Animate On Scroll)
AOS.init({
  duration: 800,
  easing: 'ease-out-cubic',
  once: true,
  offset: 100
});

// Global variables for charts
let problemChart, rankChart, questionsChart;

// Utility functions
const formatNumber = (num) => {
  return num.toLocaleString();
};

const formatDate = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleDateString();
};

// Data processing functions
const getLatestData = (data) => {
  // Filter out error entries and get the most recent valid data
  const validData = data.filter(entry => 
    entry.status === 'success' || (entry.value && entry.value.status === 'success')
  );
  
  return validData.length > 0 ? validData[validData.length - 1] : null;
};

const normalizeDataEntry = (entry) => {
  // Handle different data structures in the JSON
  if (entry.value) {
    return {
      timestamp: entry.timestamp || entry.lastUpdated,
      ...entry.value
    };
  }
  return entry;
};

const processHistoricalData = (data) => {
  return data
    .filter(entry => entry.status === 'success' || (entry.value && entry.value.status === 'success'))
    .map(normalizeDataEntry)
    .sort((a, b) => a.timestamp - b.timestamp);
};

// Chart creation functions
const createProblemChart = (data) => {
  const ctx = document.getElementById('problemChart').getContext('2d');
  
  if (problemChart) {
    problemChart.destroy();
  }
  
  problemChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Easy', 'Medium', 'Hard', 'Unsolved'],
      datasets: [{
        data: [
          data.easySolved,
          data.mediumSolved,
          data.hardSolved,
          data.totalQuestions - data.totalSolved
        ],
        backgroundColor: [
          '#00af9b',
          '#ffb800',
          '#ff375f',
          '#e2e8f0'
        ],
        borderWidth: 2,
        borderColor: '#ffffff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 20,
            usePointStyle: true,
            font: {
              size: 12,
              family: 'Inter'
            }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label;
              const value = context.parsed;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = ((value / total) * 100).toFixed(1);
              return `${label}: ${value} (${percentage}%)`;
            }
          }
        }
      }
    }
  });
};

const createRankChart = (historicalData) => {
  const ctx = document.getElementById('rankChart').getContext('2d');
  
  if (rankChart) {
    rankChart.destroy();
  }
  
  // Take last 20 data points for better visualization
  const recentData = historicalData.slice(-20);
  
  const labels = recentData.map(entry => {
    const date = new Date(typeof entry.timestamp === 'string' ? entry.timestamp : entry.timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });
  
  const rankings = recentData.map(entry => entry.ranking);
  
  rankChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Rank',
        data: rankings,
        borderColor: '#007acc',
        backgroundColor: 'rgba(0, 122, 204, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#007acc',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: 'index'
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#ffffff',
          bodyColor: '#ffffff',
          borderColor: '#007acc',
          borderWidth: 1,
          callbacks: {
            label: function(context) {
              return `Rank: ${formatNumber(context.parsed.y)}`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            font: {
              family: 'Inter'
            }
          }
        },
        y: {
          reverse: true, // Lower rank is better
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          },
          ticks: {
            font: {
              family: 'Inter'
            },
            callback: function(value) {
              return formatNumber(value);
            }
          }
        }
      }
    }
  });
};

const createQuestionsChart = (historicalData) => {
  const ctx = document.getElementById('questionsChart').getContext('2d');
  
  if (questionsChart) {
    questionsChart.destroy();
  }
  
  // Take last 20 data points for better visualization
  const recentData = historicalData.slice(-20);
  
  const labels = recentData.map(entry => {
    const date = new Date(typeof entry.timestamp === 'string' ? entry.timestamp : entry.timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });
  
  const totalSolved = recentData.map(entry => entry.totalSolved);
  
  questionsChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Questions Solved',
        data: totalSolved,
        borderColor: '#28a745',
        backgroundColor: 'rgba(40, 167, 69, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#28a745',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: 'index'
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#ffffff',
          bodyColor: '#ffffff',
          borderColor: '#28a745',
          borderWidth: 1,
          callbacks: {
            label: function(context) {
              return `Questions Solved: ${formatNumber(context.parsed.y)}`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            font: {
              family: 'Inter'
            }
          }
        },
        y: {
          beginAtZero: false,
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          },
          ticks: {
            font: {
              family: 'Inter'
            },
            callback: function(value) {
              return formatNumber(value);
            }
          }
        }
      }
    }
  });
};

// Update UI functions
const updateHeroStats = (data) => {
  document.getElementById('total-solved').textContent = formatNumber(data.totalSolved);
  document.getElementById('current-rank').textContent = formatNumber(data.ranking);
  document.getElementById('acceptance-rate').textContent = `${data.acceptanceRate}%`;
};

const updateProgressBars = (data) => {
  // Easy progress
  const easyPercentage = (data.easySolved / data.totalEasy) * 100;
  document.getElementById('easy-progress').style.width = `${easyPercentage}%`;
  document.getElementById('easy-count').textContent = `${data.easySolved}/${data.totalEasy}`;
  
  // Medium progress
  const mediumPercentage = (data.mediumSolved / data.totalMedium) * 100;
  document.getElementById('medium-progress').style.width = `${mediumPercentage}%`;
  document.getElementById('medium-count').textContent = `${data.mediumSolved}/${data.totalMedium}`;
  
  // Hard progress
  const hardPercentage = (data.hardSolved / data.totalHard) * 100;
  document.getElementById('hard-progress').style.width = `${hardPercentage}%`;
  document.getElementById('hard-count').textContent = `${data.hardSolved}/${data.totalHard}`;
};

const updateRankingStats = (latestData, historicalData) => {
  // Best rank (lowest number)
  const bestRank = Math.min(...historicalData.map(entry => entry.ranking));
  document.getElementById('best-rank').textContent = formatNumber(bestRank);
  
  // Rank change (current vs previous)
  if (historicalData.length >= 2) {
    const currentRank = latestData.ranking;
    const previousRank = historicalData[historicalData.length - 2].ranking;
    const change = previousRank - currentRank; // Positive means improvement
    
    const changeElement = document.getElementById('rank-change');
    if (change > 0) {
      changeElement.textContent = `+${formatNumber(change)}`;
      changeElement.style.color = '#28a745';
    } else if (change < 0) {
      changeElement.textContent = formatNumber(change);
      changeElement.style.color = '#dc3545';
    } else {
      changeElement.textContent = '0';
      changeElement.style.color = '#6b7280';
    }
  } else {
    document.getElementById('rank-change').textContent = 'N/A';
  }
  
  // Contribution points
  document.getElementById('contribution-points').textContent = formatNumber(latestData.contributionPoints);
};

const updateQuestionsStats = (latestData, historicalData) => {
  // Total questions solved
  document.getElementById('total-questions-solved').textContent = formatNumber(latestData.totalSolved);
  
  // Calculate average questions per day
  if (historicalData.length >= 2) {
    const firstEntry = historicalData[0];
    const lastEntry = historicalData[historicalData.length - 1];
    
    const firstDate = new Date(typeof firstEntry.timestamp === 'string' ? firstEntry.timestamp : firstEntry.timestamp);
    const lastDate = new Date(typeof lastEntry.timestamp === 'string' ? lastEntry.timestamp : lastEntry.timestamp);
    
    const daysDiff = Math.ceil((lastDate - firstDate) / (1000 * 60 * 60 * 24));
    const questionsDiff = lastEntry.totalSolved - firstEntry.totalSolved;
    
    const avgPerDay = daysDiff > 0 ? (questionsDiff / daysDiff).toFixed(1) : '0';
    document.getElementById('avg-questions-per-day').textContent = avgPerDay;
  } else {
    document.getElementById('avg-questions-per-day').textContent = '0';
  }
  
  // Calculate current streak based on totalSolved progression
  const streak = calculateStreakFromProgress(historicalData);
  document.getElementById('questions-streak').textContent = `${streak} days`;
};

// Helper function to calculate streak based on totalSolved progression
const calculateStreakFromProgress = (historicalData) => {
  if (historicalData.length < 2) {
    return 0;
  }

  // Sort data by timestamp (most recent first)
  const sortedData = [...historicalData].sort((a, b) => {
    const timestampA = typeof a.timestamp === 'string' ? new Date(a.timestamp).getTime() : a.timestamp;
    const timestampB = typeof b.timestamp === 'string' ? new Date(b.timestamp).getTime() : b.timestamp;
    return timestampB - timestampA;
  });

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Start of today

  // Check if there was progress today (compare with yesterday's data)
  const latestEntry = sortedData[0];
  const latestDate = new Date(typeof latestEntry.timestamp === 'string' ? latestEntry.timestamp : latestEntry.timestamp);
  latestDate.setHours(0, 0, 0, 0);

  // If latest data is not from today, check if it's from yesterday and start from there
  const daysSinceLatest = Math.floor((today - latestDate) / (1000 * 60 * 60 * 24));
  
  if (daysSinceLatest > 1) {
    // If latest data is more than 1 day old, streak is broken
    return 0;
  }

  // Start checking from the most recent data backwards
  for (let i = 0; i < sortedData.length - 1; i++) {
    const currentEntry = sortedData[i];
    const previousEntry = sortedData[i + 1];

    const currentDate = new Date(typeof currentEntry.timestamp === 'string' ? currentEntry.timestamp : currentEntry.timestamp);
    const previousDate = new Date(typeof previousEntry.timestamp === 'string' ? previousEntry.timestamp : previousEntry.timestamp);
    
    currentDate.setHours(0, 0, 0, 0);
    previousDate.setHours(0, 0, 0, 0);

    // Calculate days between entries
    const daysBetween = Math.floor((currentDate - previousDate) / (1000 * 60 * 60 * 24));

    // Check if there was progress (questions solved increased)
    const progressMade = currentEntry.totalSolved > previousEntry.totalSolved;

    if (progressMade) {
      if (daysBetween === 1) {
        // Consecutive day with progress
        streak++;
      } else if (daysBetween > 1) {
        // Gap in data - streak might be broken
        // We'll be conservative and break the streak if there's a gap > 1 day
        break;
      }
      // If daysBetween === 0 (same day), continue checking
    } else {
      // No progress made, streak is broken
      break;
    }
  }

  return streak;
};

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Animate numbers on scroll
const animateNumbers = () => {
  const stats = document.querySelectorAll('.stat-number, .stat-value');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const finalValue = target.textContent.replace(/,/g, '');
        
        if (!isNaN(finalValue) && finalValue !== '') {
          let startValue = 0;
          const increment = Math.ceil(finalValue / 100);
          
          const timer = setInterval(() => {
            startValue += increment;
            if (startValue >= finalValue) {
              startValue = finalValue;
              clearInterval(timer);
            }
            target.textContent = formatNumber(startValue);
          }, 20);
        }
        
        observer.unobserve(target);
      }
    });
  });
  
  stats.forEach(stat => observer.observe(stat));
};

// Main function to load and display data
const loadData = async () => {
  try {
    const response = await fetch('./data.json');
    const data = await response.json();
    
    if (!data || data.length === 0) {
      throw new Error('No data available');
    }
    
    // Get latest data
    const latestData = getLatestData(data);
    if (!latestData) {
      throw new Error('No valid data found');
    }
    
    const normalizedLatest = normalizeDataEntry(latestData);
    const historicalData = processHistoricalData(data);
    
    // Update UI
    updateHeroStats(normalizedLatest);
    updateProgressBars(normalizedLatest);
    updateRankingStats(normalizedLatest, historicalData);
    updateQuestionsStats(normalizedLatest, historicalData);
    
    // Create charts
    createProblemChart(normalizedLatest);
    createRankChart(historicalData);
    createQuestionsChart(historicalData);
    
    // Animate numbers
    setTimeout(animateNumbers, 500);
    
    console.log('Data loaded successfully:', normalizedLatest);
    
  } catch (error) {
    console.error('Error loading data:', error);
    
    // Show error message to user
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
      heroStats.innerHTML = `
        <div style="text-align: center; color: #ff6b6b;">
          <p>Unable to load data. Please try again later.</p>
        </div>
      `;
    }
  }
};

// Load data when DOM is ready
document.addEventListener('DOMContentLoaded', loadData);

// Add resize handler for charts
window.addEventListener('resize', () => {
  if (problemChart) problemChart.resize();
  if (rankChart) rankChart.resize();
  if (questionsChart) questionsChart.resize();
});
