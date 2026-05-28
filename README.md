# Shimla Tourism Website with Admin Panel

A complete tourism website for Shimla with regional guides (Ladakh, Jammu & Kashmir, Northeast) and a full-featured admin panel for managing tours, prices, and discounts.

## 📁 Project Structure

```
shimla-tourism/
├── index.html                 # Main homepage
├── server.js                  # Express backend server
├── package.json              # Node.js dependencies
├── data/
│   └── tours.json           # Tours database
├── admin/
│   ├── login.html           # Admin login page
│   └── dashboard.html       # Admin dashboard
├── pages/
│   ├── places.html          # Dynamic places page (fetches from API)
│   ├── ladakh.html          # Ladakh region with booking form
│   ├── jammu-kashmir.html   # J&K region with booking form
│   ├── northeast.html       # Northeast region with booking form
│   ├── hotels.html
│   ├── how-to-reach.html
│   ├── contact.html
│   └── gallery.html
├── css/
│   └── style.css            # Main stylesheet (includes booking form styles)
├── js/
│   ├── main.js              # Main JavaScript
│   └── api.js               # API helper functions
└── images/
    └── (tourism images)
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the server:**
   ```bash
   npm start
   ```
   The server will start at `http://localhost:3000`

3. **Access the website:**
   - **Website:** http://localhost:3000
   - **Admin Login:** http://localhost:3000/admin/login
   - **Admin Dashboard:** http://localhost:3000/admin/dashboard (after login)

## 🔐 Admin Login Credentials

- **Username:** `admin`
- **Password:** `admin123`

> ⚠️ **Note:** In production, these credentials should be properly secured and stored in an environment file.

## 📋 Admin Panel Features

### Tour Management
- ✅ **View All Tours** - See all tours across all regions
- ✅ **Add New Tour** - Create tours with:
  - Region selection (Shimla, Ladakh, J&K, Northeast)
  - Tour name, category, description
  - Price and discount percentage
  - Duration and location
  - Image URL
  
- ✅ **Edit Tour** - Modify existing tour details including price and discount
- ✅ **Delete Tour** - Remove tours
- ✅ **Statistics** - View total number of tours

### Real-time Updates
- All changes made in the admin panel are immediately visible on the website
- Tours are stored in `data/tours.json`
- Website fetches tours dynamically from the `/api/tours` endpoint

## 🌐 API Endpoints

### Public Endpoints

```
GET /api/tours
  - Returns all tours

GET /api/tours/:id
  - Returns a single tour by ID

GET /api/tours/region/:region
  - Returns tours for a specific region
  - Regions: Shimla, Ladakh, Jammu & Kashmir, Northeast
```

### Admin Endpoints (Requires Auth Token)

```
POST /api/admin/login
  - Login with username and password
  - Returns: token, admin info

POST /api/admin/tours
  - Create a new tour
  - Headers: x-admin-token

PUT /api/admin/tours/:id
  - Update existing tour
  - Headers: x-admin-token

DELETE /api/admin/tours/:id
  - Delete a tour
  - Headers: x-admin-token
```

## 💰 Pricing & Discounts

Each tour can have:
- **Base Price** (in rupees)
- **Discount Percentage** (0-100%)

The website automatically calculates:
- **Final Price** = Base Price - (Base Price × Discount %)

Example: A ₹2,500 tour with 10% discount shows as ₹2,250

## 📱 Responsive Design

The website and admin panel are fully responsive and work on:
- Desktop browsers
- Tablets
- Mobile devices

## 🎨 Features

- **Modern UI** with gradient backgrounds and smooth animations
- **Booking Forms** on region pages with form validation
- **Dynamic Tour Cards** with ratings, discounts, and metadata
- **Filter System** to browse tours by region
- **Admin Dashboard** with intuitive tour management interface
- **Real-time Updates** - No page refresh needed

## 📝 Example Tour Data Structure

```json
{
  "id": 3,
  "region": "Ladakh",
  "name": "Pangong Lake",
  "category": "Nature",
  "description": "Famous for its ever-changing colours...",
  "price": 2500,
  "discount": 5,
  "image": "https://...",
  "rating": 4.9,
  "duration": "Half to full day",
  "location": "4-5 hrs drive from Leh"
}
```

## 🔄 Workflow

1. **Admin logs in** at `/admin/login`
2. **Views all tours** in the dashboard
3. **Creates/edits/deletes** tours
4. **Website automatically updates** via API
5. **Users browse** updated tours on the website
6. **Users see real-time** pricing and discounts

## 🛠️ Customization

### To add a new region:
1. Update `pages/places.html` - Add region button in the filter bar
2. Update `data/tours.json` - Add tours with the new region
3. No admin changes needed - will automatically work

### To modify booking form:
1. Edit `pages/ladakh.html`, `pages/jammu-kashmir.html`, or `pages/northeast.html`
2. Customize the form fields in the booking form section
3. Update the JavaScript handler if needed

### To change admin credentials:
1. Edit `data/tours.json`
2. Update the `adminUsers` array
3. Restart the server

## 📦 Dependencies

- **express** - Web framework
- **body-parser** - Request body parsing
- **cors** - Cross-origin requests
- **fs-extra** - File system utilities

## 🚨 Troubleshooting

### Port already in use
If port 3000 is already in use, edit `server.js` and change:
```javascript
const PORT = 3000;  // Change to 3001, 3002, etc.
```

### Tours not loading
1. Make sure `data/tours.json` exists
2. Check browser console for errors
3. Verify the server is running

### Admin login fails
1. Check `data/tours.json` for correct credentials
2. Clear browser cache and local storage
3. Restart the server

## 📄 License

Open source project for educational purposes.

---

**Made with ❤️ for Shimla Tourism**
