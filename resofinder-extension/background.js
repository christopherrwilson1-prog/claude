// ResoFinder Background Service Worker
// Try common URL patterns to find restaurants

function createSlug(name) {
  return name.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'findRestaurant') {
    findRestaurant(request.name).then(result => {
      sendResponse(result);
    });
    return true;
  }
});

async function findRestaurant(restaurantName) {
  console.log('ResoFinder: Looking for:', restaurantName);

  const slug = createSlug(restaurantName);
  console.log('ResoFinder: Slug:', slug);

  // Try Resy first
  const resyUrls = [
    `https://resy.com/cities/la/${slug}`,
    `https://resy.com/cities/los-angeles/${slug}`,
    `https://resy.com/cities/los-angeles-ca/${slug}`
  ];

  for (let url of resyUrls) {
    console.log('ResoFinder: Trying Resy:', url);
    try {
      const response = await fetch(url, { method: 'HEAD', redirect: 'follow' });
      console.log('ResoFinder: Resy response:', response.status, response.url);

      if (response.ok && response.status === 200) {
        console.log('ResoFinder: ✓ Found on Resy!');
        return {
          name: 'Book on Resy',
          color: '#D32323',
          icon: '🍽️',
          url: response.url
        };
      }
    } catch (error) {
      console.log('ResoFinder: Resy error:', error.message);
    }
  }

  // Try OpenTable
  const opentableUrls = [
    `https://www.opentable.com/r/${slug}-los-angeles`,
    `https://www.opentable.com/r/${slug}-dtla-los-angeles`,
    `https://www.opentable.com/r/${slug}-west-hollywood`,
    `https://www.opentable.com/r/${slug}-la-los-angeles`,
    `https://www.opentable.com/r/${slug}`
  ];

  for (let url of opentableUrls) {
    console.log('ResoFinder: Trying OpenTable:', url);
    try {
      const response = await fetch(url, { method: 'HEAD', redirect: 'follow' });
      console.log('ResoFinder: OpenTable response:', response.status, response.url);

      if (response.ok && response.status === 200) {
        console.log('ResoFinder: ✓ Found on OpenTable!');
        return {
          name: 'Book on OpenTable',
          color: '#DA3743',
          icon: '📅',
          url: response.url
        };
      }
    } catch (error) {
      console.log('ResoFinder: OpenTable error:', error.message);
    }
  }

  console.log('ResoFinder: Not found');
  return null;
}
