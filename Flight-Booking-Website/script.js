/* ============================================
   ✈️ Vimaan Airways — Flight Booking JavaScript
   ============================================ */

// ── Flight Data ──
const flightsData = [
  { id: 1, airline: "Vimaan Airways Air", code: "SV", flightNo: "SV-101", from: "DEL", fromCity: "New Delhi", to: "DXB", toCity: "Dubai", departure: "06:00", arrival: "08:30", duration: "4h 30m", stops: 0, price: 15200, seats: 42, aircraft: "Boeing 787", terminal: "T3", gate: "G12", baggage: "30 kg", meal: true, wifi: true },
  { id: 2, airline: "IndiaWings", code: "IW", flightNo: "IW-205", from: "BOM", fromCity: "Mumbai", to: "SIN", toCity: "Singapore", departure: "10:15", arrival: "18:45", duration: "5h 30m", stops: 0, price: 18500, seats: 28, aircraft: "Airbus A350", terminal: "T2", gate: "G7", baggage: "25 kg", meal: true, wifi: true },
  { id: 3, airline: "AeroConnect", code: "AC", flightNo: "AC-310", from: "DEL", fromCity: "New Delhi", to: "LHR", toCity: "London", departure: "22:00", arrival: "04:30", duration: "9h 30m", stops: 0, price: 32000, seats: 15, aircraft: "Boeing 777", terminal: "T3", gate: "G22", baggage: "35 kg", meal: true, wifi: true },
  { id: 4, airline: "FlyEast", code: "FE", flightNo: "FE-412", from: "BLR", fromCity: "Bangalore", to: "CDG", toCity: "Paris", departure: "14:30", arrival: "22:00", duration: "10h 30m", stops: 1, price: 28500, seats: 33, aircraft: "Airbus A380", terminal: "T1", gate: "G15", baggage: "30 kg", meal: true, wifi: false },
  { id: 5, airline: "Vimaan Airways Air", code: "SV", flightNo: "SV-520", from: "DEL", fromCity: "New Delhi", to: "JFK", toCity: "New York", departure: "01:30", arrival: "07:00", duration: "15h 30m", stops: 1, price: 45000, seats: 8, aircraft: "Boeing 787", terminal: "T3", gate: "G18", baggage: "35 kg", meal: true, wifi: true },
  { id: 6, airline: "PacificJet", code: "PJ", flightNo: "PJ-630", from: "BOM", fromCity: "Mumbai", to: "NRT", toCity: "Tokyo", departure: "23:45", arrival: "12:15", duration: "8h 30m", stops: 0, price: 35200, seats: 20, aircraft: "Boeing 777", terminal: "T2", gate: "G9", baggage: "30 kg", meal: true, wifi: true },
  { id: 7, airline: "IndiaWings", code: "IW", flightNo: "IW-740", from: "DEL", fromCity: "New Delhi", to: "BKK", toCity: "Bangkok", departure: "08:00", arrival: "13:30", duration: "4h 30m", stops: 0, price: 12800, seats: 55, aircraft: "Airbus A320", terminal: "T3", gate: "G5", baggage: "25 kg", meal: true, wifi: false },
  { id: 8, airline: "AeroConnect", code: "AC", flightNo: "AC-855", from: "BLR", fromCity: "Bangalore", to: "SYD", toCity: "Sydney", departure: "16:00", arrival: "06:30", duration: "11h 30m", stops: 1, price: 42000, seats: 12, aircraft: "Airbus A350", terminal: "T1", gate: "G20", baggage: "35 kg", meal: true, wifi: true },
  { id: 9, airline: "FlyEast", code: "FE", flightNo: "FE-960", from: "CCU", fromCity: "Kolkata", to: "DXB", toCity: "Dubai", departure: "11:00", arrival: "14:00", duration: "5h 00m", stops: 0, price: 14200, seats: 38, aircraft: "Boeing 737", terminal: "T1", gate: "G3", baggage: "25 kg", meal: true, wifi: false },
  { id: 10, airline: "Vimaan Airways Air", code: "SV", flightNo: "SV-111", from: "DEL", fromCity: "New Delhi", to: "SIN", toCity: "Singapore", departure: "03:00", arrival: "11:00", duration: "5h 30m", stops: 0, price: 17500, seats: 30, aircraft: "Boeing 787", terminal: "T3", gate: "G14", baggage: "30 kg", meal: true, wifi: true },
  { id: 11, airline: "PacificJet", code: "PJ", flightNo: "PJ-222", from: "BOM", fromCity: "Mumbai", to: "LHR", toCity: "London", departure: "20:30", arrival: "02:00", duration: "9h 30m", stops: 0, price: 30500, seats: 22, aircraft: "Boeing 777", terminal: "T2", gate: "G11", baggage: "35 kg", meal: true, wifi: true },
  { id: 12, airline: "AeroConnect", code: "AC", flightNo: "AC-333", from: "HYD", fromCity: "Hyderabad", to: "BKK", toCity: "Bangkok", departure: "07:15", arrival: "12:45", duration: "4h 00m", stops: 0, price: 11500, seats: 60, aircraft: "Airbus A320", terminal: "T1", gate: "G2", baggage: "25 kg", meal: true, wifi: false },
];

