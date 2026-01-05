# ResoFinder Chrome Extension

Instantly see which platform (Resy, OpenTable, Tock, etc.) a restaurant uses for reservations while browsing Yelp.

## How It Works

- Automatically detects reservation platforms when you visit a Yelp restaurant page
- Shows a colored badge with the platform name (Resy, OpenTable, Tock, SevenRooms)
- Click the badge to open the booking page directly
- No manual database - it reads the page in real-time!

## Installation (Development Mode)

1. **Download/clone this folder** to your computer

2. **Add icon images** (temporary step - you can skip for now):
   - The extension needs 3 icon files: `icon16.png`, `icon48.png`, `icon128.png`
   - For testing, you can create simple placeholder icons or download any small PNG images and rename them
   - Place them in the `resofinder-extension` folder

3. **Load the extension in Chrome**:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right corner)
   - Click "Load unpacked"
   - Select the `resofinder-extension` folder
   - The extension is now installed!

4. **Test it**:
   - Go to Yelp and search for a restaurant in LA
   - Open a restaurant page (e.g., https://www.yelp.com/biz/republique-los-angeles-2)
   - You should see a colored badge appear near the restaurant name showing the reservation platform

## Platforms Detected

- **Resy** (red badge 🍽️)
- **OpenTable** (red badge 📅)
- **Tock** (teal badge 🎫)
- **SevenRooms** (black badge 🔑)
- **Call for Reservations** (gray badge 📞) - when reservations mentioned but no platform detected
- **Walk-in Only** (light gray badge 🚶) - when no reservation system found

## Known Limitations

**Works only with direct Yelp integration:**
- The extension can only detect reservation platforms that are directly linked on the Yelp page
- Some restaurants require you to visit their website first to find the booking platform
- Example: If a restaurant only shows "Visit Website" on Yelp, the extension will show "Call for Reservations" instead

This is working as designed - the extension reads what's actually on the Yelp page in real-time, without maintaining a database.

## Files Explained

- `manifest.json` - Chrome extension configuration
- `content.js` - The main script that detects platforms and creates the badge
- `styles.css` - Styling for the badge
- `README.md` - This file!

## Next Steps

- Test on 10-20 different LA restaurants to see accuracy
- Add more platforms if needed
- Improve detection logic based on edge cases
- Design proper icons
- Consider monetization strategy

## Troubleshooting

**Badge not appearing?**
- Make sure you're on a Yelp restaurant page (URL should contain `/biz/`)
- Check the Chrome DevTools console for errors (right-click page → Inspect → Console tab)
- Try refreshing the page

**Wrong platform detected?**
- This can happen if the restaurant mentions multiple platforms
- Let me know which restaurant and I'll improve the detection logic

## Development

Want to modify the code? Edit the files and then:
1. Go to `chrome://extensions/`
2. Click the refresh icon on the ResoFinder extension
3. Reload the Yelp page to see changes
