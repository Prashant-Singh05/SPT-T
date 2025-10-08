/**
 * Smart Transport & Ticketing System - Main JavaScript File
 * Handles all dynamic functionality, data loading, and user interactions
 */

// Global variables for data storage
let routesData = [];
let vehiclesData = [];
let schedulesData = [];
let logsData = [];
let analyticsData = {};

// API endpoints configuration (for future backend integration)
const API_ENDPOINTS = {
    routes: '/api/routes',
    vehicles: '/api/vehicles',
    schedules: '/api/schedules',
    logs: '/api/logs',
    analytics: '/api/analytics',
    tickets: '/api/tickets'
};

/**
 * Initialize the application when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

/**
 * Main application initialization
 */
async function initializeApp() {
    try {
        // Load all data from JSON files
        await loadAllData();
        
        // Initialize current page
        const currentPage = getCurrentPage();
        initializePage(currentPage);
        
        // Set up event listeners
        setupEventListeners();
        
        console.log('Smart Transport App initialized successfully');
    } catch (error) {
        console.error('Error initializing app:', error);
        showError('Failed to load application data. Please refresh the page.');
    }
}

/**
 * Load all data from JSON files
 */
async function loadAllData() {
    try {
        const [routes, vehicles, schedules, logs, analytics] = await Promise.all([
            fetchData('data/routes.json'),
            fetchData('data/vehicles.json'),
            fetchData('data/schedules.json'),
            fetchData('data/logs.json'),
            fetchData('data/analytics.json')
        ]);
        
        routesData = routes;
        vehiclesData = vehicles;
        schedulesData = schedules;
        logsData = logs;
        analyticsData = analytics;
        
        console.log('All data loaded successfully');
    } catch (error) {
        console.error('Error loading data:', error);
        throw error;
    }
}

/**
 * Fetch data from JSON file
 * @param {string} url - URL to fetch data from
 * @returns {Promise} - Promise that resolves to the data
 */
