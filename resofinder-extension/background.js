// ResoFinder Background Service Worker
// Simple approach: Try standard URL patterns for each platform

function createSlug(name) {
  return name.toLowerCase()
    .normalize('NFD')  // Handle accents: é → e
    .replace(/[\u0300-\u036f]/g, '')  // Remove diacritics
    .replace(/[^a-z0-9]+/g, '-')  // Replace non-alphanumeric with dash
    .replace(/^-|-$/g, '');  // Remove leading/trailing dashes
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'checkPlatforms') {
    checkPlatforms(request.name).then(result => {
      sendResponse(result);
    });
    return true;  // Keep channel open
  }
});

async function checkPlatforms(restaurantName) {
  console.log('ResoFinder: Checking platforms for:', restaurantName);

  const slug = createSlug(restaurantName);
  console.log('ResoFinder: Slug:', slug);

  // Check Resy first
  const resyUrls = [
    `https://resy.com/cities/la/${slug}`,
    `https://resy.com/cities/los-angeles/${slug}`
  ];

  for (let url of resyUrls) {
    console.log('ResoFinder: Trying Resy:', url);
    try {
      const response = await fetch(url, { method: 'HEAD', redirect: 'follow' });
      console.log('ResoFinder: Resy status:', response.status, response.url);

      if (response.ok) {
        console.log('ResoFinder: ✓ Found on Resy!');
        return {
          platform: 'resy',
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

  // Check OpenTable
  const opentableUrls = [
    `https://www.opentable.com/r/${slug}-los-angeles`,
    `https://www.opentable.com/r/${slug}-dtla-los-angeles`,
    `https://www.opentable.com/r/${slug}-west-hollywood`,
    `https://www.opentable.com/r/${slug}-la`
  ];

  for (let url of opentableUrls) {
    console.log('ResoFinder: Trying OpenTable:', url);
    try {
      const response = await fetch(url, { method: 'HEAD', redirect: 'follow' });
      console.log('ResoFinder: OpenTable status:', response.status, response.url);

      if (response.ok) {
        console.log('ResoFinder: ✓ Found on OpenTable!');
        return {
          platform: 'opentable',
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

  console.log('ResoFinder: Not found on any platform');
  return null;
}