const airportsList = [
  { code: "DEL", city: "New Delhi", name: "Indira Gandhi International" },
  { code: "BOM", city: "Mumbai", name: "Chhatrapati Shivaji Maharaj" },
  { code: "BLR", city: "Bangalore", name: "Kempegowda International" },
  { code: "CCU", city: "Kolkata", name: "Netaji Subhas Chandra Bose" },
  { code: "HYD", city: "Hyderabad", name: "Rajiv Gandhi International" },
  { code: "DXB", city: "Dubai", name: "Dubai International" },
  { code: "SIN", city: "Singapore", name: "Changi Airport" },
  { code: "LHR", city: "London", name: "Heathrow Airport" },
  { code: "CDG", city: "Paris", name: "Charles de Gaulle" },
  { code: "JFK", city: "New York", name: "John F. Kennedy" },
  { code: "NRT", city: "Tokyo", name: "Narita International" },
  { code: "BKK", city: "Bangkok", name: "Suvarnabhumi Airport" },
  { code: "SYD", city: "Sydney", name: "Kingsford Smith" },
];

const offersData = [
  { id: 1, title: "Student Discount", description: "Get 15% off on all domestic and international flights. Valid student ID required at check-in.", discount: "15% OFF", icon: "🎓", code: "STUDENT15", expiry: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) },
  { id: 2, title: "Festival Special", description: "Celebrate with amazing deals! Flat ₹2000 off on round-trip bookings during the festive season.", discount: "₹2000 OFF", icon: "🎉", code: "FESTIVE2K", expiry: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) },
  { id: 3, title: "Family Package", description: "Book for 4 or more passengers and get 20% discount on total fare. Makes family travel affordable.", discount: "20% OFF", icon: "👨‍👩‍👧‍👦", code: "FAMILY20", expiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
  { id: 4, title: "Credit Card Offer", description: "Pay with partner credit cards and enjoy up to 10% cashback. Maximum cashback ₹3000.", discount: "10% CASHBACK", icon: "💳", code: "CCBACK10", expiry: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) },
  { id: 5, title: "Early Bird Discount", description: "Book 30 days in advance and save 25% on base fare. Plan ahead and save more!", discount: "25% OFF", icon: "🐦", code: "EARLY25", expiry: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000) },
];

const reviewsData = [
  { name: "Aisha Patel", location: "Mumbai, India", rating: 5, review: "Incredible experience! The booking process was seamless and the flight was perfect. Will definitely use Vimaan Airways again for all my travels.", avatar: "AP" },
  { name: "James Wilson", location: "London, UK", rating: 5, review: "Best flight booking platform I've used. The seat selection feature is brilliant and the prices are very competitive. Highly recommended!", avatar: "JW" },
  { name: "Sakura Tanaka", location: "Tokyo, Japan", rating: 4, review: "Very user-friendly interface with great deals. I saved a lot on my family trip to Bangkok. The customer support was also very helpful.", avatar: "ST" },
  { name: "Carlos Rodriguez", location: "New York, USA", rating: 5, review: "Found amazing deals for my trip to Dubai. The whole experience from booking to boarding was flawless. Outstanding service!", avatar: "CR" },
  { name: "Priya Sharma", location: "Delhi, India", rating: 4, review: "Love the dark mode feature and the clean design. Booking flights has never been this easy. Great job on the offers section too!", avatar: "PS" },
  { name: "Michael Chen", location: "Singapore", rating: 5, review: "The fare breakdown is transparent and I appreciate the baggage information upfront. No hidden charges. This is how booking should be!", avatar: "MC" },
];

const scheduleData = [
  { airline: "Vimaan Airways Air", flightNo: "SV-101", departure: "06:00 - DEL", arrival: "08:30 - DXB", status: "On Time" },
  { airline: "IndiaWings", flightNo: "IW-205", departure: "10:15 - BOM", arrival: "18:45 - SIN", status: "Delayed" },
  { airline: "AeroConnect", flightNo: "AC-310", departure: "22:00 - DEL", arrival: "04:30 - LHR", status: "On Time" },
  { airline: "FlyEast", flightNo: "FE-412", departure: "14:30 - BLR", arrival: "22:00 - CDG", status: "Boarding" },
  { airline: "Vimaan Airways Air", flightNo: "SV-520", departure: "01:30 - DEL", arrival: "07:00 - JFK", status: "Landed" },
  { airline: "PacificJet", flightNo: "PJ-630", departure: "23:45 - BOM", arrival: "12:15 - NRT", status: "On Time" },
  { airline: "IndiaWings", flightNo: "IW-740", departure: "08:00 - DEL", arrival: "13:30 - BKK", status: "Cancelled" },
  { airline: "AeroConnect", flightNo: "AC-855", departure: "16:00 - BLR", arrival: "06:30 - SYD", status: "On Time" },
];

