// ResoFinder - Detects reservation platforms on Yelp restaurant pages

(function() {
  'use strict';

  // Platform detection patterns
  // Note: Patterns are checked in order - more specific patterns should come first
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

  function detectReservationPlatform(isLastAttempt = false) {
    // Look for reservation links and buttons in the page
    const links = document.querySelectorAll('a[href]');
    const buttons = document.querySelectorAll('button, [role="button"]');
    const pageHTML = document.body.innerHTML.toLowerCase();
    const pageText = document.body.innerText.toLowerCase();

    let detectedPlatform = null;
    let bookingUrl = null;

    // PRIORITY 1: Check actual URLs first (most reliable)
    for (let link of links) {
      const href = link.href.toLowerCase();

      for (let [key, platform] of Object.entries(PLATFORMS)) {
        if (platform.urlPatterns) {
          for (let urlPattern of platform.urlPatterns) {
            if (href.includes(urlPattern)) {
              detectedPlatform = platform;
              bookingUrl = link.href;
              return { platform: detectedPlatform, url: bookingUrl };
            }
          }
        }
      }
    }

    // PRIORITY 2: Check link text and aria labels
    for (let link of links) {
      const linkText = link.innerText.toLowerCase();
      const ariaLabel = (link.getAttribute('aria-label') || '').toLowerCase();

      for (let [key, platform] of Object.entries(PLATFORMS)) {
        for (let pattern of platform.patterns) {
          // Skip URL patterns in text matching
          if (pattern.includes('.com')) continue;

          if (linkText.includes(pattern) || ariaLabel.includes(pattern)) {
            detectedPlatform = platform;
            bookingUrl = link.href;
            return { platform: detectedPlatform, url: bookingUrl };
          }
        }
      }
    }

    // PRIORITY 3: Check buttons for reservation text
    for (let button of buttons) {
      const buttonText = button.innerText.toLowerCase();
      const ariaLabel = (button.getAttribute('aria-label') || '').toLowerCase();
      const onclick = (button.getAttribute('onclick') || '').toLowerCase();

      for (let [key, platform] of Object.entries(PLATFORMS)) {
        for (let pattern of platform.patterns) {
          // Skip URL patterns in text matching
          if (pattern.includes('.com')) continue;

          if (buttonText.includes(pattern) || ariaLabel.includes(pattern) || onclick.includes(pattern)) {
            detectedPlatform = platform;
            // Try to find the actual link
            const parentLink = button.closest('a[href]');
            if (parentLink) {
              bookingUrl = parentLink.href;
            }
            return { platform: detectedPlatform, url: bookingUrl };
          }
        }
      }
    }

    // PRIORITY 4: Check HTML source for platform URLs (sometimes hidden in data attributes)
    for (let [key, platform] of Object.entries(PLATFORMS)) {
      if (platform.urlPatterns) {
        for (let urlPattern of platform.urlPatterns) {
          if (pageHTML.includes(urlPattern)) {
            detectedPlatform = platform;
            // Try to extract the URL from HTML
            const urlMatch = pageHTML.match(new RegExp(`https?://[^"'\\s]*${urlPattern}[^"'\\s]*`, 'i'));
            if (urlMatch) {
              bookingUrl = urlMatch[0].replace(/&amp;/g, '&');
            }
            return { platform: detectedPlatform, url: bookingUrl };
          }
        }
      }
    }

    // Only show fallback options on the last attempt to avoid premature detection
    if (!detectedPlatform && isLastAttempt) {
      const hasReservationMention = pageText.includes('reservation') ||
                                     pageText.includes('book a table') ||
                                     pageText.includes('make a reservation');

      if (hasReservationMention) {
        return {
          platform: {
            name: 'Call for Reservations',
            color: '#666666',
            icon: '📞'
          },
          url: null
        };
      }

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

    // Insert badge near the contact info (phone, website, address)
    // Look for common Yelp contact info selectors
    const contactSection = document.querySelector('[aria-label*="Contact"]') ||
                           document.querySelector('[aria-label*="Location"]') ||
                           document.querySelector('section:has(a[href^="tel:"])') ||
                           document.querySelector('.arrange-unit__09f24__rqHTg') ||
                           document.querySelector('[data-testid="business-phone"]') ||
                           document.querySelector('p:has(a[href^="tel:"])');

    if (contactSection) {
      // Insert as first child of contact section
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
  }

  // Main execution
  function init() {
    // Wait for page to fully load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    // Try multiple times as Yelp loads content dynamically
    let attempts = 0;
    const maxAttempts = 8; // Increased from 5

    function tryDetect() {
      attempts++;
      const isLastAttempt = attempts >= maxAttempts;

      const platformInfo = detectReservationPlatform(isLastAttempt);
      if (platformInfo) {
        createBadge(platformInfo);
      } else if (attempts < maxAttempts) {
        // Try again with increasing delay to catch late-loading content
        const delay = attempts < 3 ? 500 : 1000;
        setTimeout(tryDetect, delay);
      }
    }

    // Start detection after initial delay
    setTimeout(tryDetect, 1000);
  }

  init();
})();
