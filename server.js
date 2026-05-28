const express = require('express');
const path = require('path');
const fs = require('fs-extra');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'tours.json');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// In-memory store (Vercel filesystem is read-only)
let toursData = null;

function readTours() {
  if (!toursData) {
    try {
      toursData = fs.readJsonSync(DATA_FILE);
    } catch (err) {
      toursData = { tours: [], adminUsers: [] };
    }
  }
  return toursData;
}

function writeTours(data) {
  toursData = data;
  try { fs.writeJsonSync(DATA_FILE, data, { spaces: 2 }); } catch (e) {}
  return true;
}

// ─── PUBLIC API ROUTES ───

app.get('/api/tours', (req, res) => {
  res.json(readTours().tours);
});

app.get('/api/tours/region/:region', (req, res) => {
  const tours = readTours().tours.filter(t => t.region === req.params.region);
  res.json(tours);
});

app.get('/api/tours/:id', (req, res) => {
  const tour = readTours().tours.find(t => t.id === parseInt(req.params.id));
  tour ? res.json(tour) : res.status(404).json({ error: 'Tour not found' });
});

// ─── ADMIN ROUTES ───

app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  const admin = readTours().adminUsers.find(u => u.username === username && u.password === password);
  if (admin) {
    res.json({ success: true, token: 'admin_token_' + Date.now(), admin: { id: admin.id, username: admin.username } });
  } else {
    res.status(401).json({ success: false, error: 'Invalid credentials' });
  }
});

function verifyAdminToken(req, res, next) {
  const token = req.headers['x-admin-token'];
  token && token.startsWith('admin_token_') ? next() : res.status(403).json({ error: 'Unauthorized' });
}

app.post('/api/admin/tours', verifyAdminToken, (req, res) => {
  const data = readTours();
  const newTour = {
    id: Math.max(...data.tours.map(t => t.id), 0) + 1,
    region: req.body.region, name: req.body.name, category: req.body.category,
    description: req.body.description, price: parseFloat(req.body.price) || 0,
    discount: parseFloat(req.body.discount) || 0, image: req.body.image,
    rating: 4.5, duration: req.body.duration, location: req.body.location
  };
  data.tours.push(newTour);
  writeTours(data);
  res.json({ success: true, tour: newTour });
});

app.put('/api/admin/tours/:id', verifyAdminToken, (req, res) => {
  const data = readTours();
  const i = data.tours.findIndex(t => t.id === parseInt(req.params.id));
  if (i === -1) return res.status(404).json({ success: false, error: 'Tour not found' });
  data.tours[i] = { ...data.tours[i], ...req.body, id: data.tours[i].id };
  writeTours(data);
  res.json({ success: true, tour: data.tours[i] });
});

app.delete('/api/admin/tours/:id', verifyAdminToken, (req, res) => {
  const data = readTours();
  const i = data.tours.findIndex(t => t.id === parseInt(req.params.id));
  if (i === -1) return res.status(404).json({ success: false, error: 'Tour not found' });
  data.tours.splice(i, 1);
  writeTours(data);
  res.json({ success: true, message: 'Tour deleted' });
});

// ─── HTML PAGES ───

app.get('/admin/login', (req, res) => res.sendFile(path.join(__dirname, 'admin', 'login.html')));
app.get('/admin/dashboard', (req, res) => res.sendFile(path.join(__dirname, 'admin', 'dashboard.html')));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

module.exports = app;
