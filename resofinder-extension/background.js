// ResoFinder Background Service Worker
// Checks if restaurant exists on platforms by trying standard URL patterns

const PLATFORMS = {
  opentable: {
    name: 'Book on OpenTable',
    color: '#DA3743',
    icon: '📅',
    buildUrls: (restaurantName, city) => {
      const slug = restaurantName.toLowerCase()
        .replace(/['']/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

      const citySlug = city.toLowerCase().replace(/\s+/g, '-');

      return [
        `https://www.opentable.com/r/${slug}-${citySlug}`,
        `https://www.opentable.com/r/${slug}-los-angeles`,
        `https://www.opentable.com/${slug}`
      ];
    }
  },
  resy: {
    name: 'Book on Resy',
    color: '#D32323',
    icon: '🍽️',
    buildUrls: (restaurantName, city) => {
      const slug = restaurantName.toLowerCase()
        .replace(/['']/g, '')  // Remove apostrophes
        .replace(/[^a-z0-9]+/g, '-')  // Replace non-alphanumeric with hyphens
        .replace(/^-|-$/g, '');  // Remove leading/trailing hyphens

      // Try multiple city formats
      return [
        `https://resy.com/cities/la/${slug}`,
        `https://resy.com/cities/los-angeles/${slug}`,
        `https://resy.com/cities/losangeles/${slug}`
      ];
    }
  },
  tock: {
    name: 'Book on Tock',
    color: '#00A0A0',
    icon: '🎫',
    buildUrls: (restaurantName, city) => {
      const slug = restaurantName.toLowerCase()
        .replace(/['']/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

      return [
        `https://www.exploretock.com/${slug}`,
        `https://www.exploretock.com/${slug}-${city.toLowerCase().replace(/\s+/g, '-')}`
      ];
    }
  }
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'findPlatform') {
    findRestaurantPlatform(request.name, request.city).then(result => {
      sendResponse(result);
    }).catch(error => {
      console.error('ResoFinder: Error:', error);
      sendResponse({ platform: null, url: null });
    });
    return true;
  }
});

async function findRestaurantPlatform(restaurantName, city) {
  console.log('ResoFinder: Searching for:', restaurantName, 'in', city);

  // Try each platform
  for (let [key, platform] of Object.entries(PLATFORMS)) {
    const urls = platform.buildUrls(restaurantName, city);

    // Try each URL variant
    for (let url of urls) {
      try {
        console.log(`ResoFinder: Trying ${platform.name}:`, url);

        const response = await fetch(url, {
          method: 'HEAD',
          redirect: 'follow'
        });

        console.log(`ResoFinder: Response status:`, response.status, response.url);

        // 200 = found, 404 = not found
        if (response.ok && response.status === 200) {
          console.log(`ResoFinder: ✓ Found on ${platform.name}!`);
          return {
            platform: {
              name: platform.name,
              color: platform.color,
              icon: platform.icon
            },
            url: response.url  // Use final URL after redirects
          };
        }
      } catch (error) {
        console.log(`ResoFinder: Error checking ${url}:`, error.message);
      }
    }
  }

  console.log('ResoFinder: Not found on any platform');
  return { platform: null, url: null };
}
