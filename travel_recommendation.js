// travel.js

let travelData;

// Fetch data on page load
fetch('travel_recommendation_api.json')
  .then(response => response.json())
  .then(data => {
    travelData = data;
  })
  .catch(err => {
    console.error('Error loading data:', err);
  });

document.addEventListener('DOMContentLoaded', () => {
  // Get search elements
  const searchForm = document.getElementById('searchForm');
  const searchInput = document.getElementById('searchInput');
  const resultsContainer = document.getElementById('searchResults');

  // Handle search
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const keyword = searchInput.value.trim().toLowerCase();

    if (!keyword || !travelData) {
      resultsContainer.innerHTML = '<p>Please enter a search term.</p>';
      return;
    }

    let results = [];

    // 1. Beaches (singular/plural, different cases)
    if (keyword === "beach" || keyword === "beaches") {
      results = travelData.beaches;
    }
    // 2. Temples
    else if (keyword === "temple" || keyword === "temples") {
      results = travelData.temples;
    }
    // 3. Country or City
    else {
      // Search by country name
      travelData.countries.forEach(country => {
        if (country.name.toLowerCase() === keyword) {
          results = results.concat(country.cities);
        }
        // Search by city name
        country.cities.forEach(city => {
          if (city.name.toLowerCase().includes(keyword)) {
            results.push(city);
          }
        });
      });
    }

    // 4. Show results
    if (results.length === 0) {
      resultsContainer.innerHTML = '<p>No results found.</p>';
    } else {
      resultsContainer.innerHTML = results.map(item => `
        <div class="card mb-3" style="max-width: 540px;">
          <div class="row no-gutters">
            <div class="col-md-4">
              <img src="${item.imageUrl}" class="card-img" alt="${item.name}">
            </div>
            <div class="col-md-8">
              <div class="card-body">
                <h5 class="card-title">${item.name || item.city}</h5>
                <p class="card-text">${item.description}</p>
              </div>
            </div>
          </div>
        </div>
      `).join('');
    }
  });

  // Handle reset button
  const resetBtn = document.getElementById('resetBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      searchInput.value = '';
      resultsContainer.innerHTML = '';
    });
  }
});
