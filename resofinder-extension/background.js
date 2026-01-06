// ResoFinder Background Service Worker
// Search Resy and OpenTable for the restaurant

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'searchPlatforms') {
    searchPlatforms(request.name).then(result => {
      sendResponse(result);
    });
    return true;
  }
});

async function searchPlatforms(restaurantName) {
  console.log('ResoFinder: Searching for:', restaurantName);

  // Try Resy first
  const resyResult = await searchResy(restaurantName);
  if (resyResult) return resyResult;

  // Try OpenTable
  const opentableResult = await searchOpenTable(restaurantName);
  if (opentableResult) return opentableResult;

  return null;
}

async function searchResy(restaurantName) {
  try {
    const query = encodeURIComponent(restaurantName + ' Los Angeles');
    const searchUrl = `https://resy.com/cities/la?search=${query}`;

    console.log('ResoFinder: Searching Resy:', searchUrl);

    const response = await fetch(searchUrl);
    const html = await response.text();

    console.log('ResoFinder: Got Resy HTML, length:', html.length);

    // Look for venue links - try multiple patterns
    let venueMatch = html.match(/href="(\/cities\/[^"]*\/venues\/[^"]+)"/i);

    if (!venueMatch) {
      // Try alternate pattern: {"url_slug":"republique",...}
      const slugMatch = html.match(/"url_slug":"([^"]+)"/);
      if (slugMatch) {
        console.log('ResoFinder: Found slug in JSON:', slugMatch[1]);
        // Try to find the city code too
        const cityMatch = html.match(/"location":\{"code":"([^"]+)"/);
        if (cityMatch) {
          const url = `https://resy.com/cities/${cityMatch[1]}/${slugMatch[1]}`;
          console.log('ResoFinder: ✓ Found on Resy:', url);
          return {
            name: 'Book on Resy',
            color: '#D32323',
            icon: '🍽️',
            url: url
          };
        }
      }
    } else {
      const url = `https://resy.com${venueMatch[1]}`;
      console.log('ResoFinder: ✓ Found on Resy:', url);
      return {
        name: 'Book on Resy',
        color: '#D32323',
        icon: '🍽️',
        url: url
      };
    }

    console.log('ResoFinder: Not found on Resy');
    return null;
  } catch (error) {
    console.log('ResoFinder: Resy error:', error.message);
    return null;
  }
}

async function searchOpenTable(restaurantName) {
  try {
    const query = encodeURIComponent(restaurantName + ' Los Angeles');
    const searchUrl = `https://www.opentable.com/s?term=${query}`;

    console.log('ResoFinder: Searching OpenTable:', searchUrl);

    const response = await fetch(searchUrl);
    const html = await response.text();

    console.log('ResoFinder: Got OpenTable HTML, length:', html.length);

    // Look for restaurant links in the HTML
    // OpenTable uses format like: /r/restaurant-name-location
    const restaurantMatch = html.match(/href="(\/r\/[^"]+)"/i);

    if (restaurantMatch) {
      const url = `https://www.opentable.com${restaurantMatch[1]}`;
      console.log('ResoFinder: ✓ Found on OpenTable:', url);
      return {
        name: 'Book on OpenTable',
        color: '#DA3743',
        icon: '📅',
        url: url
      };
    }

    console.log('ResoFinder: Not found on OpenTable');
    return null;
  } catch (error) {
    console.log('ResoFinder: OpenTable error:', error.message);
    return null;
  }
}
