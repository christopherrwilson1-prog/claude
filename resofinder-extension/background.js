// ResoFinder Background Service Worker
// Fetches restaurant websites and searches for reservation platform links

const PLATFORMS = {
  resy: {
    name: 'Book on Resy',
    color: '#D32323',
    urlPatterns: ['resy.com'],
    icon: '🍽️'
  },
  opentable: {
    name: 'Book on OpenTable',
    color: '#DA3743',
    urlPatterns: ['opentable.com'],
    icon: '📅'
  },
  tock: {
    name: 'Book on Tock',
    color: '#00A0A0',
    urlPatterns: ['exploretock.com', 'tock.com'],
    icon: '🎫'
  },
  sevenrooms: {
    name: 'Book on SevenRooms',
    color: '#000000',
    urlPatterns: ['sevenrooms.com'],
    icon: '🔑'
  }
};

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'fetchWebsite') {
    fetchAndScanWebsite(request.url).then(result => {
      sendResponse(result);
    }).catch(error => {
      console.error('ResoFinder: Error fetching website:', error);
      sendResponse({ platform: null, url: null, error: error.message });
    });
    return true; // Keep channel open for async response
  }
});

async function fetchAndScanWebsite(websiteUrl) {
  try {
    console.log('ResoFinder: Fetching website:', websiteUrl);

    // Fetch the restaurant's website
    const response = await fetch(websiteUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    const htmlLower = html.toLowerCase();

    // Search for reservation platform links in the HTML
    for (let [key, platform] of Object.entries(PLATFORMS)) {
      for (let urlPattern of platform.urlPatterns) {
        if (htmlLower.includes(urlPattern)) {
          console.log('ResoFinder: Found platform in website:', platform.name);

          // Try to extract the actual booking URL
          const urlRegex = new RegExp(`https?://[^"'\\s<>]*${urlPattern}[^"'\\s<>]*`, 'i');
          const match = html.match(urlRegex);

          const bookingUrl = match ? match[0].replace(/&amp;/g, '&') : null;

          return {
            platform: platform,
            url: bookingUrl
          };
        }
      }
    }

    console.log('ResoFinder: No reservation platform found on website');
    return { platform: null, url: null };

  } catch (error) {
    console.error('ResoFinder: Fetch error:', error);
    throw error;
  }
}
