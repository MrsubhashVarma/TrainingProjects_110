const API_BASE_URL = 'http://127.0.0.1:8000';

// ==================== REST API WRAPPERS ====================
async function apiRequest(endpoint, method = 'GET', data = null) {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        }
    };
    if (data) {
        options.body = JSON.stringify(data);
    }
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.message || 'API request failed');
        }
        return await response.json();
    } catch (error) {
        console.error(`Error with ${method} on ${endpoint}:`, error);
        throw error;
    }
}

// 20 REQUIRED CRUD APIS MAPPED DIRECTLY
const PassengersAPI = {
    add: (data) => apiRequest('/passengers/add/', 'POST', data),
    list: () => apiRequest('/passengers/', 'GET'),
    update: (id, data) => apiRequest(`/passengers/update/${id}/`, 'PUT', data),
    delete: (id) => apiRequest(`/passengers/delete/${id}/`, 'DELETE')
};

const ShipsAPI = {
    add: (data) => apiRequest('/ships/add/', 'POST', data),
    list: () => apiRequest('/ships/', 'GET'),
    update: (id, data) => apiRequest(`/ships/update/${id}/`, 'PUT', data),
    delete: (id) => apiRequest(`/ships/delete/${id}/`, 'DELETE')
};

const SchedulesAPI = {
    add: (data) => apiRequest('/schedules/add/', 'POST', data),
    list: () => apiRequest('/schedules/', 'GET'),
    update: (id, data) => apiRequest(`/schedules/update/${id}/`, 'PUT', data),
    delete: (id) => apiRequest(`/schedules/delete/${id}/`, 'DELETE')
};

const BookingsAPI = {
    add: (data) => apiRequest('/bookings/add/', 'POST', data),
    list: () => apiRequest('/bookings/', 'GET'),
    update: (id, data) => apiRequest(`/bookings/update/${id}/`, 'PUT', data),
    delete: (id) => apiRequest(`/bookings/delete/${id}/`, 'DELETE')
};

const PaymentsAPI = {
    add: (data) => apiRequest('/payments/add/', 'POST', data),
    list: () => apiRequest('/payments/', 'GET'),
    update: (id, data) => apiRequest(`/payments/update/${id}/`, 'PUT', data),
    delete: (id) => apiRequest(`/payments/delete/${id}/`, 'DELETE')
};

// ==================== STATE MANAGEMENT ====================
function getCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
}

function setCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
}

function logout() {
    localStorage.removeItem('currentUser');
    sessionStorage.clear();
    window.location.href = 'index.html';
}

// ==================== THEME MANAGEMENT ====================
function initTheme() {
    const theme = localStorage.getItem('theme') || 'dark';
    document.body.classList.remove('light-mode', 'dark-mode');
    document.body.classList.add(theme + '-mode');
}

function toggleTheme() {
    const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.body.classList.remove(currentTheme + '-mode');
    document.body.classList.add(newTheme + '-mode');
    localStorage.setItem('theme', newTheme);
    
    // Update theme button icon
    const themeIcon = document.querySelector('.theme-toggle i');
    if (themeIcon) {
        themeIcon.className = newTheme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    }
}

// ==================== DYNAMIC NAVIGATION & FOOTER ====================
function renderHeaderAndFooter() {
    const headerContainer = document.getElementById('header-container');
    const footerContainer = document.getElementById('footer-container');
    const user = getCurrentUser();
    const currentTheme = localStorage.getItem('theme') || 'dark';
    const themeIconClass = currentTheme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';

    // Get current filename to highlight active page
    const path = window.location.pathname;
    const pageName = path.substring(path.lastIndexOf('/') + 1);

    if (headerContainer) {
        let navItemsHTML = `
            <li><a href="index.html" class="${pageName === 'index.html' || pageName === '' ? 'active' : ''}">Home</a></li>
            <li><a href="ships.html" class="${pageName === 'ships.html' ? 'active' : ''}">Search Journeys</a></li>
        `;

        if (user) {
            if (user.role === 'admin') {
                navItemsHTML += `
                    <li><a href="admin_dashboard.html" class="${pageName === 'admin_dashboard.html' ? 'active' : ''}">Admin Panel</a></li>
                `;
            } else {
                navItemsHTML += `
                    <li><a href="booking_history.html" class="${pageName === 'booking_history.html' ? 'active' : ''}">Bookings</a></li>
                    <li><a href="passenger_dashboard.html" class="${pageName === 'passenger_dashboard.html' ? 'active' : ''}">Dashboard</a></li>
                `;
            }
            navItemsHTML += `
                <li style="margin-left: 1rem; font-weight: 600; color: var(--accent);">
                    <i class="fa-solid fa-user"></i> ${user.full_name}
                </li>
                <li><button onclick="logout()" class="btn-logout" title="Logout"><i class="fa-solid fa-right-from-bracket"></i></button></li>
            `;
        } else {
            navItemsHTML += `
                <li><a href="login.html" class="${pageName === 'login.html' ? 'active' : ''}">Login</a></li>
                <li><a href="register.html" class="${pageName === 'register.html' ? 'active' : ''}" style="background-color: var(--primary); color: white; padding: 0.4rem 1rem; border-radius: 6px;">Register</a></li>
            `;
        }

        headerContainer.innerHTML = `
            <header>
                <div class="navbar">
                    <a href="index.html" class="nav-brand">
                        <i class="fa-solid fa-ship"></i> OceanVoyage
                    </a>
                    <nav style="display: flex; align-items: center; gap: 1.5rem;">
                        <ul class="nav-links">
                            ${navItemsHTML}
                        </ul>
                        <button onclick="toggleTheme()" class="theme-toggle" title="Toggle Theme">
                            <i class="${themeIconClass}"></i>
                        </button>
                    </nav>
                </div>
            </header>
        `;
    }

    if (footerContainer) {
        footerContainer.innerHTML = `
            <footer>
                <div style="max-width: 1200px; margin: 0 auto; display: flex; flex-direction: column; gap: 1rem;">
                    <div>
                        <a href="index.html" class="nav-brand" style="justify-content: center; margin-bottom: 0.5rem;">
                            <i class="fa-solid fa-ship"></i> OceanVoyage Cruises
                        </a>
                        <p style="font-size: 0.85rem;">Luxury cruise booking, cargo transportation, and island passenger ferry connections.</p>
                    </div>
                    <div style="border-top: 1px solid var(--border-dark); padding-top: 1rem; font-size: 0.8rem; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
                        <p>&copy; 2026 OceanVoyage Inc. All rights reserved.</p>
                        <p>Developed with Django, SQLite & Fetch API</p>
                    </div>
                </div>
            </footer>
        `;
    }
}

