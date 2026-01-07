const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Data storage
const REQUESTS_FILE = 'requests.json';

// Initialize requests file if it doesn't exist
if (!fs.existsSync(REQUESTS_FILE)) {
  fs.writeFileSync(REQUESTS_FILE, JSON.stringify([], null, 2));
}

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/api/requests', (req, res) => {
  const { restaurant, date, time, partySize, name, email, phone, notes } = req.body;

  // Validate required fields
  if (!restaurant || !date || !time || !partySize || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Load existing requests
  const requests = JSON.parse(fs.readFileSync(REQUESTS_FILE, 'utf8'));

  // Create new request
  const newRequest = {
    id: Date.now().toString(),
    restaurant,
    date,
    time,
    partySize,
    name,
    email,
    phone,
    notes,
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  // Save request
  requests.push(newRequest);
  fs.writeFileSync(REQUESTS_FILE, JSON.stringify(requests, null, 2));

  res.json({ success: true, message: 'Request received! We\'ll get back to you within 24 hours.' });
});

// Admin endpoint to view requests
app.get('/admin/requests', (req, res) => {
  const requests = JSON.parse(fs.readFileSync(REQUESTS_FILE, 'utf8'));
  res.json(requests);
});

// Admin page
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.listen(PORT, () => {
  console.log(`Reso Concierge running on http://localhost:${PORT}`);
});
