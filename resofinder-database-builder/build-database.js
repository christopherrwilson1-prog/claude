// Database Builder for ResoFinder
// Uses Puppeteer to search Resy and OpenTable for restaurants

const puppeteer = require('puppeteer');
const fs = require('fs');

// List of restaurants to search for
const RESTAURANTS = [
  'Republique',
  'Found Oyster',
  'Zinqué',
  'Bestia',
  'Catch LA',
  'Gjelina',
  'Pizzana',
  'n/naka',
  'Spago',
  'Nobu Malibu',
  'Providence',
  'Osteria Mozza',
  'Felix Trattoria',
  'Crossroads Kitchen',
  'Perch LA',
  'Majordomo',
  'Animal',
  'Sqirl',
  'Jon & Vinny\'s',
  'Lucques'
];

async function searchResy(page, restaurantName) {
  console.log(`Searching Resy for: ${restaurantName}`);

  try {
    await page.goto('https://resy.com/cities/la', { waitUntil: 'networkidle2', timeout: 30000 });

    // Wait for search input
    await page.waitForSelector('input[type="search"], input[placeholder*="Search"]', { timeout: 10000 });

    // Type restaurant name
    await page.type('input[type="search"], input[placeholder*="Search"]', restaurantName);

    // Wait for results
    await page.waitForTimeout(2000);

    // Look for venue link
    const venueLink = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a[href*="/venues/"]'));
      return links.length > 0 ? links[0].href : null;
    });

    if (venueLink) {
      console.log(`✓ Found on Resy: ${venueLink}`);
      return venueLink;
    }

    console.log(`✗ Not found on Resy`);
    return null;
  } catch (error) {
    console.log(`✗ Error searching Resy: ${error.message}`);
    return null;
  }
}

async function searchOpenTable(page, restaurantName) {
  console.log(`Searching OpenTable for: ${restaurantName}`);

  try {
    await page.goto(`https://www.opentable.com/s?term=${encodeURIComponent(restaurantName + ' Los Angeles')}`,
      { waitUntil: 'networkidle2', timeout: 30000 });

    // Wait for results
    await page.waitForTimeout(3000);

    // Look for restaurant link
    const restaurantLink = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a[href*="/r/"]'));
      return links.length > 0 ? links[0].href : null;
    });

    if (restaurantLink) {
      console.log(`✓ Found on OpenTable: ${restaurantLink}`);
      return restaurantLink;
    }

    console.log(`✗ Not found on OpenTable`);
    return null;
  } catch (error) {
    console.log(`✗ Error searching OpenTable: ${error.message}`);
    return null;
  }
}

async function buildDatabase() {
  console.log('Starting database builder...\n');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  const database = {};

  for (const restaurant of RESTAURANTS) {
    console.log(`\n--- ${restaurant} ---`);

    // Normalize name for key
    const key = restaurant.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    // Try Resy first
    const resyUrl = await searchResy(page, restaurant);

    if (resyUrl) {
      database[key] = {
        name: restaurant,
        platform: 'resy',
        url: resyUrl
      };
      continue;
    }

    // Try OpenTable
    const opentableUrl = await searchOpenTable(page, restaurant);

    if (opentableUrl) {
      database[key] = {
        name: restaurant,
        platform: 'opentable',
        url: opentableUrl
      };
      continue;
    }

    console.log(`✗ Not found on any platform`);
  }

  await browser.close();

  // Save database
  const outputPath = '../resofinder-extension/database.json';
  fs.writeFileSync(outputPath, JSON.stringify(database, null, 2));

  console.log(`\n✓ Database saved to ${outputPath}`);
  console.log(`Found ${Object.keys(database).length} restaurants`);

  return database;
}

// Run
buildDatabase().catch(console.error);
