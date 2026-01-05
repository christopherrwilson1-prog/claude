// ResoFinder - Detects reservation platforms on Yelp restaurant pages

(function() {
  'use strict';

  // Platform detection patterns
  const PLATFORMS = {
    resy: {
      name: 'Book on Resy',
      color: '#D32323',
      patterns: ['resy.com', 'reserve on resy', 'book on resy', 'resy'],
      urlPatterns: ['resy.com'],
      icon: '🍽️'
    },
    opentable: {
      name: 'Book on OpenTable',
      color: '#DA3743',
      patterns: ['opentable.com', 'reserve on opentable', 'book on opentable'],
      urlPatterns: ['opentable.com'],
      icon: '📅'
    },
    tock: {
      name: 'Book on Tock',
      color: '#00A0A0',
      patterns: ['exploretock.com', 'tock.com', 'book on tock'],
      urlPatterns: ['exploretock.com', 'tock.com'],
      icon: '🎫'
    },
    sevenrooms: {
      name: 'Book on SevenRooms',
      color: '#000000',
      patterns: ['sevenrooms.com'],
      urlPatterns: ['sevenrooms.com'],
      icon: '🔑'
    }
  };

  function detectOnYelpPage() {
    // First, try to detect reservation platforms directly on Yelp page
    const links = document.querySelectorAll('a[href]');
    const pageHTML = document.body.innerHTML.toLowerCase();

    console.log('ResoFinder: Checking Yelp page for direct links...');

    // Check actual URLs first (most reliable)
    for (let link of links) {
      const href = link.href.toLowerCase();

      for (let [key, platform] of Object.entries(PLATFORMS)) {
        if (platform.urlPatterns) {
          for (let urlPattern of platform.urlPatterns) {
            if (href.includes(urlPattern)) {
              console.log('ResoFinder: Found platform on Yelp:', platform.name);
              return { platform: platform, url: link.href };
            }
          }
        }
      }
    }

    // Check HTML source for platform URLs
    for (let [key, platform] of Object.entries(PLATFORMS)) {
      if (platform.urlPatterns) {
        for (let urlPattern of platform.urlPatterns) {
          if (pageHTML.includes(urlPattern)) {
            console.log('ResoFinder: Found platform in Yelp HTML:', platform.name);
            const urlMatch = pageHTML.match(new RegExp(`https?://[^"'\\s]*${urlPattern}[^"'\\s]*`, 'i'));
            const bookingUrl = urlMatch ? urlMatch[0].replace(/&amp;/g, '&') : null;
            return { platform: platform, url: bookingUrl };
          }
        }
      }
    }

    return null;
  }

  function getRestaurantWebsite() {
    // Look for the restaurant's website link on Yelp
    // Yelp uses biz_redir for business website links
    const websiteLink = document.querySelector('a[href*="biz_redir"]');

    if (websiteLink) {
      // Extract the actual website URL from Yelp's redirect
      const href = websiteLink.href;
      const urlMatch = href.match(/url=([^&]+)/);
      if (urlMatch) {
        const websiteUrl = decodeURIComponent(urlMatch[1]);
        console.log('ResoFinder: Found restaurant website:', websiteUrl);
        return websiteUrl;
      }
    }

    // Alternative: look for website section
    const websiteLinks = Array.from(document.querySelectorAll('a')).filter(a => {
      const text = a.innerText.toLowerCase();
      return text.includes('business website') || text.includes('visit website');
    });

    if (websiteLinks.length > 0 && websiteLinks[0].href) {
      const href = websiteLinks[0].href;
      if (href.includes('biz_redir')) {
        const urlMatch = href.match(/url=([^&]+)/);
        if (urlMatch) {
          return decodeURIComponent(urlMatch[1]);
        }
      }
    }

    console.log('ResoFinder: No restaurant website found on Yelp');
    return null;
  }

  async function fetchRestaurantWebsite(websiteUrl) {
    console.log('ResoFinder: Requesting background to fetch:', websiteUrl);

    return new Promise((resolve) => {
      chrome.runtime.sendMessage(
        { action: 'fetchWebsite', url: websiteUrl },
        (response) => {
          if (chrome.runtime.lastError) {
            console.error('ResoFinder: Error communicating with background:', chrome.runtime.lastError);
            resolve(null);
          } else if (response && response.platform) {
            console.log('ResoFinder: Found platform on website:', response.platform.name);
            resolve(response);
          } else {
            console.log('ResoFinder: No platform found on website');
            resolve(null);
          }
        }
      );
    });
  }

  function createBadge(platformInfo) {
    // Check if badge already exists
    if (document.getElementById('resofinder-badge')) {
      return;
    }

    const badge = document.createElement('div');
    badge.id = 'resofinder-badge';
    badge.className = 'resofinder-badge';

    const icon = document.createElement('span');
    icon.className = 'resofinder-icon';
    icon.textContent = platformInfo.platform.icon;

    const text = document.createElement('span');
    text.className = 'resofinder-text';
    text.textContent = platformInfo.platform.name;

    badge.appendChild(icon);
    badge.appendChild(text);

    // Style the badge
    badge.style.backgroundColor = platformInfo.platform.color;

    // Make it clickable if we have a URL
    if (platformInfo.url) {
      badge.style.cursor = 'pointer';
      badge.addEventListener('click', () => {
        window.open(platformInfo.url, '_blank');
      });
      badge.title = `Click to book on ${platformInfo.platform.name}`;
    } else {
      badge.title = platformInfo.platform.name;
    }

    // Insert badge near the contact info
    const contactSection = document.querySelector('[aria-label*="Contact"]') ||
                           document.querySelector('[aria-label*="Location"]') ||
                           document.querySelector('section:has(a[href^="tel:"])') ||
                           document.querySelector('[data-testid="business-phone"]') ||
                           document.querySelector('p:has(a[href^="tel:"])');

    if (contactSection) {
      contactSection.insertBefore(badge, contactSection.firstChild);
    } else {
      // Fallback: try to find phone number or website links
      const phoneLink = document.querySelector('a[href^="tel:"]');
      const websiteLink = document.querySelector('a[href*="biz_redir"]');

      if (phoneLink && phoneLink.parentElement) {
        phoneLink.parentElement.insertBefore(badge, phoneLink.parentElement.firstChild);
      } else if (websiteLink && websiteLink.parentElement) {
        websiteLink.parentElement.insertBefore(badge, websiteLink.parentElement.firstChild);
      } else {
        // Last resort: add near restaurant header
        const restaurantHeader = document.querySelector('h1');
        if (restaurantHeader) {
          restaurantHeader.parentNode.insertBefore(badge, restaurantHeader.nextSibling);
        } else {
          document.body.insertBefore(badge, document.body.firstChild);
        }
      }
    }

    console.log('ResoFinder: Badge created successfully');
  }

  function showFallbackBadge() {
    const pageText = document.body.innerText.toLowerCase();
    const hasReservationMention = pageText.includes('reservation') ||
                                   pageText.includes('book a table') ||
                                   pageText.includes('make a reservation');

    if (hasReservationMention) {
      createBadge({
        platform: {
          name: 'Call for Reservations',
          color: '#666666',
          icon: '📞'
        },
        url: null
      });
    } else {
      createBadge({
        platform: {
          name: 'Walk-in Only',
          color: '#999999',
          icon: '🚶'
        },
        url: null
      });
    }
  }

  // Main execution
  async function init() {
    // Wait for page to fully load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    console.log('ResoFinder: Starting detection...');

    // Wait a bit for Yelp to load content
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Step 1: Check if platform is directly on Yelp page
    let platformInfo = detectOnYelpPage();

    if (platformInfo) {
      console.log('ResoFinder: Platform found on Yelp page');
      createBadge(platformInfo);
      return;
    }

    // Step 2: Get restaurant website and fetch it
    console.log('ResoFinder: No platform on Yelp, checking restaurant website...');
    const websiteUrl = getRestaurantWebsite();

    if (websiteUrl) {
      platformInfo = await fetchRestaurantWebsite(websiteUrl);

      if (platformInfo) {
        createBadge(platformInfo);
        return;
      }
    }

    // Step 3: Show fallback badge
    console.log('ResoFinder: Showing fallback badge');
    showFallbackBadge();
  }

  init();
})();
