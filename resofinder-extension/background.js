// ResoFinder Background Service Worker
// Uses static database of restaurants

let restaurantDatabase = {};

// Load database when extension starts
async function loadDatabase() {
  try {
    const response = await fetch(chrome.runtime.getURL('database.json'));
    restaurantDatabase = await response.json();
    console.log('ResoFinder: Database loaded,', Object.keys(restaurantDatabase).length, 'restaurants');
  } catch (error) {
    console.error('ResoFinder: Error loading database:', error);
  }
}

loadDatabase();

function createSlug(name) {
  return name.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'findRestaurant') {
    const result = findRestaurant(request.name);
    sendResponse(result);
    return true;
  }
});

function findRestaurant(restaurantName) {
  console.log('ResoFinder: Looking up:', restaurantName);

  const slug = createSlug(restaurantName);
  console.log('ResoFinder: Slug:', slug);

  const entry = restaurantDatabase[slug];

  if (entry) {
    console.log('ResoFinder: ✓ Found in database:', entry.platform);

    const platformInfo = {
      resy: {
        name: 'Book on Resy',
        color: '#D32323',
        icon: '🍽️'
      },
      opentable: {
        name: 'Book on OpenTable',
        color: '#DA3743',
        icon: '📅'
      }
    };

    const platform = platformInfo[entry.platform];

    return {
      name: platform.name,
      color: platform.color,
      icon: platform.icon,
      url: entry.url
    };
  }

  console.log('ResoFinder: ✗ Not in database');
  return null;
}
