// ResoFinder Background Service Worker
// Checks if restaurant exists on OpenTable, Resy, Tock, etc.

const PLATFORMS = {
  resy: {
    name: 'Book on Resy',
    color: '#D32323',
    icon: '🍽️',
    buildUrl: (name, city) => {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const citySlug = city.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      return `https://resy.com/cities/${citySlug}/${slug}`;
    }
  },
  opentable: {
    name: 'Book on OpenTable',
    color: '#DA3743',
    icon: '📅',
    buildUrl: (name, city) => {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      return `https://www.opentable.com/r/${slug}-${city.toLowerCase()}`;
    }
  },
  tock: {
    name: 'Book on Tock',
    color: '#00A0A0',
    icon: '🎫',
    buildUrl: (name, city) => {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      return `https://www.exploretock.com/${slug}`;
    }
  }
};

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'findPlatform') {
    findRestaurantPlatform(request.name, request.city).then(result => {
      sendResponse(result);
    }).catch(error => {
      console.error('ResoFinder: Error finding platform:', error);
      sendResponse({ platform: null, url: null });
    });
    return true; // Keep channel open for async response
  }
});

async function findRestaurantPlatform(restaurantName, city) {
  console.log('ResoFinder: Searching for:', restaurantName, 'in', city);

  // Try each platform in order
  for (let [key, platform] of Object.entries(PLATFORMS)) {
    try {
      const url = platform.buildUrl(restaurantName, city);
      console.log(`ResoFinder: Checking ${platform.name}:`, url);

      // Try to fetch the URL
      const response = await fetch(url, {
        method: 'HEAD',
        redirect: 'follow'
      });

      // If we get a 200, the restaurant exists on this platform!
      if (response.ok) {
        console.log(`ResoFinder: ✓ Found on ${platform.name}!`);
        return {
          platform: platform,
          url: url
        };
      } else {
        console.log(`ResoFinder: ✗ Not on ${platform.name} (${response.status})`);
      }
    } catch (error) {
      console.log(`ResoFinder: ✗ Error checking ${platform.name}:`, error.message);
    }
  }

  console.log('ResoFinder: Not found on any platform');
  return { platform: null, url: null };
}
