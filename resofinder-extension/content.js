// ResoFinder - Detects reservation platforms on Yelp restaurant pages

(function() {
  'use strict';

  // Platform detection patterns
  const PLATFORMS = {
    resy: {
      name: 'Resy',
      color: '#D32323',
      patterns: ['resy.com', 'reserve on resy', 'book on resy'],
      icon: '🍽️'
    },
    opentable: {
      name: 'OpenTable',
      color: '#DA3743',
      patterns: ['opentable.com', 'reserve on opentable', 'book a table'],
      icon: '📅'
    },
    tock: {
      name: 'Tock',
      color: '#00A0A0',
      patterns: ['exploretock.com', 'book on tock'],
      icon: '🎫'
    },
    sevenrooms: {
      name: 'SevenRooms',
      color: '#000000',
      patterns: ['sevenrooms.com'],
      icon: '🔑'
    }
  };

  function detectReservationPlatform() {
    // Look for reservation links in the page
    const links = document.querySelectorAll('a[href]');
    const pageText = document.body.innerText.toLowerCase();

    let detectedPlatform = null;
    let bookingUrl = null;

    // Check all links for reservation platform URLs
    for (let link of links) {
      const href = link.href.toLowerCase();
      const linkText = link.innerText.toLowerCase();

      for (let [key, platform] of Object.entries(PLATFORMS)) {
        for (let pattern of platform.patterns) {
          if (href.includes(pattern) || linkText.includes(pattern)) {
            detectedPlatform = platform;
            bookingUrl = link.href;
            return { platform: detectedPlatform, url: bookingUrl };
          }
        }
      }
    }

    // If no link found, check page text
    for (let [key, platform] of Object.entries(PLATFORMS)) {
      for (let pattern of platform.patterns) {
        if (pageText.includes(pattern)) {
          detectedPlatform = platform;
          return { platform: detectedPlatform, url: null };
        }
      }
    }

    // Check for phone-only or walk-in
    const hasReservationMention = pageText.includes('reservation') ||
                                   pageText.includes('book a table') ||
                                   pageText.includes('make a reservation');

    if (!detectedPlatform && hasReservationMention) {
      return {
        platform: {
          name: 'Call to Reserve',
          color: '#666666',
          icon: '📞'
        },
        url: null
      };
    }

    if (!detectedPlatform) {
      return {
        platform: {
          name: 'Walk-in Only',
          color: '#999999',
          icon: '🚶'
        },
        url: null
      };
    }

    return null;
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

    // Insert badge near the restaurant name
    const restaurantHeader = document.querySelector('h1') ||
                            document.querySelector('[data-testid="business-name"]') ||
                            document.querySelector('.business-name');

    if (restaurantHeader) {
      restaurantHeader.parentNode.insertBefore(badge, restaurantHeader.nextSibling);
    } else {
      // Fallback: add to top of page
      document.body.insertBefore(badge, document.body.firstChild);
    }
  }

  // Main execution
  function init() {
    // Wait for page to fully load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    // Give Yelp's dynamic content time to load
    setTimeout(() => {
      const platformInfo = detectReservationPlatform();
      if (platformInfo) {
        createBadge(platformInfo);
      }
    }, 1000);
  }

  init();
})();
