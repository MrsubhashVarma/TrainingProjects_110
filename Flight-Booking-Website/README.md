# ✈️ Vimaan Airways — Premium Flight Booking Website

A feature-rich, multi-page flight booking website built with vanilla HTML, CSS, and JavaScript. Features a premium dark-themed UI with glassmorphism design, smooth animations, and a complete booking workflow.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

---

## 🚀 Features

### 🧭 Navigation
- Sticky navigation bar with blur backdrop
- Smooth scrolling to sections
- Active link highlighting
- Mobile hamburger menu with slide-in animation

### 🔍 Flight Search
- Search by source, destination, date, class, passengers
- One-way / Round-trip toggle
- Date validation (no past dates, return after departure)
- Travel classes: Economy, Premium Economy, Business, First Class

### 🛫 Available Flights
- Dynamic flight listing with airline logos
- Real-time filtering by price, airline, and stops
- Sorting by price, duration, and departure time
- Favorite flights with LocalStorage persistence

### 💺 Seat Selection
- Interactive airplane seat map (25 rows × 6 seats)
- Seat types: Window, Middle, Aisle, Exit Row
- Seat status: Available, Reserved, Selected
- Real-time pricing based on seat type

### 📝 Passenger Details
- Full form with validation (name, email, phone, passport, etc.)
- Real-time field validation
- Auto-save to LocalStorage

### 💳 Fare Calculator
- Dynamic calculation: Base + Taxes + Convenience + Baggage + Seat − Discount
- Auto-updates when options change

### 🎁 Offers & Discounts
- 5 offer types with promo codes
- Live countdown timers
- One-click offer application

### 📅 Flight Schedule
- Real-time schedule table
- Status badges: On Time, Delayed, Boarding, Landed, Cancelled

### ⭐ Customer Reviews & FAQ
- Testimonial cards with ratings
- Accordion-style FAQ

### 🌓 Dark Mode
- Toggle between light and dark themes
- Preference saved in LocalStorage

### 📱 Responsive Design
- Mobile-first responsive layouts
- Works on all screen sizes

---

## 📁 Folder Structure

```
Flight-Booking-Website/
│
├── index.html              # Homepage
├── style.css               # Complete design system
├── script.js               # All JavaScript features
│
├── assets/
│   ├── images/
│   │   ├── airlines/       # Airline logos
│   │   ├── destinations/   # 8 destination images
│   │   ├── banners/        # Hero banner
│   │   └── icons/          # UI icons
│   ├── videos/
│   └── fonts/
│
├── pages/
│   ├── flights.html        # Search results & filters
│   ├── booking.html        # Passenger form & fare summary
│   ├── seat-selection.html # Interactive seat map
│   ├── offers.html         # All deals & discounts
│   ├── my-bookings.html    # Past bookings (LocalStorage)
│   ├── about.html          # Company info & team
│   └── contact.html        # Contact form & support info
│
└── README.md
```

---

## 🛠️ Setup

1. Clone or download this repository
2. Open `index.html` in any modern web browser
3. No build tools or dependencies required!

---

## 💾 LocalStorage Data

The app persists the following data:
- `theme` — Light/Dark mode preference
- `passengerDetails` — Saved passenger form data
- `recentSearches` — Last 5 flight searches
- `favoriteFlights` — Saved/favorite flight IDs
- `bookings` — All confirmed bookings
- `selectedSeat` — Currently selected seat
- `selectedSeatCharge` — Seat charge amount
- `appliedOffer` — Currently applied discount offer

---

## 🎨 Design

- **Font**: Inter (body) + Outfit (headings)
- **Theme**: Premium dark with indigo/violet gradient accents
- **Effects**: Glassmorphism, backdrop blur, gradient borders
- **Animations**: Scroll-triggered fade/slide/zoom, micro-interactions
- **Responsive**: Mobile, tablet, and desktop layouts

---

## 📄 License

© 2026 Vimaan Airways. All rights reserved.