// ── Airline Logo Emoji Map ──
const airlineLogos = {
  "Vimaan Airways Air": "✈️",
  "IndiaWings": "🦅",
  "AeroConnect": "🌐",
  "FlyEast": "🚀",
  "PacificJet": "🛩️",
};

// ── Utility Functions ──
function $(selector) { return document.querySelector(selector); }
function $$(selector) { return document.querySelectorAll(selector); }

function getLS(key) {
  try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
}

function setLS(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function formatCurrency(amount) {
  return '₹' + amount.toLocaleString('en-IN');
}

function generateBookingId() {
  return 'SKY' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase();
}

// ── Toast Notification System ──
function showToast(message, type = 'success') {
  let container = $('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = { success: '✔️', error: '❌', info: 'ℹ️', warning: '⚠️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type]}</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => toast.remove(), 3200);
}

// ── Theme Management ──
function initTheme() {
  const saved = getLS('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeIcon(saved);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  setLS('theme', next);
  updateThemeIcon(next);
  showToast(`${next === 'dark' ? '🌙 Dark' : '☀️ Light'} mode activated`, 'info');
}

function updateThemeIcon(theme) {
  const btn = $('.theme-toggle');
  if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
}

// ── Navigation ──
function initNavigation() {
  // Sticky nav scroll effect
  window.addEventListener('scroll', () => {
    const nav = $('.navbar');
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);

    // Back to top button
    const btn = $('.back-to-top');
    if (btn) btn.classList.toggle('visible', window.scrollY > 400);
  });

  // Hamburger menu
  const hamburger = $('.hamburger');
  const navLinks = $('.nav-links');
  const overlay = $('.mobile-overlay');

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
      if (overlay) overlay.classList.toggle('active');
    });
  }

  if (overlay) {
    overlay.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
      overlay.classList.remove('active');
    });
  }

  // Active nav link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  $$('.nav-links a').forEach(link => {
    const href = link.getAttribute('href').split('/').pop();
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Back to top
  const backToTop = $('.back-to-top');
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Theme toggle
  const themeBtn = $('.theme-toggle');
  if (themeBtn) themeBtn.addEventListener('click', toggleTheme);
}

// ── Scroll Animations ──
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  $$('.animate-on-scroll').forEach(el => observer.observe(el));
}

// ── Flight Search ──
function initFlightSearch() {
  const searchForm = $('#searchForm');
  if (!searchForm) return;

  // Trip type toggle
  $$('.trip-type-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.trip-type-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const returnDate = $('#returnDate');
      if (returnDate) {
        const wrapper = returnDate.closest('.form-group');
        wrapper.style.display = btn.dataset.type === 'oneway' ? 'none' : 'flex';
      }
    });
  });

  // Date validation - no past dates
  const today = new Date().toISOString().split('T')[0];
  const depDate = $('#departureDate');
  const retDate = $('#returnDate');
  if (depDate) depDate.setAttribute('min', today);
  if (retDate) retDate.setAttribute('min', today);

  if (depDate) {
    depDate.addEventListener('change', () => {
      if (retDate) retDate.setAttribute('min', depDate.value);
      if (retDate && retDate.value && retDate.value < depDate.value) {
        retDate.value = depDate.value;
      }
    });
  }

  // Search form submission
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const from = $('#fromAirport').value;
    const to = $('#toAirport').value;
    const date = depDate ? depDate.value : '';
    const travelClass = $('#travelClass') ? $('#travelClass').value : 'economy';
    const passengers = $('#passengers') ? $('#passengers').value : '1';
    const tripType = document.querySelector('.trip-type-btn.active')?.dataset.type || 'roundtrip';
    const returnDateVal = retDate ? retDate.value : '';

    if (!from || !to) {
      showToast('Please select departure and arrival airports', 'warning');
      return;
    }
    if (from === to) {
      showToast('Departure and arrival airports cannot be the same', 'error');
      return;
    }
    if (!date) {
      showToast('Please select a departure date', 'warning');
      return;
    }

    // Save recent search
    const recentSearches = getLS('recentSearches') || [];
    recentSearches.unshift({ from, to, date, travelClass, passengers, tripType, returnDate: returnDateVal, timestamp: Date.now() });
    setLS('recentSearches', recentSearches.slice(0, 5));

    // Redirect to flights page
    const params = new URLSearchParams({ from, to, date, class: travelClass, passengers, tripType, returnDate: returnDateVal });
    const basePath = window.location.pathname.includes('/pages/') ? '' : 'pages/';
    window.location.href = `${basePath}flights.html?${params}`;
  });
}