async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching ${url}:`, error);
        throw error;
    }
}

/**
 * Get current page from URL
 * @returns {string} - Current page name
 */
function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop() || 'index.html';
    return page.replace('.html', '');
}

/**
 * Initialize specific page functionality
 * @param {string} page - Page name to initialize
 */
function initializePage(page) {
    switch (page) {
        case 'index':
        case '':
            initializeHomePage();
            break;
        case 'routes':
            initializeRoutesPage();
            break;
        case 'schedules':
            initializeSchedulesPage();
            break;
        case 'tickets':
            initializeTicketsPage();
            break;
        case 'admin':
            initializeAdminPage();
            break;
        case 'login':
            initializeLoginPage();
            break;
        default:
            console.log(`No specific initialization for page: ${page}`);
    }
}

/**
 * Set up global event listeners
 */
function setupEventListeners() {
    // Navigation active state
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Search functionality
    const searchInputs = document.querySelectorAll('.search-input');
    searchInputs.forEach(input => {
        input.addEventListener('input', debounce(handleSearch, 300));
    });
    
    // Form submissions
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', handleFormSubmit);
    });
}

/**
 * Initialize Home Page
 */
function initializeHomePage() {
    displayPopularRoutes();
    displayUpcomingSchedules();
}

/**
 * Display popular routes on home page
 */
function displayPopularRoutes() {
    const container = document.getElementById('popular-routes');
    if (!container) return;
    
    const popularRoutes = routesData.slice(0, 3);
    container.innerHTML = popularRoutes.map(route => createRouteCard(route)).join('');
}

/**
 * Display upcoming schedules on home page
 */
function displayUpcomingSchedules() {
    const container = document.getElementById('upcoming-schedules');
    if (!container) return;
    
    const upcomingSchedules = schedulesData
        .filter(schedule => schedule.status === 'on-time')
        .slice(0, 5);
    
    container.innerHTML = upcomingSchedules.map(schedule => {
        const route = routesData.find(r => r.id === schedule.routeId);
        return createScheduleCard(schedule, route);
    }).join('');
}

/**
 * Initialize Routes Page
 */
function initializeRoutesPage() {
    displayAllRoutes();
    setupRouteFilters();
}

/**
 * Display all routes with filtering and search
 */
function displayAllRoutes() {
    const container = document.getElementById('routes-container');
    if (!container) return;
    
    container.innerHTML = routesData.map(route => createRouteCard(route, true)).join('');
}

/**
 * Set up route filtering functionality
 */
function setupRouteFilters() {
    const searchInput = document.getElementById('route-search');
    const typeFilter = document.getElementById('type-filter');
    const statusFilter = document.getElementById('status-filter');
    
    if (searchInput) {
        searchInput.addEventListener('input', filterRoutes);
    }
    if (typeFilter) {
        typeFilter.addEventListener('change', filterRoutes);
    }
    if (statusFilter) {
        statusFilter.addEventListener('change', filterRoutes);
    }
}

/**
 * Filter routes based on search and filter criteria
 */
function filterRoutes() {
    const searchTerm = document.getElementById('route-search')?.value.toLowerCase() || '';
    const typeFilter = document.getElementById('type-filter')?.value || '';
    const statusFilter = document.getElementById('status-filter')?.value || '';
    
    const filteredRoutes = routesData.filter(route => {
        const matchesSearch = route.name.toLowerCase().includes(searchTerm) ||
                             route.startPoint.toLowerCase().includes(searchTerm) ||
                             route.endPoint.toLowerCase().includes(searchTerm);
        const matchesType = !typeFilter || route.type === typeFilter;
        const matchesStatus = !statusFilter || (statusFilter === 'active' ? route.isActive : !route.isActive);
        
        return matchesSearch && matchesType && matchesStatus;
    });
    
    const container = document.getElementById('routes-container');
    if (container) {
        container.innerHTML = filteredRoutes.map(route => createRouteCard(route, true)).join('');
    }
}

/**
 * Initialize Schedules Page
 */
function initializeSchedulesPage() {
    displaySchedulesTable();
    setupScheduleFilters();
}

/**
 * Display schedules in table format
 */
function displaySchedulesTable() {
    const container = document.getElementById('schedules-table');
    if (!container) return;
    
    const tbody = container.querySelector('tbody');
    if (!tbody) return;
    
    tbody.innerHTML = schedulesData.map(schedule => {
        const route = routesData.find(r => r.id === schedule.routeId);
        const vehicle = vehiclesData.find(v => v.id === schedule.vehicleId);
        return createScheduleRow(schedule, route, vehicle);
    }).join('');
}

/**
 * Set up schedule filtering
 */
function setupScheduleFilters() {
    const searchInput = document.getElementById('schedule-search');
    const routeFilter = document.getElementById('route-filter');
    const statusFilter = document.getElementById('status-filter');
    
    if (searchInput) {
        searchInput.addEventListener('input', filterSchedules);
    }
    if (routeFilter) {
        routeFilter.addEventListener('change', filterSchedules);
    }
    if (statusFilter) {
        statusFilter.addEventListener('change', filterSchedules);
    }
}

/**
 * Filter schedules based on criteria
 */
function filterSchedules() {
    const searchTerm = document.getElementById('schedule-search')?.value.toLowerCase() || '';
    const routeFilter = document.getElementById('route-filter')?.value || '';
    const statusFilter = document.getElementById('status-filter')?.value || '';
    
    const filteredSchedules = schedulesData.filter(schedule => {
        const route = routesData.find(r => r.id === schedule.routeId);
        const matchesSearch = !searchTerm || 
                             route?.name.toLowerCase().includes(searchTerm) ||
                             route?.startPoint.toLowerCase().includes(searchTerm) ||
                             route?.endPoint.toLowerCase().includes(searchTerm);
        const matchesRoute = !routeFilter || schedule.routeId === routeFilter;
        const matchesStatus = !statusFilter || schedule.status === statusFilter;
        
        return matchesSearch && matchesRoute && matchesStatus;
    });
    
    const tbody = document.getElementById('schedules-table')?.querySelector('tbody');
    if (tbody) {
        tbody.innerHTML = filteredSchedules.map(schedule => {
            const route = routesData.find(r => r.id === schedule.routeId);
            const vehicle = vehiclesData.find(v => v.id === schedule.vehicleId);
            return createScheduleRow(schedule, route, vehicle);
        }).join('');
    }
}

/**
 * Initialize Tickets Page
 */
function initializeTicketsPage() {
    setupTicketForm();
    populateRouteOptions();
}

/**
 * Set up ticket booking form
 */
function setupTicketForm() {
    const form = document.getElementById('ticket-form');
    if (!form) return;
    
    form.addEventListener('submit', handleTicketSubmission);
    
    // Passenger type change handler
    const passengerTypeSelect = document.getElementById('passenger-type');
    if (passengerTypeSelect) {
        passengerTypeSelect.addEventListener('change', updateTicketPrice);
    }
    
    // Route selection handler
    const routeSelect = document.getElementById('route-select');
    if (routeSelect) {
        routeSelect.addEventListener('change', updateTicketPrice);
    }
}

/**
 * Populate route options in ticket form
 */
function populateRouteOptions() {
    const routeSelect = document.getElementById('route-select');
    if (!routeSelect) return;
    
    routeSelect.innerHTML = '<option value="">Select a route</option>' +
        routesData.map(route => 
            `<option value="${route.id}" data-price="${route.price}">${route.name} (#${route.number}) - $${route.price}</option>`
        ).join('');
}

