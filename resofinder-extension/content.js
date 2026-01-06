// ResoFinder - Simple approach

(function() {
  'use strict';

  async function checkPlatforms() {
    // Get restaurant name from h1
    const nameElement = document.querySelector('h1');
    if (!nameElement) {
      console.log('ResoFinder: No restaurant name found');
      return null;
    }

    const restaurantName = nameElement.innerText.trim();
    console.log('ResoFinder: Restaurant name:', restaurantName);

    // Ask background worker to search platforms
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(
        { action: 'searchPlatforms', name: restaurantName },
        (response) => {
          if (chrome.runtime.lastError) {
            console.error('ResoFinder: Error:', chrome.runtime.lastError);
            resolve(null);
          } else {
            console.log('ResoFinder: Response:', response);
            resolve(response);
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
    badge.style.backgroundColor = platformInfo.color;

    const icon = document.createElement('span');
    icon.className = 'resofinder-icon';
    icon.textContent = platformInfo.icon;

    const text = document.createElement('span');
    text.className = 'resofinder-text';
    text.textContent = platformInfo.name;

    badge.appendChild(icon);
    badge.appendChild(text);

    // Make it clickable
    badge.style.cursor = 'pointer';
    badge.addEventListener('click', () => {
      window.open(platformInfo.url, '_blank');
    });
    badge.title = `Click to book`;

    // Insert near contact section
    const contactSection = document.querySelector('[aria-label*="Contact"]') ||
                           document.querySelector('a[href^="tel:"]');

    if (contactSection) {
      if (contactSection.parentElement) {
        contactSection.parentElement.insertBefore(badge, contactSection);
      }
    } else {
      // Fallback: insert near h1
      const h1 = document.querySelector('h1');
      if (h1 && h1.parentNode) {
        h1.parentNode.insertBefore(badge, h1.nextSibling);
      }
    }

    console.log('ResoFinder: Badge created');
  }

  // Main
  async function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    console.log('ResoFinder: Starting...');

    // Wait for page to load
    await new Promise(resolve => setTimeout(resolve, 2000));

    const platformInfo = await checkPlatforms();

    if (platformInfo) {
      createBadge(platformInfo);
    } else {
      console.log('ResoFinder: No platform found');
    }
  }

  init();
})();