// ── Flights Page ──
function initFlightsPage() {
  const flightsList = $('#flightsList');
  if (!flightsList) return;

  const params = new URLSearchParams(window.location.search);
  const searchFrom = params.get('from') || '';
  const searchTo = params.get('to') || '';
  const searchClass = params.get('class') || 'economy';
  const searchPassengers = parseInt(params.get('passengers')) || 1;

  // Populate search bar on flights page
  const fromInput = $('#fromAirport');
  const toInput = $('#toAirport');
  if (fromInput) fromInput.value = searchFrom;
  if (toInput) toInput.value = searchTo;

  // Show loading
  showLoading();

  // Filter flights
  let filteredFlights = [...flightsData];
  if (searchFrom) filteredFlights = filteredFlights.filter(f => f.from === searchFrom);
  if (searchTo) filteredFlights = filteredFlights.filter(f => f.to === searchTo);

  // Class multipliers
  const classMultiplier = { economy: 1, premium_economy: 1.5, business: 2.5, first: 4 };
  const multiplier = classMultiplier[searchClass] || 1;

  setTimeout(() => {
    hideLoading();
    renderFlights(filteredFlights, multiplier, searchPassengers);
    initFilters(filteredFlights, multiplier, searchPassengers);
    initSorting(filteredFlights, multiplier, searchPassengers);
    updateResultsCount(filteredFlights.length);
  }, 1500);
}