/**
 * Update ticket price based on route and passenger type
 */
function updateTicketPrice() {
    const routeSelect = document.getElementById('route-select');
    const passengerTypeSelect = document.getElementById('passenger-type');
    const priceDisplay = document.getElementById('price-display');
    
    if (!routeSelect || !passengerTypeSelect || !priceDisplay) return;
    
    const selectedRoute = routeSelect.options[routeSelect.selectedIndex];
    const basePrice = parseFloat(selectedRoute.dataset.price) || 0;
    const passengerType = passengerTypeSelect.value;
    
    let discount = 1;
    switch (passengerType) {
        case 'student':
            discount = 0.7;
            break;
        case 'senior':
            discount = 0.5;
            break;
        default:
            discount = 1;
    }
    
    const finalPrice = basePrice * discount;
    priceDisplay.textContent = `$${finalPrice.toFixed(2)}`;
}

/**
 * Handle ticket form submission
 */
function handleTicketSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const ticketData = {
        routeId: formData.get('route'),
        passengerType: formData.get('passenger-type'),
        quantity: parseInt(formData.get('quantity')),
        passengerName: formData.get('passenger-name'),
        passengerEmail: formData.get('passenger-email'),
        passengerPhone: formData.get('passenger-phone')
    };
    
    // Generate ticket
    generateTicket(ticketData);
}

/**
 * Generate and display ticket with QR code
 */
