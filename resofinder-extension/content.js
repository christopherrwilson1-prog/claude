// ResoFinder - Detects reservation platforms on Yelp restaurant pages

(function() {
  'use strict';

  function getRestaurantInfo() {
    // Get restaurant name from h1
    const nameElement = document.querySelector('h1');
    if (!nameElement) {
      console.log('ResoFinder: Could not find restaurant name');
      return null;
    }

    const restaurantName = nameElement.innerText.trim();

    // Get city from the address/location section
    // Yelp usually has the city in the address
    let city = 'los-angeles'; // Default to LA

    // Try to find city in address
    const addressElements = document.querySelectorAll('[class*="address"]');
    for (let elem of addressElements) {
      const text = elem.innerText;
      // Look for pattern like "Los Angeles, CA"
      const cityMatch = text.match(/([A-Za-z\s]+),\s*[A-Z]{2}/);
      if (cityMatch) {
        city = cityMatch[1].trim();
        break;
      }
    }

    // Also try structured data or meta tags
    if (city === 'los-angeles') {
      const metaCity = document.querySelector('meta[property="og:locality"]');
      if (metaCity) {
        city = metaCity.content;
      }
    }

    console.log('ResoFinder: Restaurant info:', { name: restaurantName, city: city });
    console.log('ResoFinder: Name:', restaurantName, 'City:', city);
    return { name: restaurantName, city: city };
  }

  async function findPlatform(restaurantInfo) {
    console.log('ResoFinder: Searching platforms for', restaurantInfo.name);
    console.log('ResoFinder: Sending message to background worker...');

    return new Promise((resolve) => {
      chrome.runtime.sendMessage(
        {
          action: 'findPlatform',
          name: restaurantInfo.name,
          city: restaurantInfo.city
        },
        (response) => {
          console.log('ResoFinder: Received response from background:', response);

          if (chrome.runtime.lastError) {
            console.error('ResoFinder: Chrome runtime error:', chrome.runtime.lastError);
            resolve(null);
          } else if (response && response.platform) {
            console.log('ResoFinder: Found on', response.platform.name, 'URL:', response.url);
            resolve(response);
          } else {
            console.log('ResoFinder: Response has no platform, response:', response);
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

    // Make it clickable
    if (platformInfo.url) {
      badge.style.cursor = 'pointer';
      badge.addEventListener('click', () => {
        window.open(platformInfo.url, '_blank');
      });
      badge.title = `Click to book at ${platformInfo.platform.name}`;
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

      if (phoneLink && phoneLink.parentElement) {
        phoneLink.parentElement.insertBefore(badge, phoneLink.parentElement.firstChild);
      } else {
        // Last resort: add near restaurant header
        const restaurantHeader = document.querySelector('h1');
        if (restaurantHeader && restaurantHeader.parentNode) {
          restaurantHeader.parentNode.insertBefore(badge, restaurantHeader.nextSibling);
        } else {
          document.body.insertBefore(badge, document.body.firstChild);
        }
      }
    }

    console.log('ResoFinder: Badge created');
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

    console.log('ResoFinder: Starting...');

    // Wait for Yelp to load content
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Get restaurant name and city
    const restaurantInfo = getRestaurantInfo();
    if (!restaurantInfo) {
      console.log('ResoFinder: Could not extract restaurant info');
      showFallbackBadge();
      return;
    }

    // Search platforms
    const platformInfo = await findPlatform(restaurantInfo);

    if (platformInfo) {
      createBadge(platformInfo);
    } else {
      showFallbackBadge();
    }
  }

  init();
})();
