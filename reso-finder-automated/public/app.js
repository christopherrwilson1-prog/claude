const form = document.getElementById('searchForm');
const searchBtn = document.getElementById('searchBtn');
const resultsSection = document.getElementById('resultsSection');
const resultsGrid = document.getElementById('resultsGrid');

// Set minimum date to today
document.getElementById('date').min = new Date().toISOString().split('T')[0];

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Get form data
  const formData = {
    restaurant: form.restaurant.value,
    date: form.date.value,
    time: form.time.value,
    partySize: form.partySize.value
  };

  // Show loading state
  searchBtn.disabled = true;
  searchBtn.querySelector('.btn-text').style.display = 'none';
  searchBtn.querySelector('.btn-loading').style.display = 'inline';

  // Show results section with loading placeholders
  resultsSection.style.display = 'block';
  resultsGrid.innerHTML = createLoadingCards();

  // Scroll to results
  resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

  try {
    const response = await fetch('/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    const results = await response.json();

    if (response.ok) {
      displayResults(results, formData);
    } else {
      resultsGrid.innerHTML = `
        <div class="result-card">
          <div class="result-status not-found">
            ❌ Search failed: ${results.error || 'Unknown error'}
          </div>
        </div>
      `;
    }
  } catch (error) {
    console.error('Search error:', error);
    resultsGrid.innerHTML = `
      <div class="result-card">
        <div class="result-status not-found">
          ❌ Network error. Please try again.
        </div>
      </div>
    `;
  } finally {
    // Reset button
    searchBtn.disabled = false;
    searchBtn.querySelector('.btn-text').style.display = 'inline';
    searchBtn.querySelector('.btn-loading').style.display = 'none';
  }
});

function createLoadingCards() {
  return `
    <div class="result-card">
      <div class="platform-header">
        <div class="platform-icon">🍽️</div>
        <div class="platform-name">Resy</div>
      </div>
      <div class="result-status searching">
        🔍 Searching...
      </div>
    </div>
    <div class="result-card">
      <div class="platform-header">
        <div class="platform-icon">📅</div>
        <div class="platform-name">OpenTable</div>
      </div>
      <div class="result-status searching">
        🔍 Searching...
      </div>
    </div>
  `;
}

function displayResults(results, formData) {
  const cards = [];

  // Resy result
  const resyCard = createResultCard(
    'Resy',
    '🍽️',
    results.resy,
    formData
  );
  cards.push(resyCard);

  // OpenTable result
  const opentableCard = createResultCard(
    'OpenTable',
    '📅',
    results.opentable,
    formData
  );
  cards.push(opentableCard);

  resultsGrid.innerHTML = cards.join('');
}

function createResultCard(platformName, icon, result, formData) {
  if (result.found) {
    return `
      <div class="result-card">
        <div class="platform-header">
          <div class="platform-icon">${icon}</div>
          <div class="platform-name">${platformName}</div>
        </div>
        <div class="result-status found">
          ✓ ${result.message || 'Restaurant found!'}
        </div>
        <a href="${result.url}" target="_blank" class="book-btn">
          Book on ${platformName}
        </a>
      </div>
    `;
  } else {
    return `
      <div class="result-card">
        <div class="platform-header">
          <div class="platform-icon">${icon}</div>
          <div class="platform-name">${platformName}</div>
        </div>
        <div class="result-status not-found">
          ✗ Not found on ${platformName}
        </div>
        <p style="color: #6b7280; text-align: center; margin-top: 10px;">
          ${formData.restaurant} is not available on this platform
        </p>
      </div>
    `;
  }
}
