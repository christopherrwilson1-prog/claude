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
    // Look for reservation links and buttons in the page
    const links = document.querySelectorAll('a[href]');
    const buttons = document.querySelectorAll('button, [role="button"]');
    const pageHTML = document.body.innerHTML.toLowerCase();
    const pageText = document.body.innerText.toLowerCase();

    let detectedPlatform = null;
    let bookingUrl = null;

    // First, check all links for reservation platform URLs
    for (let link of links) {
      const href = link.href.toLowerCase();
      const linkText = link.innerText.toLowerCase();
      const ariaLabel = (link.getAttribute('aria-label') || '').toLowerCase();

      for (let [key, platform] of Object.entries(PLATFORMS)) {
        for (let pattern of platform.patterns) {
          if (href.includes(pattern) || linkText.includes(pattern) || ariaLabel.includes(pattern)) {
            detectedPlatform = platform;
            bookingUrl = link.href;
            console.log('ResoFinder: Found platform via link', platform.name, bookingUrl);
            return { platform: detectedPlatform, url: bookingUrl };
          }
        }
      }
    }

    // Check buttons for reservation text
    for (let button of buttons) {
      const buttonText = button.innerText.toLowerCase();
      const ariaLabel = (button.getAttribute('aria-label') || '').toLowerCase();
      const onclick = (button.getAttribute('onclick') || '').toLowerCase();

      for (let [key, platform] of Object.entries(PLATFORMS)) {
        for (let pattern of platform.patterns) {
          if (buttonText.includes(pattern) || ariaLabel.includes(pattern) || onclick.includes(pattern)) {
            detectedPlatform = platform;
            // Try to find the actual link
            const parentLink = button.closest('a[href]');
            if (parentLink) {
              bookingUrl = parentLink.href;
            }
            console.log('ResoFinder: Found platform via button', platform.name);
            return { platform: detectedPlatform, url: bookingUrl };
          }
        }
      }
    }

    // Check HTML source for platform URLs (sometimes hidden in data attributes)
    for (let [key, platform] of Object.entries(PLATFORMS)) {
      for (let pattern of platform.patterns) {
        if (pageHTML.includes(pattern)) {
          detectedPlatform = platform;
          console.log('ResoFinder: Found platform in HTML', platform.name);
          // Try to extract the URL from HTML
          const urlMatch = pageHTML.match(new RegExp(`https?://[^"'\\s]*${pattern}[^"'\\s]*`, 'i'));
          if (urlMatch) {
            bookingUrl = urlMatch[0].replace(/&amp;/g, '&');
          }
          return { platform: detectedPlatform, url: bookingUrl };
        }
      }
    }

    // Check for phone-only or walk-in (only if no platform found)
    const hasReservationMention = pageText.includes('reservation') ||
                                   pageText.includes('book a table') ||
                                   pageText.includes('make a reservation');

    if (!detectedPlatform && hasReservationMention) {
      console.log('ResoFinder: Defaulting to Call to Reserve');
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
      console.log('ResoFinder: Defaulting to Walk-in Only');
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
      console.log('ResoFinder: Badge inserted in contact section');
    } else {
      // Fallback: try to find phone number or website links
      const phoneLink = document.querySelector('a[href^="tel:"]');
      const websiteLink = document.querySelector('a[href*="biz_redir"]');

      if (phoneLink && phoneLink.parentElement) {
        phoneLink.parentElement.insertBefore(badge, phoneLink.parentElement.firstChild);
        console.log('ResoFinder: Badge inserted near phone');
      } else if (websiteLink && websiteLink.parentElement) {
        websiteLink.parentElement.insertBefore(badge, websiteLink.parentElement.firstChild);
        console.log('ResoFinder: Badge inserted near website');
      } else {
        // Last resort: add near restaurant header
        const restaurantHeader = document.querySelector('h1');
        if (restaurantHeader) {
          restaurantHeader.parentNode.insertBefore(badge, restaurantHeader.nextSibling);
          console.log('ResoFinder: Badge inserted near header (fallback)');
        } else {
          document.body.insertBefore(badge, document.body.firstChild);
          console.log('ResoFinder: Badge inserted at top (last resort)');
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
    const maxAttempts = 5;

    function tryDetect() {
      attempts++;
      console.log(`ResoFinder: Detection attempt ${attempts}/${maxAttempts}`);

      const platformInfo = detectReservationPlatform();
      if (platformInfo) {
        createBadge(platformInfo);
      } else if (attempts < maxAttempts) {
        // Try again in 500ms
        setTimeout(tryDetect, 500);
      }
    }

    // Start detection after initial delay
    setTimeout(tryDetect, 1000);
  }

  init();
})();
