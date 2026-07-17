# Ship Booking System

A premium, full-featured Ship Booking System built using a **Django REST API** backend, **SQLite** database storage, and a responsive **HTML5/CSS3/JavaScript (ES6)** frontend.

Passengers can register accounts, explore available cruises/ferries, search specific route schedules, reserve cabins, simulate payments, and trace booking history. Administrators gain absolute control over the platform's resources through unified CRUD management panels.

---

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3 (Custom design variables, glassmorphism, responsive grids), JavaScript (ES6 Fetch API)
- **Backend**: Django REST APIs (Function-Based Views decorated with `@csrf_exempt`)
- **Database**: SQLite3
- **External Dependencies**: `django-cors-headers` (to support cross-origin API calls from local file schemes)

---

## 📂 Project Structure

```text
ShipBookingSystem/
├── Backend/
│   ├── migrations/             # Migration files tracking database schemas
│   ├── __init__.py
│   ├── db.py                   # Django database models
│   ├── models.py               # Imports models from db.py
│   ├── views.py                # 20 Function-Based REST API endpoints
│   ├── urls.py                 # URL route mapping to views
│   ├── settings.py             # Settings configuration (CORS, DB settings)
│   ├── manage.py               # Django manage utility
│   ├── seed.py                 # Database initialization / seeding script
│   └── db.sqlite3              # Populated SQLite Database
└── Frontend/
    ├── index.html              # Home Page (Hero, Search Form, Offers)
    ├── login.html              # Login Page (Dual Administrator / Passenger authentication)
    ├── register.html           # Passenger Account Registration Form
    ├── ships.html              # Route Search Results / Active Voyages
    ├── ship_details.html       # Voyage details (Gallery, schedules, pricing multiplier info)
    ├── booking.html            # Ticket layout (Cabin selection & live receipts calculator)
    ├── payment.html            # Transaction portal (UPI, Card, Wallet simulation)
    ├── booking_history.html    # Trip log splitter (Upcoming, Completed, Cancelled trips)
    ├── passenger_dashboard.html# Passenger statistics panel & payment records
    ├── admin_dashboard.html    # Unified Administrative Panel (Full CRUD for all modules)
    ├── style.css               # Polished Ocean Theme Stylesheet
    └── script.js               # Global Fetch handler, dynamic nav injectors & event bindings
```

---

## 🚀 Installation & Running Guide

### Step 1: Install Dependencies
Ensure Python is installed on your system. Install Django and CORS headers:
```bash
pip install django django-cors-headers
```

### Step 2: Database Migration
Navigate to the `Backend` directory and apply migrations:
```bash
cd Backend
python manage.py makemigrations
python manage.py migrate
```

### Step 3: Seed Database
Populate the database with default sample data:
```bash
python seed.py
```
This initializes the database with:
- **Passenger**: Rahul Sharma (`rahul@gmail.com` / `rahul123`)
- **Ships**: *Ocean Paradise* (Cruise), *Sea Empress* (Yacht), *Blue Waves Ferry* (Ferry), *River Queen* (River Cruise), *Atlantis Voyager* (Cruise).
- **Schedules**: Routes from Chennai, Mumbai, Kochi, Kolkata, Varanasi to Port Blair, Goa, Lakshadweep, Patna.
- **Sample Bookings & Payments** linked to Rahul Sharma.

### Step 4: Run Development Server
Fire up the Django REST API backend:
```bash
python manage.py runserver
```
The backend server runs locally on: **`http://127.0.0.1:8000`**

### Step 5: Launch Frontend
Open **`Frontend/index.html`** in any web browser to explore the web application.

---

## 🔑 Authentication Roles

### 1. Passenger Login
- **Email**: `rahul@gmail.com`
- **Password**: `rahul123`
- *Access*: Home, Search, Book Cabin, Checkout Payment, Dashboard Stats, Travel History.

### 2. Administrator Login
- **Email**: `admin@cruise.com`
- **Password**: `admin`
- *Access*: Home, Search, Admin CRUD Panel (Full add, list, update, and delete access for Passengers, Ships, Schedules, Bookings, and Payments).

---

## 🌐 API Endpoint Documentation

All REST APIs accept JSON content bodies, run on function-based views, and return standard JSON outputs.

| Module | Method | Endpoint | Description |
| :--- | :---: | :--- | :--- |
| **Passenger** | `POST` | `/passengers/add/` | Register a new passenger account |
| | `GET` | `/passengers/` | Fetch passenger directory |
| | `PUT` | `/passengers/update/<id>/` | Edit passenger profile information |
| | `DELETE`| `/passengers/delete/<id>/` | Deregister a passenger account |
| **Ship** | `POST` | `/ships/add/` | Add a vessel to the fleet |
| | `GET` | `/ships/` | Fetch fleet lists |
| | `PUT` | `/ships/update/<id>/` | Update vessel profile or operational status |
| | `DELETE`| `/ships/delete/<id>/` | Remove vessel from directory |
| **Schedule** | `POST` | `/schedules/add/` | Add travel route & schedule |
| | `GET` | `/schedules/` | List all schedules |
| | `PUT` | `/schedules/update/<id>/` | Modify route information or fares |
| | `DELETE`| `/schedules/delete/<id>/` | Cancel travel route |
| **Booking** | `POST` | `/bookings/add/` | Create ticket reservation |
| | `GET` | `/bookings/` | Fetch platform bookings log |
| | `PUT` | `/bookings/update/<id>/` | Cancel or adjust tickets / cabins |
| | `DELETE`| `/bookings/delete/<id>/` | Delete booking log |
| **Payment** | `POST` | `/payments/add/` | Register payment transaction details |
| | `GET` | `/payments/` | Fetch ledger audit records |
| | `PUT` | `/payments/update/<id>/` | Edit payment states (Success/Failed) |
| | `DELETE`| `/payments/delete/<id>/` | Remove transaction record |
