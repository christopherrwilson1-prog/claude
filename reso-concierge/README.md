# Reso Concierge - Reservation Concierge Service

A simple web app for finding hard-to-get restaurant reservations. Human-powered service that lets customers submit requests and you manually find and fulfill them.

## Features

✅ **Customer Landing Page**
- Beautiful, responsive design
- Simple request form
- Clear value proposition and pricing

✅ **Admin Dashboard**
- View all reservation requests
- Real-time stats
- Auto-refreshes every 30 seconds

✅ **Simple Backend**
- Express.js server
- JSON file storage (no database needed for MVP)
- REST API for submissions

## Quick Start

### 1. Install Dependencies

```bash
cd reso-concierge
npm install
```

### 2. Start the Server

```bash
npm start
```

Server runs on http://localhost:3000

### 3. Access the App

- **Customer page:** http://localhost:3000
- **Admin dashboard:** http://localhost:3000/admin

## How to Use

### For Customers:
1. Fill out reservation request form
2. Submit and wait for response (you'll email them)

### For You (Admin):
1. Check http://localhost:3000/admin for new requests
2. Manually search Resy, OpenTable, Tock for the restaurant
3. Email customer with booking link
4. Collect payment ($10) if successful

## Fulfilling Requests

When you get a new request:

1. **Search Platforms:**
   - Go to Resy.com, search for restaurant + date
   - Try OpenTable.com if not on Resy
   - Check Tock.com for high-end restaurants

2. **Email Customer:**
   ```
   Subject: Your reservation at [Restaurant]

   Great news! I found availability at [Restaurant] for [date] at [time].

   Book here: [direct link]

   Please Venmo/Zelle $10 to: [your payment info]

   Thanks!
   ```

3. **If unavailable:**
   ```
   Subject: Update on [Restaurant] reservation

   Unfortunately, no availability found for [date] at [time].

   Alternatives:
   - Different time: [times available]
   - Different date: [dates available]
   - Similar restaurants: [suggestions]

   Let me know if you'd like me to book an alternative!

   (No charge since we couldn't fulfill the exact request)
   ```

## Deployment

### Deploy to Heroku (Free tier):

```bash
# Install Heroku CLI
# Then:
heroku create reso-concierge
git push heroku main
heroku open
```

### Deploy to Vercel/Railway/Render:
- Connect GitHub repo
- Auto-deploys on push

## Pricing Model

**Current:** $10 per successful booking

**Future options:**
- $15/month subscription (unlimited requests)
- $5 deposit + $10 on success
- Premium tier: $25 for same-day bookings

## Scaling

**When you get traction:**
1. Add payment integration (Stripe)
2. Add email notifications (SendGrid/Mailgun)
3. Add authentication for admin
4. Build automation using Puppeteer (from database builder!)
5. Hire assistants to fulfill requests

## File Structure

```
reso-concierge/
├── server.js              # Express server
├── package.json           # Dependencies
├── requests.json          # Stores submissions (auto-created)
└── public/
    ├── index.html         # Landing page
    ├── admin.html         # Admin dashboard
    ├── styles.css         # Styling
    └── app.js             # Form handling
```

## Next Steps

1. **Test it locally** - Submit a few test requests
2. **Deploy** - Get it live (Heroku/Vercel)
3. **Market** - Share link with friends, post on social media
4. **Fulfill requests** - Prove the value proposition
5. **Iterate** - Add features based on feedback

## Support

This is an MVP. Start simple, validate demand, then build automation!