function generateTicket(ticketData) {
    const route = routesData.find(r => r.id === ticketData.routeId);
    if (!route) return;
    
    const ticketId = `TKT-${Date.now()}`;
    const qrCodeData = `TICKET-${ticketId}-${ticketData.routeId}`;
    
    // Calculate price
    let discount = 1;
    switch (ticketData.passengerType) {
        case 'student':
            discount = 0.7;
            break;
        case 'senior':
            discount = 0.5;
            break;
    }
    const totalPrice = route.price * discount * ticketData.quantity;
    
    // Create ticket display
    const ticketHTML = `
        <div class="card">
            <div class="card-header">
                <h3>Digital Ticket</h3>
                <p>Smart Transport System</p>
            </div>
            <div class="card-body">
                <div class="grid grid-2">
                    <div>
                        <h4>${route.name}</h4>
                        <p>#${route.number} • ${route.startPoint} → ${route.endPoint}</p>
                        <p><strong>Passenger:</strong> ${ticketData.passengerName}</p>
                        <p><strong>Type:</strong> ${ticketData.passengerType}</p>
                        <p><strong>Quantity:</strong> ${ticketData.quantity}</p>
                        <p><strong>Total Price:</strong> $${totalPrice.toFixed(2)}</p>
                        <p><strong>Ticket ID:</strong> ${ticketId}</p>
                    </div>
                    <div class="text-center">
                        <div id="qrcode"></div>
                        <p class="text-sm">Scan this QR code when boarding</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Show ticket
    const ticketContainer = document.getElementById('ticket-result');
    if (ticketContainer) {
        ticketContainer.innerHTML = ticketHTML;
        ticketContainer.classList.remove('hidden');
        
        // Generate QR code
        if (typeof QRCode !== 'undefined') {
            new QRCode(document.getElementById('qrcode'), {
                text: qrCodeData,
                width: 150,
                height: 150
            });
        }
    }
}

/**
 * Initialize Admin Page
 */
function initializeAdminPage() {
    displayAdminStats();
    displayLogs();
    initializeCharts();
}

/**
 * Display admin statistics
 */
function displayAdminStats() {
    const stats = {
        totalVehicles: vehiclesData.length,
        activeVehicles: vehiclesData.filter(v => v.status === 'active').length,
        totalRoutes: routesData.length,
        activeRoutes: routesData.filter(r => r.isActive).length,
        totalLogs: logsData.length,
        highSeverityLogs: logsData.filter(l => l.severity === 'high').length
    };
    
    // Update stats display
    Object.keys(stats).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            element.textContent = stats[key];
        }
    });
}

/**
 * Display system logs
 */
function displayLogs() {
    const container = document.getElementById('logs-container');
    if (!container) return;
    
    container.innerHTML = logsData.map(log => createLogCard(log)).join('');
}

/**
 * Initialize charts for analytics
 */
function initializeCharts() {
    if (typeof Chart === 'undefined') return;
    
    // Delays Chart
    const delaysCtx = document.getElementById('delays-chart');
    if (delaysCtx && analyticsData.dailyDelays) {
        new Chart(delaysCtx, {
            type: 'line',
            data: {
                labels: analyticsData.dailyDelays.map(d => d.date),
                datasets: [{
                    label: 'Daily Delays',
                    data: analyticsData.dailyDelays.map(d => d.delays),
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    
    // Tickets Chart
    const ticketsCtx = document.getElementById('tickets-chart');
    if (ticketsCtx && analyticsData.ticketsSold) {
        new Chart(ticketsCtx, {
            type: 'bar',
            data: {
                labels: analyticsData.ticketsSold.map(t => t.date),
                datasets: [{
                    label: 'Tickets Sold',
                    data: analyticsData.ticketsSold.map(t => t.tickets),
                    backgroundColor: '#10b981'
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    
    // Revenue Chart
    const revenueCtx = document.getElementById('revenue-chart');
    if (revenueCtx && analyticsData.revenue) {
        new Chart(revenueCtx, {
            type: 'line',
            data: {
                labels: analyticsData.revenue.map(r => r.date),
                datasets: [{
                    label: 'Daily Revenue',
                    data: analyticsData.revenue.map(r => r.revenue),
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

/**
 * Initialize Login Page
 */
function initializeLoginPage() {
    setupLoginForm();
}

/**
 * Set up login form
 */
function setupLoginForm() {
    const form = document.getElementById('login-form');
    if (!form) return;
    
    form.addEventListener('submit', handleLogin);
}

/**
 * Handle login form submission
 */
function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const credentials = {
        email: formData.get('email'),
        password: formData.get('password'),
        role: formData.get('role')
    };
    
    // Simulate login (in real app, this would be an API call)
    if (validateCredentials(credentials)) {
        // Store user session
        sessionStorage.setItem('user', JSON.stringify(credentials));
        
        // Redirect based on role
        switch (credentials.role) {
            case 'admin':
            case 'driver':
                window.location.href = 'admin.html';
                break;
            case 'passenger':
                window.location.href = 'index.html';
                break;
        }
    } else {
        showError('Invalid credentials. Please try again.');
    }
}

/**
 * Validate login credentials (demo function)
 */
function validateCredentials(credentials) {
    // Demo credentials for testing
    const validCredentials = {
        'admin@demo.com': { password: 'admin123', role: 'admin' },
        'driver@demo.com': { password: 'driver123', role: 'driver' },
        'passenger@demo.com': { password: 'passenger123', role: 'passenger' }
    };
    
    const user = validCredentials[credentials.email];
    return user && user.password === credentials.password && user.role === credentials.role;
}

/**
 * Create route card HTML
 */
function createRouteCard(route, showActions = false) {
    const statusClass = route.isActive ? 'badge-success' : 'badge-danger';
    const statusText = route.isActive ? 'Active' : 'Inactive';
    
    return `
        <div class="card">
            <div class="card-header">
                <div class="flex justify-between items-center">
                    <h3>${route.name}</h3>
                    <span class="badge ${statusClass}">${statusText}</span>
                </div>
                <p>#${route.number} • ${route.startPoint} → ${route.endPoint}</p>
            </div>
            <div class="card-body">
                <div class="grid grid-2">
                    <div>
                        <p><strong>Duration:</strong> ${route.duration} minutes</p>
                        <p><strong>Frequency:</strong> Every ${route.frequency} minutes</p>
                        <p><strong>Stops:</strong> ${route.stops.length}</p>
                    </div>
                    <div>
                        <p><strong>Type:</strong> ${route.type}</p>
                        <p><strong>Price:</strong> $${route.price}</p>
                        <p><strong>Status:</strong> ${route.isActive ? 'Operating' : 'Suspended'}</p>
                    </div>
                </div>
                ${showActions ? `
                    <div class="mt-3">
                        <button class="btn btn-primary btn-sm" onclick="viewRouteDetails('${route.id}')">View Details</button>
                        <button class="btn btn-secondary btn-sm" onclick="bookTicket('${route.id}')">Book Ticket</button>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

/**
 * Create schedule card HTML
 */
function createScheduleCard(schedule, route) {
    const statusClass = schedule.status === 'on-time' ? 'badge-success' : 
                       schedule.status === 'delayed' ? 'badge-warning' : 'badge-danger';
    const statusText = schedule.status === 'on-time' ? 'On Time' : 
                      schedule.status === 'delayed' ? `Delayed ${schedule.delayMinutes}m` : 'Cancelled';
    
    return `
        <div class="card">
            <div class="card-header">
                <div class="flex justify-between items-center">
                    <h4>${route?.name || 'Unknown Route'}</h4>
                    <span class="badge ${statusClass}">${statusText}</span>
                </div>
                <p>#${route?.number || 'N/A'} • ${route?.startPoint || 'Unknown'} → ${route?.endPoint || 'Unknown'}</p>
            </div>
            <div class="card-body">
                <div class="grid grid-2">
                    <div>
                        <p><strong>Departure:</strong> ${schedule.departureTime}</p>
                        <p><strong>Arrival:</strong> ${schedule.arrivalTime}</p>
                    </div>
                    <div>
                        <p><strong>Price:</strong> $${route?.price || 'N/A'}</p>
                        <p><strong>Date:</strong> ${schedule.date}</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Create schedule table row HTML
 */
function createScheduleRow(schedule, route, vehicle) {
    const statusClass = schedule.status === 'on-time' ? 'badge-success' : 
                       schedule.status === 'delayed' ? 'badge-warning' : 'badge-danger';
    const statusText = schedule.status === 'on-time' ? 'On Time' : 
                      schedule.status === 'delayed' ? `Delayed ${schedule.delayMinutes}m` : 'Cancelled';
    
    return `
        <tr>
            <td>
                <div>
                    <strong>${route?.name || 'Unknown Route'}</strong>
                    <br>
                    <small>#${route?.number || 'N/A'} • ${route?.startPoint || 'Unknown'} → ${route?.endPoint || 'Unknown'}</small>
                </div>
            </td>
            <td>
                <div>
                    <strong>${vehicle?.number || 'N/A'}</strong>
                    <br>
                    <small>${vehicle?.type || 'Unknown'} • Capacity: ${vehicle?.capacity || 'Unknown'}</small>
                </div>
            </td>
            <td>
                <div>
                    <strong>${vehicle?.driver || 'N/A'}</strong>
                </div>
            </td>
            <td>${schedule.departureTime}</td>
            <td>${schedule.arrivalTime}</td>
            <td><span class="badge ${statusClass}">${statusText}</span></td>
            <td>
                <button class="btn btn-primary btn-sm" onclick="viewScheduleDetails('${schedule.id}')">View</button>
                <button class="btn btn-secondary btn-sm" onclick="bookTicket('${schedule.routeId}')">Book</button>
            </td>
        </tr>
    `;
}

/**
 * Create log card HTML
 */
function createLogCard(log) {
    const severityClass = log.severity === 'high' ? 'badge-danger' : 
                        log.severity === 'medium' ? 'badge-warning' : 'badge-success';
    
    return `
        <div class="card">
            <div class="card-header">
                <div class="flex justify-between items-center">
                    <h4>${log.type.charAt(0).toUpperCase() + log.type.slice(1)}</h4>
                    <span class="badge ${severityClass}">${log.severity.toUpperCase()}</span>
                </div>
            </div>
            <div class="card-body">
                <p>${log.description}</p>
                <p class="text-sm text-gray-600 mt-2">
                    <strong>Timestamp:</strong> ${new Date(log.timestamp).toLocaleString()}
                </p>
            </div>
        </div>
    `;
}

/**
 * Handle search functionality
 */
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const currentPage = getCurrentPage();
    
    switch (currentPage) {
        case 'routes':
            filterRoutes();
            break;
        case 'schedules':
            filterSchedules();
            break;
        default:
            console.log('Search not implemented for this page');
    }
}

/**
 * Handle form submissions
 */
function handleFormSubmit(e) {
    e.preventDefault();
    console.log('Form submitted:', new FormData(e.target));
}

/**
 * Utility function to debounce function calls
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Show error message to user
 */
function showError(message) {
    // Create error notification
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-notification';
    errorDiv.innerHTML = `
        <div class="card" style="background: #fee2e2; border: 1px solid #fca5a5; color: #991b1b;">
            <div class="card-body">
                <strong>Error:</strong> ${message}
            </div>
        </div>
    `;
    
    document.body.insertBefore(errorDiv, document.body.firstChild);
    
    // Remove after 5 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

/**
 * View route details (placeholder for future implementation)
 */
function viewRouteDetails(routeId) {
    const route = routesData.find(r => r.id === routeId);
    if (route) {
        alert(`Route Details:\n${route.name}\nFrom: ${route.startPoint}\nTo: ${route.endPoint}\nPrice: $${route.price}`);
    }
}

/**
 * Book ticket (redirect to tickets page)
 */
function bookTicket(routeId) {
    window.location.href = `tickets.html?route=${routeId}`;
}

/**
 * View schedule details (placeholder for future implementation)
 */
function viewScheduleDetails(scheduleId) {
    const schedule = schedulesData.find(s => s.id === scheduleId);
    if (schedule) {
        alert(`Schedule Details:\nDeparture: ${schedule.departureTime}\nArrival: ${schedule.arrivalTime}\nStatus: ${schedule.status}`);
    }
}

// Export functions for global access
window.viewRouteDetails = viewRouteDetails;
window.bookTicket = bookTicket;
window.viewScheduleDetails = viewScheduleDetails;
