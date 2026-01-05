// ResoFinder Background Service Worker
// Searches Resy, OpenTable, Tock for the restaurant

const PLATFORMS = {
  resy: {
    name: 'Book on Resy',
    color: '#D32323',
    icon: '🍽️',
    search: async (restaurantName, city) => {
      try {
        const query = encodeURIComponent(`${restaurantName} ${city}`);
        const searchUrl = `https://api.resy.com/3/venuesearch/search?query=${query}&geo={"latitude":34.0522,"longitude":-118.2437}`;

        console.log('ResoFinder: Searching Resy:', searchUrl);

        const response = await fetch(searchUrl);
        if (!response.ok) return null;

        const data = await response.json();

        // Check if we got results
        if (data.results && data.results.venues && data.results.venues.length > 0) {
          const venue = data.results.venues[0];
          const bookingUrl = `https://resy.com/cities/${venue.location.code}/${venue.url_slug}`;
          console.log('ResoFinder: ✓ Found on Resy:', bookingUrl);
          return bookingUrl;
        }

        console.log('ResoFinder: ✗ Not found on Resy');
        return null;
      } catch (error) {
        console.log('ResoFinder: Error searching Resy:', error.message);
        return null;
      }
    }
  },
  opentable: {
    name: 'Book on OpenTable',
    color: '#DA3743',
    icon: '📅',
    search: async (restaurantName, city) => {
      try {
        const query = encodeURIComponent(`${restaurantName} ${city}`);
        const searchUrl = `https://www.opentable.com/search/?term=${query}`;

        console.log('ResoFinder: Searching OpenTable:', searchUrl);

        const response = await fetch(searchUrl);
        if (!response.ok) return null;

        const html = await response.text();

        // Parse HTML to find restaurant link
        // OpenTable uses format like /r/restaurant-name-city
        const linkMatch = html.match(/href="(\/r\/[^"]+)"/i);
        if (linkMatch) {
          const bookingUrl = `https://www.opentable.com${linkMatch[1]}`;
          console.log('ResoFinder: ✓ Found on OpenTable:', bookingUrl);
          return bookingUrl;
        }

        console.log('ResoFinder: ✗ Not found on OpenTable');
        return null;
      } catch (error) {
        console.log('ResoFinder: Error searching OpenTable:', error.message);
        return null;
      }
    }
  },
  tock: {
    name: 'Book on Tock',
    color: '#00A0A0',
    icon: '🎫',
    search: async (restaurantName, city) => {
      try {
        const query = encodeURIComponent(restaurantName);
        const searchUrl = `https://www.exploretock.com/api/consumer/v2/search?term=${query}`;

        console.log('ResoFinder: Searching Tock:', searchUrl);

        const response = await fetch(searchUrl);
        if (!response.ok) return null;

        const data = await response.json();

        // Check if we got results
        if (data.businesses && data.businesses.length > 0) {
          const business = data.businesses[0];
          const bookingUrl = `https://www.exploretock.com/${business.url_slug}`;
          console.log('ResoFinder: ✓ Found on Tock:', bookingUrl);
          return bookingUrl;
        }

        console.log('ResoFinder: ✗ Not found on Tock');
        return null;
      } catch (error) {
        console.log('ResoFinder: Error searching Tock:', error.message);
        return null;
      }
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
    const bookingUrl = await platform.search(restaurantName, city);

    if (bookingUrl) {
      return {
        platform: {
          name: platform.name,
          color: platform.color,
          icon: platform.icon
        },
        url: bookingUrl
      };
    }
  }

  console.log('ResoFinder: Not found on any platform');
  return { platform: null, url: null };
}
