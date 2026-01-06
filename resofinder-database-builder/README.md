# ResoFinder Database Builder

Automated tool to build the restaurant database for the ResoFinder extension.

## How It Works

Uses Puppeteer (headless Chrome) to:
1. Search Resy.com for each restaurant
2. Extract the actual booking URL from search results
3. If not on Resy, search OpenTable.com
4. Save all results to `database.json`

## Setup

```bash
cd resofinder-database-builder
npm install
```

## Run

```bash
npm run build
```

This will:
- Launch headless Chrome
- Search for each restaurant in the list
- Save results to `../resofinder-extension/database.json`
- Takes ~1-2 minutes for 20 restaurants

## Adding Restaurants

Edit `build-database.js` and add names to the `RESTAURANTS` array:

```javascript
const RESTAURANTS = [
  'Republique',
  'Your Restaurant Name',
  // ...
];
```

Then run `npm run build` again.

## Output

Creates `database.json` with format:
```json
{
  "republique": {
    "name": "Republique",
    "platform": "resy",
    "url": "https://resy.com/cities/los-angeles-ca/venues/republique"
  }
}
```

The extension loads this database and does instant lookups - no API calls needed!
