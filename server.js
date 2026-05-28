const express = require('express');
const path = require('path');
const fs = require('fs-extra');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data', 'tours.json');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// Helper: Read tours data
function readTours() {
  try {
    const data = fs.readJsonSync(DATA_FILE);
    return data;
  } catch (err) {
    console.error('Error reading tours.json:', err);
    return { tours: [], adminUsers: [] };
  }
}

// Helper: Write tours data
function writeTours(data) {
  try {
    fs.writeJsonSync(DATA_FILE, data, { spaces: 2 });
    return true;
  } catch (err) {
    console.error('Error writing tours.json:', err);
    return false;
  }
}

// ─── PUBLIC API ROUTES ───

// Get all tours
app.get('/api/tours', (req, res) => {
  const data = readTours();
  res.json(data.tours);
});

// Get tours by region
app.get('/api/tours/region/:region', (req, res) => {
  const data = readTours();
  const tours = data.tours.filter(t => t.region === req.params.region);
  res.json(tours);
});

// Get single tour by ID
app.get('/api/tours/:id', (req, res) => {
  const data = readTours();
  const tour = data.tours.find(t => t.id === parseInt(req.params.id));
  if (tour) {
    res.json(tour);
  } else {
    res.status(404).json({ error: 'Tour not found' });
  }
});

// ─── ADMIN AUTH ROUTES ───

// Admin login
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  const data = readTours();
  const admin = data.adminUsers.find(u => u.username === username && u.password === password);
  
  if (admin) {
    res.json({ 
      success: true, 
      token: 'admin_token_' + Date.now(),
      admin: { id: admin.id, username: admin.username, email: admin.email }
    });
  } else {
    res.status(401).json({ success: false, error: 'Invalid credentials' });
  }
});

// Verify admin token (simple verification)
function verifyAdminToken(req, res, next) {
  const token = req.headers['x-admin-token'];
  if (token && token.startsWith('admin_token_')) {
    next();
  } else {
    res.status(403).json({ error: 'Unauthorized' });
  }
}

// ─── ADMIN TOUR MANAGEMENT ROUTES ───

// Create new tour
app.post('/api/admin/tours', verifyAdminToken, (req, res) => {
  const data = readTours();
  const newTour = {
    id: Math.max(...data.tours.map(t => t.id), 0) + 1,
    region: req.body.region,
    name: req.body.name,
    category: req.body.category,
    description: req.body.description,
    price: parseFloat(req.body.price) || 0,
    discount: parseFloat(req.body.discount) || 0,
    image: req.body.image,
    rating: 4.5,
    duration: req.body.duration,
    location: req.body.location
  };
  
  data.tours.push(newTour);
  if (writeTours(data)) {
    res.json({ success: true, tour: newTour });
  } else {
    res.status(500).json({ success: false, error: 'Failed to create tour' });
  }
});

// Update tour
app.put('/api/admin/tours/:id', verifyAdminToken, (req, res) => {
  const data = readTours();
  const tourIndex = data.tours.findIndex(t => t.id === parseInt(req.params.id));
  
  if (tourIndex === -1) {
    return res.status(404).json({ success: false, error: 'Tour not found' });
  }
  
  data.tours[tourIndex] = {
    ...data.tours[tourIndex],
    region: req.body.region || data.tours[tourIndex].region,
    name: req.body.name || data.tours[tourIndex].name,
    category: req.body.category || data.tours[tourIndex].category,
    description: req.body.description || data.tours[tourIndex].description,
    price: req.body.price !== undefined ? parseFloat(req.body.price) : data.tours[tourIndex].price,
    discount: req.body.discount !== undefined ? parseFloat(req.body.discount) : data.tours[tourIndex].discount,
    image: req.body.image || data.tours[tourIndex].image,
    duration: req.body.duration || data.tours[tourIndex].duration,
    location: req.body.location || data.tours[tourIndex].location
  };
  
  if (writeTours(data)) {
    res.json({ success: true, tour: data.tours[tourIndex] });
  } else {
    res.status(500).json({ success: false, error: 'Failed to update tour' });
  }
});

// Delete tour
app.delete('/api/admin/tours/:id', verifyAdminToken, (req, res) => {
  const data = readTours();
  const tourIndex = data.tours.findIndex(t => t.id === parseInt(req.params.id));
  
  if (tourIndex === -1) {
    return res.status(404).json({ success: false, error: 'Tour not found' });
  }
  
  data.tours.splice(tourIndex, 1);
  if (writeTours(data)) {
    res.json({ success: true, message: 'Tour deleted' });
  } else {
    res.status(500).json({ success: false, error: 'Failed to delete tour' });
  }
});

// Serve admin panel pages
app.get('/admin/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'login.html'));
});

app.get('/admin/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'dashboard.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🏔️ Shimla Tourism Server running at http://localhost:${PORT}`);
  console.log(`📱 Admin Panel: http://localhost:${PORT}/admin/login`);
  console.log(`🌐 Website: http://localhost:${PORT}`);
});