function renderFlights(flights, multiplier = 1, passengers = 1) {
  const container = $('#flightsList');
  if (!container) return;

  const favorites = getLS('favoriteFlights') || [];

  if (flights.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="icon">🔍</div>
        <h3>No Flights Found</h3>
        <p>Try adjusting your search criteria or filters</p>
      </div>`;
    return;
  }

  container.innerHTML = flights.map(flight => {
    const price = Math.round(flight.price * multiplier);
    const isFav = favorites.includes(flight.id);
    return `
    <div class="flight-card animate-on-scroll slide-up" data-id="${flight.id}">
      <div class="flight-airline">
        <div class="airline-logo">${airlineLogos[flight.airline] || '✈️'}</div>
        <span class="name">${flight.airline}</span>
        <span class="flight-no">${flight.flightNo}</span>
      </div>
      <div class="flight-route">
        <div class="route-point">
          <div class="time">${flight.departure}</div>
          <div class="code">${flight.from}</div>
        </div>
        <div class="route-line">
          <span class="duration">${flight.duration}</span>
          <div class="line"></div>
          <span class="stops">${flight.stops === 0 ? 'Non-stop' : flight.stops + ' Stop'}</span>
        </div>
        <div class="route-point">
          <div class="time">${flight.arrival}</div>
          <div class="code">${flight.to}</div>
        </div>
      </div>
      <div class="flight-price">
        <div class="per-person">per person</div>
        <div class="amount">${formatCurrency(price)}</div>
        <div class="seats">${flight.seats} seats left</div>
      </div>
      <div class="flight-actions">
        <button class="fav-btn ${isFav ? 'active' : ''}" onclick="toggleFavorite(${flight.id})" title="Save flight">♥</button>
        <a href="booking.html?flightId=${flight.id}&class=${new URLSearchParams(window.location.search).get('class') || 'economy'}&passengers=${passengers}" class="btn btn-primary btn-sm">Book Now</a>
      </div>
    </div>`;
  }).join('');

  initScrollAnimations();
}

function initFilters(allFlights, multiplier, passengers) {
  // Price range filter
  const priceRange = $('#priceRange');
  const priceValue = $('#priceValue');
  if (priceRange) {
    const maxPrice = Math.max(...allFlights.map(f => Math.round(f.price * multiplier)));
    priceRange.max = maxPrice;
    priceRange.value = maxPrice;
    if (priceValue) priceValue.textContent = formatCurrency(maxPrice);

    priceRange.addEventListener('input', () => {
      if (priceValue) priceValue.textContent = formatCurrency(parseInt(priceRange.value));
      applyFilters(allFlights, multiplier, passengers);
    });
  }

  // Airline checkboxes
  $$('.airline-filter').forEach(cb => {
    cb.addEventListener('change', () => applyFilters(allFlights, multiplier, passengers));
  });

  // Stops filter
  $$('.stops-filter').forEach(cb => {
    cb.addEventListener('change', () => applyFilters(allFlights, multiplier, passengers));
  });
}

function applyFilters(allFlights, multiplier, passengers) {
  let filtered = [...allFlights];

  // Price filter
  const priceRange = $('#priceRange');
  if (priceRange) {
    const maxPrice = parseInt(priceRange.value);
    filtered = filtered.filter(f => Math.round(f.price * multiplier) <= maxPrice);
  }

  // Airline filter
  const selectedAirlines = [...$$('.airline-filter:checked')].map(cb => cb.value);
  if (selectedAirlines.length > 0) {
    filtered = filtered.filter(f => selectedAirlines.includes(f.airline));
  }

  // Stops filter
  const selectedStops = [...$$('.stops-filter:checked')].map(cb => parseInt(cb.value));
  if (selectedStops.length > 0) {
    filtered = filtered.filter(f => selectedStops.includes(f.stops));
  }

  renderFlights(filtered, multiplier, passengers);
  updateResultsCount(filtered.length);
}

function initSorting(allFlights, multiplier, passengers) {
  $$('.sort-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.sort-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const sortBy = btn.dataset.sort;
      let sorted = [...allFlights];

      switch (sortBy) {
        case 'price':
          sorted.sort((a, b) => a.price - b.price);
          break;
        case 'duration':
          sorted.sort((a, b) => parseDuration(a.duration) - parseDuration(b.duration));
          break;
        case 'departure':
          sorted.sort((a, b) => a.departure.localeCompare(b.departure));
          break;
      }

      renderFlights(sorted, multiplier, passengers);
    });
  });
}

function parseDuration(dur) {
  const parts = dur.match(/(\d+)h\s*(\d+)m/);
  return parts ? parseInt(parts[1]) * 60 + parseInt(parts[2]) : 0;
}

function updateResultsCount(count) {
  const el = $('#resultsCount');
  if (el) el.innerHTML = `<strong>${count}</strong> flights found`;
}

// ── Favorites ──
function toggleFavorite(flightId) {
  let favorites = getLS('favoriteFlights') || [];
  const index = favorites.indexOf(flightId);

  if (index > -1) {
    favorites.splice(index, 1);
    showToast('Flight removed from favorites', 'info');
  } else {
    favorites.push(flightId);
    showToast('Flight saved to favorites! ♥', 'success');
  }

  setLS('favoriteFlights', favorites);

  // Update button state
  const btn = document.querySelector(`.flight-card[data-id="${flightId}"] .fav-btn`);
  if (btn) btn.classList.toggle('active');
}

// ── Loading ──
function showLoading() {
  let overlay = $('.loading-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'loading-overlay';
    overlay.innerHTML = '<div class="loader"></div><p>Searching best flights...</p>';
    document.body.appendChild(overlay);
  }
  overlay.classList.add('active');
}

function hideLoading() {
  const overlay = $('.loading-overlay');
  if (overlay) overlay.classList.remove('active');
}

// ── Booking Page ──
function initBookingPage() {
  const bookingForm = $('#bookingForm');
  if (!bookingForm) return;

  const params = new URLSearchParams(window.location.search);
  const flightId = parseInt(params.get('flightId'));
  const travelClass = params.get('class') || 'economy';
  const passengers = parseInt(params.get('passengers')) || 1;

  const flight = flightsData.find(f => f.id === flightId);
  if (!flight) return;

  // Populate flight details
  renderFlightDetails(flight);

  // Initialize fare calculator
  const classMultiplier = { economy: 1, premium_economy: 1.5, business: 2.5, first: 4 };
  const basePrice = Math.round(flight.price * (classMultiplier[travelClass] || 1));
  initFareCalculator(basePrice, passengers);

  // Load saved passenger details
  const savedDetails = getLS('passengerDetails');
  if (savedDetails) {
    Object.keys(savedDetails).forEach(key => {
      const input = $(`#${key}`);
      if (input) input.value = savedDetails[key];
    });
  }

  // Form validation
  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (validateForm()) {
      savePassengerDetails();
      confirmBooking(flight, basePrice, passengers, travelClass);
    }
  });

  // Real-time validation
  $$('#bookingForm input, #bookingForm select').forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.closest('.form-group').classList.contains('error')) {
        validateField(input);
      }
    });
  });

  // Baggage selection
  $$('input[name="extraBaggage"]').forEach(radio => {
    radio.addEventListener('change', () => {
      updateFare();
    });
  });
}

function renderFlightDetails(flight) {
  const container = $('#flightDetailsContent');
  if (!container) return;

  container.innerHTML = `
    <div class="flight-details-grid">
      <div class="detail-item"><div class="icon">✈️</div><div class="info"><label>Flight</label><span>${flight.flightNo}</span></div></div>
      <div class="detail-item"><div class="icon">🏢</div><div class="info"><label>Airline</label><span>${flight.airline}</span></div></div>
      <div class="detail-item"><div class="icon">🛫</div><div class="info"><label>Aircraft</label><span>${flight.aircraft}</span></div></div>
      <div class="detail-item"><div class="icon">🛫</div><div class="info"><label>Departure</label><span>${flight.departure} - ${flight.fromCity}</span></div></div>
      <div class="detail-item"><div class="icon">🛬</div><div class="info"><label>Arrival</label><span>${flight.arrival} - ${flight.toCity}</span></div></div>
      <div class="detail-item"><div class="icon">🏗️</div><div class="info"><label>Terminal</label><span>${flight.terminal}</span></div></div>
      <div class="detail-item"><div class="icon">🚪</div><div class="info"><label>Gate</label><span>${flight.gate}</span></div></div>
      <div class="detail-item"><div class="icon">⏱️</div><div class="info"><label>Duration</label><span>${flight.duration}</span></div></div>
      <div class="detail-item"><div class="icon">🧳</div><div class="info"><label>Baggage</label><span>${flight.baggage}</span></div></div>
      <div class="detail-item"><div class="icon">🍽️</div><div class="info"><label>Meal</label><span>${flight.meal ? 'Included' : 'Not Included'}</span></div></div>
      <div class="detail-item"><div class="icon">📶</div><div class="info"><label>Wi-Fi</label><span>${flight.wifi ? 'Available' : 'Not Available'}</span></div></div>
      <div class="detail-item"><div class="icon">🪑</div><div class="info"><label>Seats Left</label><span>${flight.seats}</span></div></div>
    </div>`;
}

