# Multi-Project Repository

This repository contains two separate projects: a backend API system and a frontend booking client.

---

## 1. 📦 Product Inventory Management System
A REST API-based Product Inventory Management System built with **Django** and **Django REST Framework**.

### Features
- Add a new product
- View all products
- Update product details
- Delete a product

### Tech Stack
- Python
- Django
- Django REST Framework
- SQLite

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/products/add/` | Add a new product |
| GET | `/products/` | View all products |
| PUT | `/products/update/<id>/` | Update product by ID |
| DELETE | `/products/delete/<id>/` | Delete product by ID |

### Setup & Run
```bash
# Navigate to the root directory
pip install django djangorestframework
python manage.py migrate
python manage.py runserver
```

---

## 2. ✈️ Vimaan Airways — Flight Booking Platform
A premium, multi-page frontend flight booking website built with vanilla HTML, CSS, and JavaScript.

### Features
- **🔍 Smart Flight Search:** Dynamic round-trip/one-way toggles, date validation, and flight search query routing.
- **💺 Interactive Seat Selection:** 25x6 airplane seat selector with custom seat types (window, aisle, exit rows) and live pricing rules.
- **💳 Real-time Fare Calculator:** Instantly calculates Base Fare, Taxes, Convenience Fees, Extra Baggage, and Seats minus applied discount coupons.
- **💾 Offline Storage:** Theme preferences, passenger forms, favorites, and booking history persisted locally using LocalStorage.
- **🌙 Persistent Dark Mode:** Seamless theme toggling saved locally.
- **✨ Scroll Animations:** Scroll-triggered fade-in, slide-up, and zoom-in effects powered by IntersectionObserver.

### Tech Stack
- HTML5
- CSS3 (Vanilla Custom Variables, Glassmorphism, Backdrop Filters)
- JavaScript (ES6+ Vanilla JS, LocalStorage, Custom DOM Renderer)

### Directory Structure
The frontend project is located in the **[Flight-Booking-Website](./Flight-Booking-Website)** folder.
To launch, simply open the `index.html` file in any modern web browser or run a simple local HTTP server:
```bash
cd Flight-Booking-Website
python -m http.server 5500
```
