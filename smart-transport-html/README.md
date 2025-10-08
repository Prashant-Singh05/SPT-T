# Smart Public Transport & Ticketing System

A modern, responsive web application for public transportation management and ticketing built with pure HTML, CSS, and JavaScript.

## 🚀 Features

### For Passengers
- **Route Discovery**: Browse all available transportation routes with detailed information
- **Real-time Schedules**: View departure times, arrival times, and current status
- **Ticket Booking**: Purchase digital tickets with QR code generation
- **Student Discounts**: Special pricing for students with valid ID
- **Mobile Responsive**: Optimized for all device sizes

### For Drivers & Admins
- **Admin Dashboard**: Comprehensive management interface with analytics
- **Vehicle Management**: Track vehicle status and maintenance schedules
- **System Logs**: Monitor breakdowns, delays, and maintenance issues
- **Analytics**: Revenue tracking, delay analysis, and performance metrics
- **Role-based Access**: Different interfaces for passengers, drivers, and administrators

## 🛠️ Technical Stack

- **Frontend**: Pure HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Custom CSS with CSS Grid and Flexbox
- **Charts**: Chart.js for analytics visualization
- **QR Codes**: qrcode.js library for ticket generation
- **Data**: JSON files for mock data (ready for backend integration)
- **Icons**: Unicode emojis for modern, lightweight icons

## 📁 Project Structure

```
smart-transport-html/
├── index.html              # Home page
├── routes.html             # Routes listing page
├── schedules.html          # Schedule management page
├── tickets.html            # Ticket booking page
├── admin.html              # Admin dashboard
├── login.html              # Authentication page
├── css/
│   └── style.css           # Main stylesheet
├── js/
│   └── app.js              # Main JavaScript file
├── data/
│   ├── routes.json         # Routes data
│   ├── vehicles.json       # Vehicles data
│   ├── schedules.json      # Schedules data
│   ├── logs.json           # System logs
│   └── analytics.json      # Analytics data
├── assets/                 # Static assets (images, icons)
└── README.md              # This file
```

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- A local web server (optional, for CORS-free development)

### Installation

1. **Clone or download the project**
   ```bash
   git clone <repository-url>
   cd smart-transport-html
   ```

2. **Start a local server** (recommended)
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js (if you have http-server installed)
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```

3. **Open your browser**
   Navigate to `http://localhost:8000` or open `index.html` directly

## 📱 Pages Overview

### 1. Home Page (`index.html`)
- Hero section with search functionality
- Popular routes showcase
- Upcoming departures
- Quick action cards
- Responsive navigation

### 2. Routes Page (`routes.html`)
- Grid view of all available routes
- Search and filter functionality
- Route details with stops information
- Price and status information
- Mobile-responsive design

### 3. Schedules Page (`schedules.html`)
- Table view of departure schedules
- Real-time status indicators
- Vehicle and driver information
- Mobile-responsive card layout
- Advanced filtering options

### 4. Tickets Page (`tickets.html`)
- Ticket booking form with validation
- Passenger type selection (Adult/Student/Senior)
- QR code generation for digital tickets
- Student discount information
- Price calculation with discounts

### 5. Admin Dashboard (`admin.html`)
- **Statistics Cards**: System overview with key metrics
- **Analytics Charts**: Daily delays, ticket sales, revenue trends
- **System Logs**: Real-time monitoring of issues and events
- **Interactive Elements**: Refresh data, add logs, manage system

### 6. Login Page (`login.html`)
- Role-based authentication interface
- Demo credentials for testing
- Visual role selection
- Responsive design
- Session management

## 🎨 Design System

### Color Palette
- **Primary Blue**: #2563eb (Main brand color)
- **Secondary Gray**: #6b7280 (Text and borders)
- **Success Green**: #10b981 (Positive actions)
- **Warning Yellow**: #f59e0b (Warnings)
- **Error Red**: #ef4444 (Errors and alerts)
- **Background**: #f8fafc (Light gray background)

### Typography
- **Font Family**: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
- **Headings**: Bold weights with proper hierarchy
- **Body Text**: Readable line height and spacing
- **Responsive**: Scales appropriately on all devices

### Components
- **Cards**: Consistent shadow and border radius
- **Buttons**: Multiple variants (primary, secondary, success, warning, danger)
- **Forms**: Accessible input components with validation
- **Navigation**: Responsive navbar with active states
- **Tables**: Sortable and filterable data tables

## 📊 Data Structure

The application uses comprehensive JSON data including:

### Routes (`data/routes.json`)
```json
{
  "id": "1",
  "name": "Downtown Express",
  "number": "101",
  "startPoint": "Central Station",
  "endPoint": "Airport Terminal",
  "stops": ["Central Station", "City Hall", "University"],
  "duration": 45,
  "frequency": 15,
  "price": 2.50,
  "isActive": true,
  "type": "bus"
}
```

### Schedules (`data/schedules.json`)
```json
{
  "id": "1",
  "routeId": "1",
  "vehicleId": "1",
  "driverId": "1",
  "departureTime": "08:00",
  "arrivalTime": "08:45",
  "status": "on-time",
  "date": "2024-01-22"
}
```

### Analytics (`data/analytics.json`)
```json
{
  "dailyDelays": [
    { "date": "2024-01-15", "delays": 3 },
    { "date": "2024-01-16", "delays": 1 }
  ],
  "ticketsSold": [
    { "date": "2024-01-15", "tickets": 150 },
    { "date": "2024-01-16", "tickets": 180 }
  ],
  "revenue": [
    { "date": "2024-01-15", "revenue": 375 },
    { "date": "2024-01-16", "revenue": 450 }
  ]
}
```