// ── Fare Calculator ──
let fareState = {
  baseFare: 0,
  taxes: 0,
  convenienceFee: 300,
  baggageCharges: 0,
  seatCharges: 0,
  discount: 0,
  passengers: 1,
};

function initFareCalculator(basePrice, passengers) {
  fareState.baseFare = basePrice;
  fareState.passengers = passengers;
  fareState.taxes = Math.round(basePrice * 0.12);
  updateFare();
}

function updateFare() {
  // Check for extra baggage
  const extraBaggage = document.querySelector('input[name="extraBaggage"]:checked');
  fareState.baggageCharges = extraBaggage ? parseInt(extraBaggage.value) || 0 : 0;

  // Check for selected seat charges
  const seatCharge = getLS('selectedSeatCharge') || 0;
  fareState.seatCharges = seatCharge;

  // Check for applied offer
  const appliedOffer = getLS('appliedOffer');
  if (appliedOffer) {
    if (appliedOffer.discount.includes('%')) {
      const pct = parseInt(appliedOffer.discount) / 100;
      fareState.discount = Math.round(fareState.baseFare * pct);
    } else {
      fareState.discount = parseInt(appliedOffer.discount.replace(/[^\d]/g, '')) || 0;
    }
  }

  const subtotal = (fareState.baseFare + fareState.taxes + fareState.convenienceFee + fareState.baggageCharges + fareState.seatCharges) * fareState.passengers;
  const total = subtotal - fareState.discount;

  // Update DOM
  const els = {
    baseFare: fareState.baseFare * fareState.passengers,
    taxes: fareState.taxes * fareState.passengers,
    convenienceFee: fareState.convenienceFee * fareState.passengers,
    baggageCharges: fareState.baggageCharges * fareState.passengers,
    seatCharges: fareState.seatCharges * fareState.passengers,
    discount: fareState.discount,
    totalAmount: Math.max(0, total),
  };

  Object.entries(els).forEach(([id, val]) => {
    const el = $(`#${id}`);
    if (el) el.textContent = formatCurrency(val);
  });
}

// ── Form Validation ──
function validateForm() {
  let valid = true;
  const fields = $$('#bookingForm [required]');
  fields.forEach(field => {
    if (!validateField(field)) valid = false;
  });
  return valid;
}

function validateField(field) {
  const group = field.closest('.form-group');
  if (!group) return true;

  const value = field.value.trim();
  let valid = true;
  let message = '';

  if (field.hasAttribute('required') && !value) {
    valid = false;
    message = 'This field is required';
  } else if (field.type === 'email' && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      valid = false;
      message = 'Please enter a valid email address';
    }
  } else if (field.id === 'phone' && value) {
    const phoneRegex = /^[\d\s\-\+]{10,15}$/;
    if (!phoneRegex.test(value)) {
      valid = false;
      message = 'Please enter a valid phone number';
    }
  } else if (field.id === 'passport' && value) {
    const passportRegex = /^[A-Z0-9]{6,12}$/i;
    if (!passportRegex.test(value)) {
      valid = false;
      message = 'Please enter a valid passport number';
    }
  }

  group.classList.toggle('error', !valid);
  group.classList.toggle('success', valid && value);
  const errorEl = group.querySelector('.error-msg');
  if (errorEl) errorEl.textContent = message;

  return valid;
}

function savePassengerDetails() {
  const details = {};
  $$('#bookingForm input, #bookingForm select').forEach(input => {
    if (input.id) details[input.id] = input.value;
  });
  setLS('passengerDetails', details);
}

