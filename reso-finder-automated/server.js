const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const puppeteer = require('puppeteer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Search Resy with Puppeteer
async function searchResy(restaurantName, date, time, partySize) {
  console.log(`Searching Resy for: ${restaurantName} on ${date} at ${time} for ${partySize}`);

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    // Go to Resy LA
    await page.goto('https://resy.com/cities/la', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    // Search for restaurant
    await page.waitForSelector('input[type="search"]', { timeout: 10000 });
    await page.type('input[type="search"]', restaurantName);
    await page.waitForTimeout(2000);

    // Look for restaurant link
    const restaurantLink = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a[href*="/venues/"]'));
      return links.length > 0 ? links[0].href : null;
    });

    if (!restaurantLink) {
      console.log('Resy: Restaurant not found');
      return { found: false, platform: 'resy' };
    }

    console.log('Resy: Found restaurant:', restaurantLink);

    // Go to restaurant page
    await page.goto(restaurantLink, { waitUntil: 'networkidle2', timeout: 30000 });
    await page.waitForTimeout(3000);

    // Check for availability
    const availability = await page.evaluate(() => {
      // Look for reservation buttons/times
      const timeButtons = Array.from(document.querySelectorAll('button[class*="ReservationButton"], button[class*="time"]'));
      return timeButtons.length > 0;
    });

    return {
      found: true,
      platform: 'resy',
      url: restaurantLink,
      hasAvailability: availability,
      message: availability ? 'Availability found - click to book' : 'Restaurant found - check availability'
    };

  } catch (error) {
    console.error('Resy search error:', error.message);
    return { found: false, platform: 'resy', error: error.message };
  } finally {
    if (browser) await browser.close();
  }
}

// Search OpenTable with Puppeteer
async function searchOpenTable(restaurantName, date, time, partySize) {
  console.log(`Searching OpenTable for: ${restaurantName}`);

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    // Search OpenTable
    const searchQuery = encodeURIComponent(`${restaurantName} Los Angeles`);
    await page.goto(`https://www.opentable.com/s?term=${searchQuery}`, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    await page.waitForTimeout(3000);

    // Look for restaurant link
    const restaurantLink = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a[href*="/r/"]'));
      return links.length > 0 ? links[0].href : null;
    });

    if (!restaurantLink) {
      console.log('OpenTable: Restaurant not found');
      return { found: false, platform: 'opentable' };
    }

    console.log('OpenTable: Found restaurant:', restaurantLink);

    return {
      found: true,
      platform: 'opentable',
      url: restaurantLink,
      hasAvailability: true,
      message: 'Restaurant found - click to check availability'
    };

  } catch (error) {
    console.error('OpenTable search error:', error.message);
    return { found: false, platform: 'opentable', error: error.message };
  } finally {
    if (browser) await browser.close();
  }
}

// API endpoint to search all platforms
app.post('/api/search', async (req, res) => {
  const { restaurant, date, time, partySize } = req.body;

  if (!restaurant || !date || !time || !partySize) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  console.log('\n=== New Search Request ===');
  console.log('Restaurant:', restaurant);
  console.log('Date:', date);
  console.log('Time:', time);
  console.log('Party Size:', partySize);

  try {
    // Search both platforms in parallel
    const [resyResult, opentableResult] = await Promise.all([
      searchResy(restaurant, date, time, partySize),
      searchOpenTable(restaurant, date, time, partySize)
    ]);

    const results = {
      resy: resyResult,
      opentable: opentableResult,
      searchedAt: new Date().toISOString()
    };

    console.log('Search complete:', results);
    res.json(results);

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed: ' + error.message });
  }
});

app.listen(PORT, () => {
  console.log(`\n🍽️  Automated ResoFinder running on http://localhost:${PORT}`);
  console.log('Search endpoint: POST /api/search\n');
});