## 🔧 JavaScript Functionality

### Core Features
- **Dynamic Data Loading**: Fetch data from JSON files using Fetch API
- **Search & Filtering**: Real-time search across routes and schedules
- **Form Validation**: Client-side validation for ticket booking
- **QR Code Generation**: Generate QR codes for digital tickets
- **Chart Integration**: Interactive charts for analytics
- **Responsive Design**: Mobile-first approach with breakpoints

### Key Functions
```javascript
// Load all data from JSON files
async function loadAllData()

// Filter routes based on search criteria
function filterRoutes()

// Generate ticket with QR code
function generateTicket(ticketData)

// Initialize charts for analytics
function initializeCharts()

// Handle form submissions
function handleFormSubmit(e)
```

## 🔌 Backend Integration Points

### API Endpoints (Ready for Implementation)
```javascript
// Authentication
POST /api/auth/login
POST /api/auth/logout
GET /api/auth/me

// Routes
GET /api/routes
GET /api/routes/:id
POST /api/routes
PUT /api/routes/:id

// Schedules
GET /api/schedules
GET /api/schedules/route/:routeId
POST /api/schedules

// Tickets
POST /api/tickets
GET /api/tickets/:id
PUT /api/tickets/:id/validate

// Analytics
GET /api/analytics/revenue
GET /api/analytics/delays
```

### Database Schema (MySQL/PostgreSQL)
```sql
-- Users table
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('passenger', 'driver', 'admin') NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Routes table
CREATE TABLE routes (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  number VARCHAR(10) UNIQUE NOT NULL,
  start_point VARCHAR(255) NOT NULL,
  end_point VARCHAR(255) NOT NULL,
  stops JSON NOT NULL,
  duration INT NOT NULL,
  frequency INT NOT NULL,
  price DECIMAL(5,2) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE
);

-- Schedules table
CREATE TABLE schedules (
  id VARCHAR(36) PRIMARY KEY,
  route_id VARCHAR(36) NOT NULL,
  vehicle_id VARCHAR(36) NOT NULL,
  driver_id VARCHAR(36) NOT NULL,
  departure_time TIME NOT NULL,
  arrival_time TIME NOT NULL,
  status ENUM('on-time', 'delayed', 'cancelled') DEFAULT 'on-time',
  date DATE NOT NULL
);

-- Tickets table
CREATE TABLE tickets (
  id VARCHAR(36) PRIMARY KEY,
  route_id VARCHAR(36) NOT NULL,
  passenger_type ENUM('adult', 'student', 'senior') NOT NULL,
  quantity INT DEFAULT 1,
  price DECIMAL(5,2) NOT NULL,
  qr_code VARCHAR(255) UNIQUE NOT NULL,
  passenger_name VARCHAR(255) NOT NULL,
  passenger_email VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🚀 Deployment

### Static Hosting
- **GitHub Pages**: Free hosting for static sites
- **Netlify**: Automatic deployments from Git
- **Vercel**: Fast global CDN
- **AWS S3**: Scalable cloud storage

### Environment Variables
```env
# API Configuration
API_BASE_URL=https://your-api-domain.com/api
QR_CODE_API_URL=https://your-qr-service.com/generate

# Authentication
JWT_SECRET=your-jwt-secret-key
SESSION_TIMEOUT=3600

# Database
DATABASE_URL=mysql://username:password@localhost:3306/smart_transport
```

## 🔧 Development

### Browser Compatibility
- **Chrome**: 60+
- **Firefox**: 55+
- **Safari**: 12+
- **Edge**: 79+

### Performance Optimization
- **Lazy Loading**: Images and non-critical resources
- **Minification**: CSS and JavaScript files
- **Caching**: Browser caching for static assets
- **Compression**: Gzip compression for text files

### Code Organization
```javascript
// Global variables for data storage
let routesData = [];
let vehiclesData = [];
let schedulesData = [];

// Utility functions
function debounce(func, wait)
function showError(message)
function createRouteCard(route)

// Page-specific functions
function initializeHomePage()
function initializeRoutesPage()
function initializeSchedulesPage()
```

## 📈 Future Enhancements

### Phase 2 Features
- **Real-time Updates**: WebSocket integration for live data
- **Progressive Web App**: Offline functionality and app-like experience
- **Push Notifications**: Real-time alerts for delays and updates
- **Multi-language Support**: Internationalization
- **Accessibility**: WCAG 2.1 compliance

### Phase 3 Features
- **Mobile App**: React Native or Flutter companion
- **Payment Integration**: Stripe/PayPal for online payments
- **GPS Tracking**: Real-time vehicle location
- **AI Integration**: Predictive analytics for maintenance
- **Blockchain**: Secure ticket validation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- **Email**: support@smarttransport.com
- **Documentation**: [docs.smarttransport.com](https://docs.smarttransport.com)
- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)

## 🎯 Demo Credentials

### Login Credentials
- **Passenger**: passenger@demo.com / passenger123
- **Driver**: driver@demo.com / driver123
- **Admin**: admin@demo.com / admin123

### Features to Test
1. **Browse Routes**: Search and filter transportation routes
2. **View Schedules**: Check departure times and status
3. **Book Tickets**: Purchase tickets with QR code generation
4. **Admin Dashboard**: View analytics and manage system logs
5. **Responsive Design**: Test on different screen sizes

---

**Built with ❤️ for modern public transportation**

*This is a frontend-only implementation ready for backend integration. All data is currently stored in JSON files and can be easily replaced with API calls to a backend service.*