// ── Booking Confirmation ──
function confirmBooking(flight, basePrice, passengers, travelClass) {
  const bookingId = generateBookingId();
  const passengerName = $('#fullName').value;
  const email = $('#email').value;
  const selectedSeat = getLS('selectedSeat') || 'Not Selected';

  const total = (fareState.baseFare + fareState.taxes + fareState.convenienceFee + fareState.baggageCharges + fareState.seatCharges) * fareState.passengers - fareState.discount;

  // Save booking
  const bookings = getLS('bookings') || [];
  bookings.push({
    bookingId,
    flightNo: flight.flightNo,
    airline: flight.airline,
    from: flight.fromCity,
    to: flight.toCity,
    departure: flight.departure,
    arrival: flight.arrival,
    passenger: passengerName,
    email,
    class: travelClass,
    passengers,
    seat: selectedSeat,
    total,
    date: new Date().toISOString(),
    status: 'Confirmed',
  });
  setLS('bookings', bookings);
  setLS('lastBooking', bookingId);

  // Show modal
  showBookingModal(bookingId, flight, passengerName, travelClass, passengers, selectedSeat, total);
}

function showBookingModal(bookingId, flight, passenger, travelClass, passengers, seat, total) {
  let modal = $('.modal-overlay');
  if (!modal) {
    modal = document.createElement('div');
    modal.className = 'modal-overlay';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="modal">
      <div class="success-icon">✅</div>
      <h2>Flight Booked Successfully!</h2>
      <p class="booking-id">Booking ID: ${bookingId}</p>
      <div class="summary-row"><span class="label">Passenger</span><span class="value">${passenger}</span></div>
      <div class="summary-row"><span class="label">Flight</span><span class="value">${flight.flightNo} - ${flight.airline}</span></div>
      <div class="summary-row"><span class="label">Route</span><span class="value">${flight.fromCity} → ${flight.toCity}</span></div>
      <div class="summary-row"><span class="label">Time</span><span class="value">${flight.departure} - ${flight.arrival}</span></div>
      <div class="summary-row"><span class="label">Class</span><span class="value">${travelClass.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span></div>
      <div class="summary-row"><span class="label">Passengers</span><span class="value">${passengers}</span></div>
      <div class="summary-row"><span class="label">Seat</span><span class="value">${seat}</span></div>
      <div class="summary-row"><span class="label">Total Paid</span><span class="value">${formatCurrency(total)}</span></div>
      <div style="margin-top: 24px; display: flex; gap: 12px; justify-content: center;">
        <a href="my-bookings.html" class="btn btn-primary">View Bookings</a>
        <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').classList.remove('active'); this.closest('.modal-overlay').style.display='none';">Close</button>
      </div>
    </div>`;

  modal.classList.add('active');
  modal.style.display = 'flex';
  showToast('✔ Booking Confirmed Successfully!', 'success');
}

// ── Seat Selection ──
function initSeatSelection() {
  const seatMap = $('#seatMap');
  if (!seatMap) return;

  const rows = 25;
  const cols = ['A', 'B', 'C', '', 'D', 'E', 'F'];
  const exitRows = [10, 20];
  const reservedSeats = generateReservedSeats();

  // Column labels
  const labelsHtml = cols.map(c => `<span>${c}</span>`).join('');
  const labelsDiv = document.createElement('div');
  labelsDiv.className = 'seat-column-labels';
  labelsDiv.innerHTML = labelsHtml;
  seatMap.appendChild(labelsDiv);

  // Generate rows
  for (let row = 1; row <= rows; row++) {
    const rowDiv = document.createElement('div');
    rowDiv.className = 'seat-row';

    cols.forEach((col, idx) => {
      if (col === '') {
        const aisle = document.createElement('div');
        aisle.className = 'aisle';
        aisle.textContent = row;
        rowDiv.appendChild(aisle);
        return;
      }

      const seatId = `${row}${col}`;
      const seat = document.createElement('div');
      seat.className = 'seat';
      seat.textContent = seatId;
      seat.dataset.seat = seatId;
      seat.dataset.row = row;
      seat.dataset.col = col;

      if (exitRows.includes(row)) seat.classList.add('exit-row');

      if (reservedSeats.includes(seatId)) {
        seat.classList.add('reserved');
      } else {
        seat.classList.add('available');
        seat.addEventListener('click', () => selectSeat(seat, seatId, col, exitRows.includes(row)));
      }

      rowDiv.appendChild(seat);
    });

    seatMap.appendChild(rowDiv);
  }

  // Load previously selected seat
  const savedSeat = getLS('selectedSeat');
  if (savedSeat) {
    const seatEl = seatMap.querySelector(`[data-seat="${savedSeat}"]`);
    if (seatEl && seatEl.classList.contains('available')) {
      seatEl.click();
    }
  }
}

function generateReservedSeats() {
  const reserved = [];
  const totalSeats = 25 * 6;
  const reserveCount = Math.floor(totalSeats * 0.35);

  for (let i = 0; i < reserveCount; i++) {
    const row = Math.floor(Math.random() * 25) + 1;
    const col = ['A', 'B', 'C', 'D', 'E', 'F'][Math.floor(Math.random() * 6)];
    reserved.push(`${row}${col}`);
  }

  return [...new Set(reserved)];
}

function selectSeat(seatEl, seatId, col, isExit) {
  // Deselect previous
  const prev = document.querySelector('.seat.selected');
  if (prev) {
    prev.classList.remove('selected');
    prev.classList.add('available');
  }

  // Select new
  seatEl.classList.remove('available');
  seatEl.classList.add('selected');

  // Determine seat type
  let seatType = 'Middle Seat';
  if (col === 'A' || col === 'F') seatType = 'Window Seat';
  else if (col === 'C' || col === 'D') seatType = 'Aisle Seat';
  if (isExit) seatType += ' (Exit Row)';

  // Calculate seat charge
  let charge = 0;
  if (col === 'A' || col === 'F') charge = 500;
  if (col === 'C' || col === 'D') charge = 300;
  if (isExit) charge += 800;

  // Update display
  const seatNumber = $('.selected-seat-display .seat-number');
  const seatTypeEl = $('.selected-seat-display .seat-type');
  const seatPrice = $('#seatPrice');

  if (seatNumber) seatNumber.textContent = seatId;
  if (seatTypeEl) seatTypeEl.textContent = seatType;
  if (seatPrice) seatPrice.textContent = formatCurrency(charge);

  // Save
  setLS('selectedSeat', seatId);
  setLS('selectedSeatCharge', charge);

  showToast(`✔ Seat ${seatId} Selected — ${seatType}`, 'success');
}

// ── Offers & Countdown ──
function initOffers() {
  renderOfferCountdowns();
  setInterval(renderOfferCountdowns, 1000);
}

function renderOfferCountdowns() {
  $$('.countdown').forEach(el => {
    const expiry = new Date(el.dataset.expiry);
    const now = new Date();
    const diff = expiry - now;

    if (diff <= 0) {
      el.innerHTML = '<span style="color: var(--danger); font-weight: 600;">Expired</span>';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    el.innerHTML = `
      <div class="countdown-item"><span class="number">${days}</span><span class="label">Days</span></div>
      <div class="countdown-item"><span class="number">${hours}</span><span class="label">Hours</span></div>
      <div class="countdown-item"><span class="number">${minutes}</span><span class="label">Mins</span></div>
      <div class="countdown-item"><span class="number">${seconds}</span><span class="label">Secs</span></div>`;
  });
}

function applyOffer(offerId) {
  const offer = offersData.find(o => o.id === offerId);
  if (offer) {
    setLS('appliedOffer', offer);
    showToast(`✔ Offer "${offer.title}" Applied Successfully!`, 'success');
  }
}

// ── My Bookings ──
function initMyBookings() {
  const container = $('#bookingsList');
  if (!container) return;

  const bookings = getLS('bookings') || [];

  if (bookings.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="icon">📋</div>
        <h3>No Bookings Yet</h3>
        <p>Start your journey by searching for flights!</p>
        <a href="../index.html" class="btn btn-primary">Search Flights</a>
      </div>`;
    return;
  }

  container.innerHTML = bookings.reverse().map(booking => `
    <div class="booking-list-card animate-on-scroll slide-up">
      <div class="booking-id-badge">
        <span class="label">Booking ID</span>
        <span class="id">${booking.bookingId}</span>
      </div>
      <div class="booking-details">
        <h4>${booking.from} → ${booking.to}</h4>
        <p style="color: var(--text-secondary); font-size: 0.9rem;">
          ${booking.flightNo} · ${booking.airline} · ${booking.departure} - ${booking.arrival}
        </p>
        <p style="color: var(--text-muted); font-size: 0.85rem; margin-top: 4px;">
          Passenger: ${booking.passenger} · Class: ${booking.class.replace('_', ' ')} · Seat: ${booking.seat}
        </p>
      </div>
      <div style="text-align: right;">
        <span class="status-badge status-ontime">${booking.status}</span>
        <div style="font-size: 1.2rem; font-weight: 800; color: var(--accent); margin-top: 8px;">${formatCurrency(booking.total)}</div>
        <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 4px;">${new Date(booking.date).toLocaleDateString()}</div>
      </div>
    </div>`).join('');

  initScrollAnimations();
}

// ── FAQ Accordion ──
function initFAQ() {
  $$('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const isActive = item.classList.contains('active');

      // Close all
      $$('.faq-item').forEach(i => i.classList.remove('active'));

      // Toggle current
      if (!isActive) item.classList.add('active');
    });
  });
}

// ── Contact Form ──
function initContactForm() {
  const form = $('#contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let valid = true;
    form.querySelectorAll('[required]').forEach(field => {
      if (!validateField(field)) valid = false;
    });

    if (valid) {
      showToast('✔ Message sent successfully! We\'ll get back to you soon.', 'success');
      form.reset();
    }
  });
}

// ── Initialize Everything ──
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  initScrollAnimations();
  initFlightSearch();
  initFlightsPage();
  initBookingPage();
  initSeatSelection();
  initOffers();
  initMyBookings();
  initFAQ();
  initContactForm();
});