// ==================== IN-PAGE INITIALIZATION ROUTINES ====================
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    renderHeaderAndFooter();

    const path = window.location.pathname;
    const pageName = path.substring(path.lastIndexOf('/') + 1);

    // Page Route Guards
    const user = getCurrentUser();
    const protectedPassengerPages = ['booking.html', 'payment.html', 'booking_history.html', 'passenger_dashboard.html'];
    const protectedAdminPages = ['admin_dashboard.html'];

    if (protectedPassengerPages.includes(pageName) && !user) {
        window.location.href = 'login.html';
        return;
    }
    if (protectedAdminPages.includes(pageName) && (!user || user.role !== 'admin')) {
        window.location.href = 'login.html';
        return;
    }

    // Initialize specific pages
    if (pageName === 'index.html' || pageName === '') {
        initHomePage();
    } else if (pageName === 'ships.html') {
        initShipsPage();
    } else if (pageName === 'ship_details.html') {
        initShipDetailsPage();
    } else if (pageName === 'booking.html') {
        initBookingPage();
    } else if (pageName === 'payment.html') {
        initPaymentPage();
    } else if (pageName === 'booking_history.html') {
        initBookingHistoryPage();
    } else if (pageName === 'passenger_dashboard.html') {
        initPassengerDashboard();
    } else if (pageName === 'admin_dashboard.html') {
        initAdminDashboard();
    }
});

// ==================== PAGE CONTROLLERS ====================

