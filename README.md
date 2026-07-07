# Product Inventory Management System

A REST API-based Product Inventory Management System built with **Django** and **Django REST Framework**.

## Features
- Add a new product
- View all products
- Update product details
- Delete a product

## Tech Stack
- Python
- Django
- Django REST Framework
- SQLite

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/products/add/` | Add a new product |
| GET | `/products/` | View all products |
| PUT | `/products/update/<id>/` | Update product by ID |
| DELETE | `/products/delete/<id>/` | Delete product by ID |

## Setup & Run

```bash
pip install django djangorestframework
python manage.py migrate
python manage.py runserver
```

## Sample Request (POST)
```json
{
    "product_name": "Wireless Mouse",
    "category": "Electronics",
    "brand": "Logitech",
    "price": 899,
    "quantity": 50,
    "supplier": "ABC Distributors"
}
```
