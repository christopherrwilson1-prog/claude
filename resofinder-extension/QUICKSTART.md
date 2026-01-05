# Quick Start Guide - Get Running in 2 Minutes!

## Option 1: Skip Icons (Fastest - 30 seconds)

The extension will work without icons, you just won't see it in your Chrome toolbar.

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top-right)
3. Click "Load unpacked"
4. Select the `resofinder-extension` folder
5. Go to any Yelp restaurant page (try: https://www.yelp.com/biz/republique-los-angeles-2)
6. Look for the colored badge near the restaurant name!

Chrome will show a warning about missing icons - just ignore it.

## Option 2: Add Icons (2 minutes)

1. Download any 3 small PNG images (literally any images - memes, logos, whatever)
2. Rename them to: `icon16.png`, `icon48.png`, `icon128.png`
3. Put them in the `resofinder-extension` folder
4. Follow steps from Option 1 above

## Testing Restaurants

Try these LA restaurants on Yelp to see different platforms detected:

- **Republique** - Should detect Resy
- **Bestia** - Should detect Resy
- **Pizzana** - Should detect OpenTable
- **n/naka** - Should detect Tock

## Troubleshooting

**"Manifest file is missing or unreadable"**
- Make sure you selected the `resofinder-extension` folder, not a parent folder

**No badge appearing?**
- Open DevTools (F12), go to Console tab, look for errors
- Make sure you're on a restaurant's Yelp page (URL has `/biz/` in it)
- Try refreshing the page

**Found a bug?**
- Note which restaurant page it happened on
- Check the Console for errors
- We'll fix it!

## What's Next?

Once it's working:
1. Test it on 10+ different LA restaurants
2. Note which platforms are detected correctly/incorrectly
3. We'll iterate and improve the detection logic
4. Then discuss monetization strategy