// 1. Home Page Control
async function initHomePage() {
    // Search form handling
    const searchForm = document.getElementById('search-journey-form');
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const source = document.getElementById('source-port').value;
            const dest = document.getElementById('dest-port').value;
            const date = document.getElementById('departure-date').value;

            sessionStorage.setItem('search_source', source);
            sessionStorage.setItem('search_destination', dest);
            sessionStorage.setItem('search_date', date);

            window.location.href = 'ships.html';
        });
    }

    // Dynamically render 3 active cruise ships as featured
    try {
        const ships = await ShipsAPI.list();
        const featuredContainer = document.getElementById('featured-cruises');
        if (featuredContainer) {
            const activeCruises = ships.filter(s => s.ship_type === 'Cruise Ship' && s.status === 'Active').slice(0, 3);
            if (activeCruises.length === 0) {
                featuredContainer.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted-dark);">No featured cruises available at the moment.</p>`;
                return;
            }
            featuredContainer.innerHTML = activeCruises.map(ship => `
                <div class="card">
                    <div class="card-img-container">
                        <div class="card-img-placeholder" style="background-image: url('https://images.unsplash.com/photo-1548574505-5e239809ee19?w=600&auto=format&fit=crop&q=80')"></div>
                        <span class="card-badge btn-accent" style="background-color: var(--accent);">${ship.ship_type}</span>
                    </div>
                    <div class="card-body">
                        <h3 class="card-title">${ship.ship_name}</h3>
                        <p class="card-desc">Operated by ${ship.operator_name}. Experience premium ocean traversal with maximum passenger capacity of ${ship.capacity} travelers.</p>
                        <div class="card-meta">
                            <div>
                                <i class="fa-solid fa-users" style="color: var(--primary);"></i> Capacity: ${ship.capacity}
                            </div>
                            <button onclick="viewShipDetailsDirect('${ship.ship_name}')" class="btn btn-primary" style="padding: 0.4rem 1rem; font-size: 0.85rem;">View Journey</button>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    } catch (e) {
        console.error("Error loading featured cruises:", e);
    }
}

function viewShipDetailsDirect(shipName) {
    sessionStorage.setItem('selected_ship_name', shipName);
    window.location.href = 'ships.html';
}

// 2. Ships / Route Listings Page Control
async function initShipsPage() {
    const listContainer = document.getElementById('ships-list');
    if (!listContainer) return;

    const sourceFilter = sessionStorage.getItem('search_source');
    const destFilter = sessionStorage.getItem('search_destination');
    const dateFilter = sessionStorage.getItem('search_date');

    // Show active search banner if filtered
    const filterBanner = document.getElementById('filter-banner');
    if (filterBanner && sourceFilter && destFilter) {
        filterBanner.innerHTML = `
            <div style="background-color: rgba(2, 132, 199, 0.1); padding: 1rem; border-radius: 8px; border: 1px solid var(--primary); display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                <div>
                    <i class="fa-solid fa-circle-info" style="color: var(--primary);"></i> Filtered journeys from <strong>${sourceFilter}</strong> to <strong>${destFilter}</strong> ${dateFilter ? `on <strong>${dateFilter}</strong>` : ''}
                </div>
                <button onclick="clearSearchFilters()" class="btn btn-secondary" style="padding: 0.25rem 0.75rem; font-size: 0.8rem;">Clear Filter</button>
            </div>
        `;
    }

    try {
        const schedules = await SchedulesAPI.list();
        const ships = await ShipsAPI.list();

        // Create dictionary of ships for quick detail fetches
        const shipsMap = {};
        ships.forEach(s => { shipsMap[s.ship_name] = s; });

        let filteredSchedules = schedules;

        // Apply filters
        if (sourceFilter) {
            filteredSchedules = filteredSchedules.filter(s => s.source_port.toLowerCase().includes(sourceFilter.toLowerCase()));
        }
        if (destFilter) {
            filteredSchedules = filteredSchedules.filter(s => s.destination_port.toLowerCase().includes(destFilter.toLowerCase()));
        }
        if (dateFilter) {
            filteredSchedules = filteredSchedules.filter(s => s.departure_date === dateFilter);
        }

        if (filteredSchedules.length === 0) {
            listContainer.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 4rem 2rem;">
                    <i class="fa-regular fa-compass" style="font-size: 3rem; color: var(--text-muted-dark); margin-bottom: 1rem;"></i>
                    <p style="font-size: 1.1rem; color: var(--text-muted-dark);">No journeys found matching your search. Try broadening your criteria.</p>
                </div>
            `;
            return;
        }

        listContainer.innerHTML = filteredSchedules.map(sch => {
            const ship = shipsMap[sch.ship_name] || { ship_type: 'Cruise Ship', capacity: 1000 };
            return `
                <div class="card">
                    <div class="card-img-container">
                        <div class="card-img-placeholder" style="background-image: url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80')"></div>
                        <span class="card-badge btn-primary">${ship.ship_type}</span>
                    </div>
                    <div class="card-body">
                        <h3 class="card-title">${sch.ship_name}</h3>
                        <p style="font-size: 0.9rem; color: var(--accent); font-weight: 600; margin-bottom: 1rem;">
                            <i class="fa-solid fa-location-dot"></i> ${sch.source_port} &rarr; ${sch.destination_port}
                        </p>
                        <div style="display: flex; flex-direction: column; gap: 0.4rem; font-size: 0.85rem; margin-bottom: 1.25rem;">
                            <div><i class="fa-regular fa-calendar-days"></i> Departs: ${sch.departure_date} at ${sch.departure_time.substring(0,5)}</div>
                            <div><i class="fa-regular fa-clock"></i> Arrives: ${sch.arrival_date} at ${sch.arrival_time.substring(0,5)}</div>
                            <div><i class="fa-solid fa-users"></i> Capacity: ${ship.capacity} passengers</div>
                        </div>
                        <div class="card-meta">
                            <div class="card-price">&#8377; ${sch.fare.toLocaleString('en-IN')}</div>
                            <button onclick="goToDetails('${sch.schedule_id}')" class="btn btn-accent">View Details</button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    } catch (e) {
        console.error("Error fetching schedules or ships:", e);
    }
}

function clearSearchFilters() {
    sessionStorage.removeItem('search_source');
    sessionStorage.removeItem('search_destination');
    sessionStorage.removeItem('search_date');
    window.location.reload();
}

function goToDetails(scheduleId) {
    sessionStorage.setItem('selected_schedule_id', scheduleId);
    window.location.href = 'ship_details.html';
}

// 3. Ship Details Page Control
async function initShipDetailsPage() {
    const scheduleId = sessionStorage.getItem('selected_schedule_id');
    const detailsContainer = document.getElementById('details-container');
    if (!scheduleId || !detailsContainer) {
        window.location.href = 'ships.html';
        return;
    }

    try {
        const schedules = await SchedulesAPI.list();
        const schedule = schedules.find(s => s.schedule_id == scheduleId);
        if (!schedule) {
            detailsContainer.innerHTML = `<p>Schedule not found.</p>`;
            return;
        }

        const ships = await ShipsAPI.list();
        const ship = ships.find(s => s.ship_name === schedule.ship_name) || { ship_type: 'Cruise Ship', capacity: 1000, operator_name: 'Unknown', status: 'Active' };

        // Render details HTML
        detailsContainer.innerHTML = `
            <div class="details-grid">
                <div>
                    <div class="details-gallery" style="background-image: url('https://images.unsplash.com/photo-1548574505-5e239809ee19?w=1200&auto=format&fit=crop&q=80')"></div>
                    
                    <div class="info-card">
                        <h2 style="font-size: 1.75rem; margin-bottom: 1rem;"><i class="fa-solid fa-ship"></i> Journey Schedule details</h2>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem;">
                            <div>
                                <h4 style="color: var(--accent); margin-bottom: 0.25rem;">Source Port</h4>
                                <p style="font-size: 1.1rem; font-weight: 600;">${schedule.source_port}</p>
                                <p style="font-size: 0.85rem; color: var(--text-muted-dark);">${schedule.departure_date} at ${schedule.departure_time.substring(0,5)}</p>
                            </div>
                            <div>
                                <h4 style="color: var(--accent); margin-bottom: 0.25rem;">Destination Port</h4>
                                <p style="font-size: 1.1rem; font-weight: 600;">${schedule.destination_port}</p>
                                <p style="font-size: 0.85rem; color: var(--text-muted-dark);">${schedule.arrival_date} at ${schedule.arrival_time.substring(0,5)}</p>
                            </div>
                        </div>
                    </div>

                    <div class="info-card">
                        <h2 style="font-size: 1.75rem; margin-bottom: 1rem;"><i class="fa-solid fa-circle-info"></i> Ship Information</h2>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1.5rem; font-size: 0.95rem;">
                            <div><strong>Vessel Name:</strong><br>${ship.ship_name}</div>
                            <div><strong>Type:</strong><br>${ship.ship_type}</div>
                            <div><strong>Capacity:</strong><br>${ship.capacity} passengers</div>
                            <div><strong>Operator:</strong><br>${ship.operator_name}</div>
                        </div>
                    </div>
                </div>

                <div>
                    <div class="info-card" style="position: sticky; top: 100px;">
                        <h3 style="font-size: 1.5rem; border-bottom: 1px solid var(--border-dark); padding-bottom: 1rem; margin-bottom: 1rem;">Booking Summary</h3>
                        <div style="display: flex; flex-direction: column; gap: 1rem; font-size: 0.95rem; margin-bottom: 2rem;">
                            <div style="display: flex; justify-content: space-between;">
                                <span>Base Ticket Fare:</span>
                                <strong style="color: var(--accent); font-size: 1.1rem;">&#8377; ${schedule.fare.toLocaleString('en-IN')}</strong>
                            </div>
                            <div style="display: flex; justify-content: space-between;">
                                <span>Route:</span>
                                <span>${schedule.source_port.split(' ')[0]} to ${schedule.destination_port.split(' ')[0]}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between;">
                                <span>Departure Date:</span>
                                <span>${schedule.departure_date}</span>
                            </div>
                        </div>
                        
                        <div class="info-card" style="padding: 1rem; font-size: 0.85rem; border-color: rgba(20, 184, 166, 0.2); background-color: rgba(20, 184, 166, 0.03); margin-bottom: 1.5rem;">
                            <strong style="color: var(--accent);"><i class="fa-solid fa-tags"></i> Included Cabin Types:</strong>
                            <ul style="margin-left: 1.25rem; margin-top: 0.5rem; display: flex; flex-direction: column; gap: 0.25rem;">
                                <li>Economy (Base Fare)</li>
                                <li>Deluxe (+&#8377; 3,500)</li>
                                <li>Suite (Base + 50%)</li>
                                <li>Family Cabin (+&#8377; 5,000)</li>
                                <li>VIP Cabin (Base + 100%)</li>
                            </ul>
                        </div>

                        <button onclick="proceedToBooking('${schedule.schedule_id}')" class="btn btn-primary btn-block"><i class="fa-regular fa-calendar-check"></i> Book Now</button>
                    </div>
                </div>
            </div>
        `;
    } catch (e) {
        console.error("Error loading ship details:", e);
    }
}

function proceedToBooking(scheduleId) {
    sessionStorage.setItem('selected_schedule_id', scheduleId);
    window.location.href = 'booking.html';
}

// 4. Booking Page Control
async function initBookingPage() {
    const scheduleId = sessionStorage.getItem('selected_schedule_id');
    const user = getCurrentUser();

    if (!scheduleId || !user) {
        window.location.href = 'ships.html';
        return;
    }

    try {
        const schedules = await SchedulesAPI.list();
        const schedule = schedules.find(s => s.schedule_id == scheduleId);
        if (!schedule) {
            alert('Journey details not found!');
            window.location.href = 'ships.html';
            return;
        }

        // Fill passenger details
        document.getElementById('passenger-name').value = user.full_name;
        document.getElementById('passenger-email').value = user.email;
        document.getElementById('passenger-phone').value = user.phone || '9876543210';
        document.getElementById('passenger-nationality').value = user.nationality || 'Indian';

        // Calculate and update prices dynamically
        const baseFare = schedule.fare;
        const cabinSelect = document.getElementById('cabin-type');
        const summaryJourney = document.getElementById('summary-journey');
        const summaryBase = document.getElementById('summary-base');
        const summaryCabin = document.getElementById('summary-cabin');
        const summaryTotal = document.getElementById('summary-total');

        if (summaryJourney) {
            summaryJourney.innerHTML = `<strong>${schedule.ship_name}</strong><br>${schedule.source_port} to ${schedule.destination_port}<br>Date: ${schedule.departure_date}`;
        }

        function calculateFare() {
            const cabin = cabinSelect.value;
            let cabinAdd = 0;
            let total = baseFare;

            if (cabin === 'Deluxe') {
                cabinAdd = 3500;
            } else if (cabin === 'Suite') {
                cabinAdd = baseFare * 0.5;
            } else if (cabin === 'Family Cabin') {
                cabinAdd = 5000;
            } else if (cabin === 'VIP Cabin') {
                cabinAdd = baseFare;
            }

            total = baseFare + cabinAdd;

            if (summaryBase) summaryBase.innerText = `₹ ${baseFare.toLocaleString('en-IN')}`;
            if (summaryCabin) summaryCabin.innerText = cabinAdd > 0 ? `+ ₹ ${cabinAdd.toLocaleString('en-IN')}` : 'Included';
            if (summaryTotal) summaryTotal.innerText = `₹ ${total.toLocaleString('en-IN')}`;

            return total;
        }

        cabinSelect.addEventListener('change', calculateFare);
        let finalFare = calculateFare();

        // Handle Confirm Booking Button Click
        const bookingForm = document.getElementById('booking-form');
        if (bookingForm) {
            bookingForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                finalFare = calculateFare();
                
                const bookingPayload = {
                    passenger_name: user.full_name,
                    ship_name: schedule.ship_name,
                    cabin_type: cabinSelect.value,
                    journey_date: schedule.departure_date,
                    source_port: schedule.source_port,
                    destination_port: schedule.destination_port,
                    total_amount: finalFare,
                    booking_status: 'Confirmed'
                };

                try {
                    const result = await BookingsAPI.add(bookingPayload);
                    if (result.status === 'success') {
                        // Store the booking ID for payment
                        sessionStorage.setItem('pending_booking_id', result.data.booking_id);
                        sessionStorage.setItem('pending_booking_amount', finalFare);
                        sessionStorage.setItem('pending_booking_passenger', user.full_name);
                        
                        window.location.href = 'payment.html';
                    } else {
                        alert('Booking Registration Failed: ' + result.message);
                    }
                } catch (err) {
                    alert('An error occurred during booking. Please try again.');
                }
            });
        }

    } catch (e) {
        console.error("Booking page init error:", e);
    }
}

// 5. Payment Page Control
function initPaymentPage() {
    const bookingId = sessionStorage.getItem('pending_booking_id');
    const amount = sessionStorage.getItem('pending_booking_amount');
    const passengerName = sessionStorage.getItem('pending_booking_passenger');

    if (!bookingId || !amount) {
        window.location.href = 'passenger_dashboard.html';
        return;
    }

    const payAmountEl = document.getElementById('payment-amount');
    const bookingIdEl = document.getElementById('payment-booking-id');
    if (payAmountEl) payAmountEl.innerText = `₹ ${parseFloat(amount).toLocaleString('en-IN')}`;
    if (bookingIdEl) bookingIdEl.innerText = bookingId;

    const paymentForm = document.getElementById('payment-form');
    if (paymentForm) {
        paymentForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const method = document.getElementById('payment-method').value;
            const txnId = 'TXN' + Math.floor(100000000 + Math.random() * 900000000);
            
            // Format current date as YYYY-MM-DD
            const today = new Date().toISOString().split('T')[0];

            const paymentPayload = {
                booking_id: parseInt(bookingId),
                passenger_name: passengerName,
                amount: parseFloat(amount),
                payment_method: method,
                payment_status: 'Success',
                transaction_id: txnId,
                payment_date: today
            };

            try {
                const result = await PaymentsAPI.add(paymentPayload);
                if (result.status === 'success') {
                    // Update the booking status in the backend as Confirmed or paid
                    // Clear pending payment states
                    sessionStorage.removeItem('pending_booking_id');
                    sessionStorage.removeItem('pending_booking_amount');
                    sessionStorage.removeItem('pending_booking_passenger');

                    alert('Payment Completed Successfully! Transaction ID: ' + txnId);
                    window.location.href = 'booking_history.html';
                } else {
                    alert('Payment logs registry failed: ' + result.message);
                }
            } catch (err) {
                alert('Connection to transaction portal failed.');
            }
        });
    }
}

// 6. Booking History Page Control
async function initBookingHistoryPage() {
    const user = getCurrentUser();
    const listUpcoming = document.getElementById('upcoming-trips');
    const listCompleted = document.getElementById('completed-trips');

    if (!user || !listUpcoming || !listCompleted) return;

    try {
        const bookings = await BookingsAPI.list();
        const payments = await PaymentsAPI.list();

        // Filter bookings belonging to this passenger
        const passengerBookings = bookings.filter(b => b.passenger_name === user.full_name);
        
        // Find payment status for each booking
        const bookingPaymentStatus = {};
        payments.forEach(p => {
            if (p.passenger_name === user.full_name) {
                bookingPaymentStatus[p.booking_id] = p.payment_status;
            }
        });

        const todayStr = new Date().toISOString().split('T')[0];

        const upcoming = passengerBookings.filter(b => b.journey_date >= todayStr && b.booking_status !== 'Cancelled');
        const completed = passengerBookings.filter(b => b.journey_date < todayStr || b.booking_status === 'Cancelled');

        // Upcoming trips rendering
        if (upcoming.length === 0) {
            listUpcoming.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted-dark);">No upcoming trips registered.</td></tr>`;
        } else {
            listUpcoming.innerHTML = upcoming.map(b => {
                const payStatus = bookingPaymentStatus[b.booking_id] || 'Pending';
                const payStatusClass = payStatus === 'Success' ? 'badge-success' : 'badge-warning';
                
                return `
                    <tr>
                        <td>#${b.booking_id}</td>
                        <td>${b.ship_name}</td>
                        <td>${b.source_port.split(' ')[0]} &rarr; ${b.destination_port.split(' ')[0]}</td>
                        <td>${b.journey_date}</td>
                        <td>${b.cabin_type}</td>
                        <td><span class="badge badge-success">${b.booking_status}</span></td>
                        <td><span class="badge ${payStatusClass}">${payStatus}</span></td>
                        <td>
                            ${payStatus !== 'Success' ? `<button onclick="payPendingBooking(${b.booking_id}, ${b.total_amount}, '${b.passenger_name}')" class="btn btn-accent" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">Pay</button>` : ''}
                            <button onclick="cancelBooking(${b.booking_id})" class="btn btn-secondary" style="padding: 0.25rem 0.5rem; font-size: 0.75rem; color: #ef4444;">Cancel</button>
                        </td>
                    </tr>
                `;
            }).join('');
        }

        // Completed/Cancelled trips rendering
        if (completed.length === 0) {
            listCompleted.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted-dark);">No completed trip logs.</td></tr>`;
        } else {
            listCompleted.innerHTML = completed.map(b => {
                const payStatus = bookingPaymentStatus[b.booking_id] || 'Failed';
                const statusClass = b.booking_status === 'Cancelled' ? 'badge-danger' : 'badge-success';
                const payStatusClass = payStatus === 'Success' ? 'badge-success' : 'badge-danger';
                return `
                    <tr>
                        <td>#${b.booking_id}</td>
                        <td>${b.ship_name}</td>
                        <td>${b.source_port.split(' ')[0]} &rarr; ${b.destination_port.split(' ')[0]}</td>
                        <td>${b.journey_date}</td>
                        <td>${b.cabin_type}</td>
                        <td><span class="badge ${statusClass}">${b.booking_status}</span></td>
                        <td><span class="badge ${payStatusClass}">${payStatus}</span></td>
                    </tr>
                `;
            }).join('');
        }

    } catch (e) {
        console.error("Error loading booking history:", e);
    }
}

function payPendingBooking(id, amount, name) {
    sessionStorage.setItem('pending_booking_id', id);
    sessionStorage.setItem('pending_booking_amount', amount);
    sessionStorage.setItem('pending_booking_passenger', name);
    window.location.href = 'payment.html';
}

async function cancelBooking(id) {
    if (!confirm('Are you sure you want to cancel this trip?')) return;
    try {
        const bookings = await BookingsAPI.list();
        const targetBooking = bookings.find(b => b.booking_id === id);
        if (targetBooking) {
            targetBooking.booking_status = 'Cancelled';
            const result = await BookingsAPI.update(id, targetBooking);
            if (result.status === 'success') {
                alert('Trip booking cancelled successfully.');
                window.location.reload();
            } else {
                alert('Cancellation Failed: ' + result.message);
            }
        }
    } catch (e) {
        alert('Could not cancel booking.');
    }
}

// 7. Passenger Dashboard Control
async function initPassengerDashboard() {
    const user = getCurrentUser();
    if (!user) return;

    try {
        const bookings = await BookingsAPI.list();
        const payments = await PaymentsAPI.list();

        const pBookings = bookings.filter(b => b.passenger_name === user.full_name);
        const pPayments = payments.filter(p => p.passenger_name === user.full_name);

        const todayStr = new Date().toISOString().split('T')[0];

        const upcomingCount = pBookings.filter(b => b.journey_date >= todayStr && b.booking_status === 'Confirmed').length;
        const completedCount = pBookings.filter(b => b.journey_date < todayStr && b.booking_status === 'Confirmed').length;
        const cancelledCount = pBookings.filter(b => b.booking_status === 'Cancelled').length;

        // Render statistics cards
        const bookingsCountEl = document.getElementById('dash-total-bookings');
        const upcomingCountEl = document.getElementById('dash-upcoming');
        const completedCountEl = document.getElementById('dash-completed');
        const spentEl = document.getElementById('dash-spent');

        if (bookingsCountEl) bookingsCountEl.innerText = pBookings.length;
        if (upcomingCountEl) upcomingCountEl.innerText = upcomingCount;
        if (completedCountEl) completedCountEl.innerText = completedCount;
        
        const totalSpent = pPayments.filter(p => p.payment_status === 'Success').reduce((sum, current) => sum + current.amount, 0);
        if (spentEl) spentEl.innerText = `₹ ${totalSpent.toLocaleString('en-IN')}`;

        // Render payment history table
        const paymentBody = document.getElementById('dash-payment-history');
        if (paymentBody) {
            if (pPayments.length === 0) {
                paymentBody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted-dark);">No transaction history records.</td></tr>`;
            } else {
                paymentBody.innerHTML = pPayments.slice(0, 5).map(pay => `
                    <tr>
                        <td>#${pay.payment_id}</td>
                        <td>#${pay.booking_id}</td>
                        <td>${pay.payment_date}</td>
                        <td>${pay.payment_method}</td>
                        <td><strong style="color: var(--accent);">₹ ${pay.amount.toLocaleString('en-IN')}</strong></td>
                        <td><span class="badge badge-success">${pay.payment_status}</span></td>
                    </tr>
                `).join('');
            }
        }
    } catch (e) {
        console.error("Error loading Passenger dashboard stats:", e);
    }
}


// 8. Admin Dashboard Control (Substantial Management Logic)
let currentAdminTab = 'passengers';

function showAdminTab(tabName) {
    currentAdminTab = tabName;
    
    // Toggle active link styles
    document.querySelectorAll('.sidebar-menu a').forEach(el => {
        el.classList.remove('active');
        if (el.getAttribute('onclick').includes(tabName)) {
            el.classList.add('active');
        }
    });

    // Toggle panels
    document.querySelectorAll('.admin-panel-content').forEach(el => {
        el.style.display = 'none';
    });
    const activePanel = document.getElementById(`panel-${tabName}`);
    if (activePanel) {
        activePanel.style.display = 'block';
    }

    // Load data
    loadAdminTab(tabName);
}

async function loadAdminTab(tabName) {
    const tableBody = document.getElementById(`admin-table-${tabName}`);
    if (!tableBody) return;

    tableBody.innerHTML = `<tr><td colspan="10" style="text-align: center; padding: 2rem;"><i class="fa-solid fa-spinner fa-spin"></i> Loading resources...</td></tr>`;

    try {
        if (tabName === 'passengers') {
            const data = await PassengersAPI.list();
            if (data.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center;">No passenger accounts registered.</td></tr>`;
                return;
            }
            tableBody.innerHTML = data.map(p => `
                <tr>
                    <td>#${p.passenger_id}</td>
                    <td>${p.full_name}</td>
                    <td>${p.email}</td>
                    <td>${p.phone}</td>
                    <td>${p.nationality}</td>
                    <td>${p.passport_number}</td>
                    <td>
                        <button onclick="openEditPassengerModal(${p.passenger_id}, '${p.full_name.replace(/'/g, "\\'")}', '${p.email}', '${p.phone}', '${p.nationality}', '${p.passport_number}', '${p.password}')" class="btn btn-primary" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;"><i class="fa-solid fa-pen-to-square"></i></button>
                        <button onclick="deleteResource('passenger', ${p.passenger_id})" class="btn btn-secondary" style="padding: 0.25rem 0.5rem; font-size: 0.75rem; color: #ef4444;"><i class="fa-solid fa-trash"></i></button>
                    </td>
                </tr>
            `).join('');
        }
        else if (tabName === 'ships') {
            const data = await ShipsAPI.list();
            if (data.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center;">No ships in database.</td></tr>`;
                return;
            }
            tableBody.innerHTML = data.map(s => {
                let badgeClass = 'badge-success';
                if (s.status === 'Maintenance') badgeClass = 'badge-warning';
                else if (s.status === 'Inactive') badgeClass = 'badge-danger';
                return `
                    <tr>
                        <td>#${s.ship_id}</td>
                        <td>${s.ship_name}</td>
                        <td>${s.ship_type}</td>
                        <td>${s.capacity}</td>
                        <td>${s.operator_name}</td>
                        <td><span class="badge ${badgeClass}">${s.status}</span></td>
                        <td>
                            <button onclick="openEditShipModal(${s.ship_id}, '${s.ship_name.replace(/'/g, "\\'")}', '${s.ship_type}', ${s.capacity}, '${s.operator_name.replace(/'/g, "\\'")}', '${s.status}')" class="btn btn-primary" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;"><i class="fa-solid fa-pen-to-square"></i></button>
                            <button onclick="deleteResource('ship', ${s.ship_id})" class="btn btn-secondary" style="padding: 0.25rem 0.5rem; font-size: 0.75rem; color: #ef4444;"><i class="fa-solid fa-trash"></i></button>
                        </td>
                    </tr>
                `;
            }).join('');
        }
        else if (tabName === 'schedules') {
            const data = await SchedulesAPI.list();
            if (data.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="10" style="text-align: center;">No schedules added yet.</td></tr>`;
                return;
            }
            tableBody.innerHTML = data.map(sc => `
                <tr>
                    <td>#${sc.schedule_id}</td>
                    <td>${sc.ship_name}</td>
                    <td>${sc.source_port}</td>
                    <td>${sc.destination_port}</td>
                    <td>${sc.departure_date} (${sc.departure_time.substring(0,5)})</td>
                    <td>${sc.arrival_date} (${sc.arrival_time.substring(0,5)})</td>
                    <td>₹ ${sc.fare.toLocaleString('en-IN')}</td>
                    <td>
                        <button onclick="openEditScheduleModal(${sc.schedule_id}, '${sc.ship_name.replace(/'/g, "\\'")}', '${sc.source_port.replace(/'/g, "\\'")}', '${sc.destination_port.replace(/'/g, "\\'")}', '${sc.departure_date}', '${sc.departure_time}', '${sc.arrival_date}', '${sc.arrival_time}', ${sc.fare})" class="btn btn-primary" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;"><i class="fa-solid fa-pen-to-square"></i></button>
                        <button onclick="deleteResource('schedule', ${sc.schedule_id})" class="btn btn-secondary" style="padding: 0.25rem 0.5rem; font-size: 0.75rem; color: #ef4444;"><i class="fa-solid fa-trash"></i></button>
                    </td>
                </tr>
            `).join('');
        }
        else if (tabName === 'bookings') {
            const data = await BookingsAPI.list();
            if (data.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="10" style="text-align: center;">No bookings recorded.</td></tr>`;
                return;
            }
            tableBody.innerHTML = data.map(b => {
                let badgeClass = 'badge-success';
                if (b.booking_status === 'Waiting') badgeClass = 'badge-warning';
                else if (b.booking_status === 'Cancelled') badgeClass = 'badge-danger';
                return `
                    <tr>
                        <td>#${b.booking_id}</td>
                        <td>${b.passenger_name}</td>
                        <td>${b.ship_name}</td>
                        <td>${b.source_port.split(' ')[0]} &rarr; ${b.destination_port.split(' ')[0]}</td>
                        <td>${b.journey_date}</td>
                        <td>${b.cabin_type}</td>
                        <td>₹ ${b.total_amount.toLocaleString('en-IN')}</td>
                        <td><span class="badge ${badgeClass}">${b.booking_status}</span></td>
                        <td>
                            <button onclick="openEditBookingModal(${b.booking_id}, '${b.passenger_name.replace(/'/g, "\\'")}', '${b.ship_name.replace(/'/g, "\\'")}', '${b.cabin_type}', '${b.journey_date}', '${b.source_port.replace(/'/g, "\\'")}', '${b.destination_port.replace(/'/g, "\\'")}', ${b.total_amount}, '${b.booking_status}')" class="btn btn-primary" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;"><i class="fa-solid fa-pen-to-square"></i></button>
                            <button onclick="deleteResource('booking', ${b.booking_id})" class="btn btn-secondary" style="padding: 0.25rem 0.5rem; font-size: 0.75rem; color: #ef4444;"><i class="fa-solid fa-trash"></i></button>
                        </td>
                    </tr>
                `;
            }).join('');
        }
        else if (tabName === 'payments') {
            const data = await PaymentsAPI.list();
            if (data.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="9" style="text-align: center;">No transaction records found.</td></tr>`;
                return;
            }
            tableBody.innerHTML = data.map(pay => {
                let statusClass = 'badge-success';
                if (pay.payment_status === 'Pending') statusClass = 'badge-warning';
                else if (pay.payment_status === 'Failed') statusClass = 'badge-danger';
                return `
                    <tr>
                        <td>#${pay.payment_id}</td>
                        <td>#${pay.booking_id}</td>
                        <td>${pay.passenger_name}</td>
                        <td>₹ ${pay.amount.toLocaleString('en-IN')}</td>
                        <td>${pay.payment_method}</td>
                        <td><span class="badge ${statusClass}">${pay.payment_status}</span></td>
                        <td><code>${pay.transaction_id}</code></td>
                        <td>${pay.payment_date}</td>
                        <td>
                            <button onclick="openEditPaymentModal(${pay.payment_id}, ${pay.booking_id}, '${pay.passenger_name.replace(/'/g, "\\'")}', ${pay.amount}, '${pay.payment_method}', '${pay.payment_status}', '${pay.transaction_id}', '${pay.payment_date}')" class="btn btn-primary" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;"><i class="fa-solid fa-pen-to-square"></i></button>
                            <button onclick="deleteResource('payment', ${pay.payment_id})" class="btn btn-secondary" style="padding: 0.25rem 0.5rem; font-size: 0.75rem; color: #ef4444;"><i class="fa-solid fa-trash"></i></button>
                        </td>
                    </tr>
                `;
            }).join('');
        }
    } catch (e) {
        tableBody.innerHTML = `<tr><td colspan="10" style="text-align: center; color: var(--text-muted-dark);">Error linking to server. Ensure Backend server is operational.</td></tr>`;
    }
}

// Global modal triggers
function openModal(modalId) {
    document.getElementById(modalId).classList.add('open');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('open');
    // Clear forms inside modal
    const form = document.querySelector(`#${modalId} form`);
    if (form) form.reset();
}

// Delete logic
async function deleteResource(type, id) {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;
    try {
        let result;
        if (type === 'passenger') result = await PassengersAPI.delete(id);
        else if (type === 'ship') result = await ShipsAPI.delete(id);
        else if (type === 'schedule') result = await SchedulesAPI.delete(id);
        else if (type === 'booking') result = await BookingsAPI.delete(id);
        else if (type === 'payment') result = await PaymentsAPI.delete(id);

        if (result.status === 'success') {
            alert('Item deleted successfully.');
            loadAdminTab(currentAdminTab);
        } else {
            alert('Deletion failed: ' + result.message);
        }
    } catch (e) {
        alert('Server returned an error.');
    }
}

function initAdminDashboard() {
    showAdminTab('passengers');

    // Add and Edit Forms Listeners setup
    setupFormSubmitter('form-passenger', PassengersAPI, 'passenger');
    setupFormSubmitter('form-ship', ShipsAPI, 'ship');
    setupFormSubmitter('form-schedule', SchedulesAPI, 'schedule');
    setupFormSubmitter('form-booking', BookingsAPI, 'booking');
    setupFormSubmitter('form-payment', PaymentsAPI, 'payment');
}

function setupFormSubmitter(formId, apiObject, typeName) {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = {};
        formData.forEach((val, key) => {
            if (val !== "") data[key] = val;
        });

        // Specific field conversions
        if (data.capacity) data.capacity = parseInt(data.capacity);
        if (data.fare) data.fare = parseFloat(data.fare);
        if (data.amount) data.amount = parseFloat(data.amount);
        if (data.booking_id) data.booking_id = parseInt(data.booking_id);
        
        // Handle ID field
        const idField = form.querySelector('[name$="_id_pk"]');
        const isEdit = idField && idField.value !== "";

        try {
            let result;
            if (isEdit) {
                const id = idField.value;
                result = await apiObject.update(id, data);
            } else {
                result = await apiObject.add(data);
            }

            if (result.status === 'success') {
                alert(`${typeName.charAt(0).toUpperCase() + typeName.slice(1)} saved successfully!`);
                closeModal(`modal-${typeName}`);
                loadAdminTab(currentAdminTab);
            } else {
                alert('Save failed: ' + result.message);
            }
        } catch (err) {
            alert('A connection error occurred.');
        }
    });
}

// ----------------- MODAL AUTOFILTER / EDIT PREFILLS -----------------
function openAddPassengerModal() {
    document.getElementById('passenger-modal-title').innerText = 'Add Passenger';
    document.getElementById('passenger_id_pk').value = '';
    openModal('modal-passenger');
}

function openEditPassengerModal(id, fullName, email, phone, nationality, passportNumber, password) {
    document.getElementById('passenger-modal-title').innerText = 'Edit Passenger';
    document.getElementById('passenger_id_pk').value = id;
    document.getElementById('pass-id-field').value = id;
    document.getElementById('pass-name-field').value = fullName;
    document.getElementById('pass-email-field').value = email;
    document.getElementById('pass-phone-field').value = phone;
    document.getElementById('pass-nationality-field').value = nationality;
    document.getElementById('pass-passport-field').value = passportNumber;
    document.getElementById('pass-password-field').value = password;
    openModal('modal-passenger');
}

function openAddShipModal() {
    document.getElementById('ship-modal-title').innerText = 'Add Ship';
    document.getElementById('ship_id_pk').value = '';
    openModal('modal-ship');
}

function openEditShipModal(id, name, type, cap, operator, status) {
    document.getElementById('ship-modal-title').innerText = 'Edit Ship';
    document.getElementById('ship_id_pk').value = id;
    document.getElementById('ship-id-field').value = id;
    document.getElementById('ship-name-field').value = name;
    document.getElementById('ship-type-field').value = type;
    document.getElementById('ship-capacity-field').value = cap;
    document.getElementById('ship-operator-field').value = operator;
    document.getElementById('ship-status-field').value = status;
    openModal('modal-ship');
}

function openAddScheduleModal() {
    document.getElementById('schedule-modal-title').innerText = 'Add Schedule';
    document.getElementById('schedule_id_pk').value = '';
    openModal('modal-schedule');
}

function openEditScheduleModal(id, shipName, source, dest, depDate, depTime, arrDate, arrTime, fare) {
    document.getElementById('schedule-modal-title').innerText = 'Edit Schedule';
    document.getElementById('schedule_id_pk').value = id;
    document.getElementById('sch-id-field').value = id;
    document.getElementById('sch-ship-field').value = shipName;
    document.getElementById('sch-source-field').value = source;
    document.getElementById('sch-dest-field').value = dest;
    document.getElementById('sch-depdate-field').value = depDate;
    document.getElementById('sch-deptime-field').value = depTime;
    document.getElementById('sch-arrdate-field').value = arrDate;
    document.getElementById('sch-arrtime-field').value = arrTime;
    document.getElementById('sch-fare-field').value = fare;
    openModal('modal-schedule');
}

function openAddBookingModal() {
    document.getElementById('booking-modal-title').innerText = 'Add Booking';
    document.getElementById('booking_id_pk').value = '';
    openModal('modal-booking');
}

function openEditBookingModal(id, passengerName, shipName, cabin, date, source, dest, total, status) {
    document.getElementById('booking-modal-title').innerText = 'Edit Booking';
    document.getElementById('booking_id_pk').value = id;
    document.getElementById('book-id-field').value = id;
    document.getElementById('book-passenger-field').value = passengerName;
    document.getElementById('book-ship-field').value = shipName;
    document.getElementById('book-cabin-field').value = cabin;
    document.getElementById('book-date-field').value = date;
    document.getElementById('book-source-field').value = source;
    document.getElementById('book-dest-field').value = dest;
    document.getElementById('book-total-field').value = total;
    document.getElementById('book-status-field').value = status;
    openModal('modal-booking');
}

function openAddPaymentModal() {
    document.getElementById('payment-modal-title').innerText = 'Add Payment';
    document.getElementById('payment_id_pk').value = '';
    openModal('modal-payment');
}

function openEditPaymentModal(id, bookingId, passenger, amount, method, status, txn, date) {
    document.getElementById('payment-modal-title').innerText = 'Edit Payment';
    document.getElementById('payment_id_pk').value = id;
    document.getElementById('pay-id-field').value = id;
    document.getElementById('pay-booking-field').value = bookingId;
    document.getElementById('pay-passenger-field').value = passenger;
    document.getElementById('pay-amount-field').value = amount;
    document.getElementById('pay-method-field').value = method;
    document.getElementById('pay-status-field').value = status;
    document.getElementById('pay-txn-field').value = txn;
    document.getElementById('pay-date-field').value = date;
    openModal('modal-payment');
}
