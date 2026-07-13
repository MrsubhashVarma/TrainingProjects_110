"""Management command to seed the pharmacy database with sample data."""

from django.core.management.base import BaseCommand
from datetime import datetime, timedelta
import hashlib


def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()


CATEGORIES = [
    {"categoryName": "Pain Relief", "description": "Medicines for pain management and fever."},
    {"categoryName": "Diabetes", "description": "Medicines for blood sugar control."},
    {"categoryName": "Vitamin Supplements", "description": "Essential vitamins and minerals."},
    {"categoryName": "Skin Care", "description": "Creams, lotions and dermatology products."},
    {"categoryName": "Baby Care", "description": "Safe products for infants and toddlers."},
    {"categoryName": "Allergy", "description": "Antihistamines and allergy relief medicines."},
    {"categoryName": "Antibiotics", "description": "Prescription antibiotic medicines."},
    {"categoryName": "Heart & BP", "description": "Cardiovascular and blood pressure medicines."},
]

MEDICINES = [
    {"medicineName": "Paracetamol 650", "brand": "Cipla", "category": "Pain Relief",
     "price": 45, "stock": 120, "description": "Effective fever and pain relief tablet.",
     "expiryDate": "2027-06-01", "manufacturer": "Cipla Ltd."},
    {"medicineName": "Dolo 650", "brand": "Micro Labs", "category": "Pain Relief",
     "price": 38, "stock": 90, "description": "Popular paracetamol brand for fever.",
     "expiryDate": "2027-03-01", "manufacturer": "Micro Labs Ltd."},
    {"medicineName": "Ibuprofen 400", "brand": "Abbott", "category": "Pain Relief",
     "price": 55, "stock": 8, "description": "Anti-inflammatory pain reliever.",
     "expiryDate": "2026-12-01", "manufacturer": "Abbott India"},
    {"medicineName": "Metformin 500", "brand": "Sun Pharma", "category": "Diabetes",
     "price": 80, "stock": 65, "description": "Type 2 diabetes management tablet.",
     "expiryDate": "2027-01-01", "manufacturer": "Sun Pharmaceutical"},
    {"medicineName": "Glimepiride 2mg", "brand": "Torrent", "category": "Diabetes",
     "price": 95, "stock": 5, "description": "Oral hypoglycemic agent for diabetes.",
     "expiryDate": "2027-04-01", "manufacturer": "Torrent Pharma"},
    {"medicineName": "Vitamin C Tablets", "brand": "Himalaya", "category": "Vitamin Supplements",
     "price": 150, "stock": 50, "description": "Immunity booster with 500mg Vitamin C.",
     "expiryDate": "2027-08-01", "manufacturer": "Himalaya Wellness"},
    {"medicineName": "Vitamin D3 60K", "brand": "Mankind", "category": "Vitamin Supplements",
     "price": 180, "stock": 45, "description": "Weekly Vitamin D3 supplement capsule.",
     "expiryDate": "2027-05-01", "manufacturer": "Mankind Pharma"},
    {"medicineName": "Cetirizine 10mg", "brand": "Dr. Reddy's", "category": "Allergy",
     "price": 65, "stock": 150, "description": "Antihistamine for allergy relief.",
     "expiryDate": "2027-07-01", "manufacturer": "Dr. Reddy's Laboratories"},
    {"medicineName": "Moisturizing Cream", "brand": "Nivea", "category": "Skin Care",
     "price": 220, "stock": 40, "description": "Deep moisturizing body cream for dry skin.",
     "expiryDate": "2028-01-01", "manufacturer": "Beiersdorf AG"},
    {"medicineName": "Baby Lotion", "brand": "Johnson's", "category": "Baby Care",
     "price": 180, "stock": 70, "description": "Gentle moisturizing lotion for baby skin.",
     "expiryDate": "2027-09-01", "manufacturer": "Johnson & Johnson"},
    {"medicineName": "Amoxicillin 500", "brand": "GSK", "category": "Antibiotics",
     "price": 120, "stock": 3, "description": "Broad-spectrum antibiotic capsule.",
     "expiryDate": "2026-11-01", "manufacturer": "GlaxoSmithKline"},
    {"medicineName": "Amlodipine 5mg", "brand": "Lupin", "category": "Heart & BP",
     "price": 75, "stock": 85, "description": "Calcium channel blocker for hypertension.",
     "expiryDate": "2027-02-01", "manufacturer": "Lupin Ltd."},
]

USERS = [
    {"name": "Admin", "email": "admin@pharmacy.com", "password": "admin123",
     "phone": "9000000000", "role": "admin", "address": "Pharmacy HQ, Mumbai"},
    {"name": "Rahul Sharma", "email": "rahul@gmail.com", "password": "rahul123",
     "phone": "9876543210", "role": "customer", "address": "12 MG Road, Delhi"},
    {"name": "Priya Verma", "email": "priya@gmail.com", "password": "priya123",
     "phone": "9765432109", "role": "customer", "address": "45 Park Street, Bangalore"},
]


class Command(BaseCommand):
    help = "Seed the pharmacy database with sample data."

    def handle(self, *args, **options):
        from api.db import categories_col, medicines_col, users_col, orders_col

        self.stdout.write("Seeding Pharmacy Database...\n")

        # Clear existing data
        categories_col().delete_many({})
        medicines_col().delete_many({})
        users_col().delete_many({})
        orders_col().delete_many({})
        self.stdout.write("  ✓ Cleared existing data")

        # Insert categories
        now = datetime.utcnow()
        for cat in CATEGORIES:
            cat['createdAt'] = now
        result = categories_col().insert_many(CATEGORIES)
        cat_ids = {CATEGORIES[i]['categoryName']: result.inserted_ids[i]
                   for i in range(len(CATEGORIES))}
        self.stdout.write(f"  ✓ Inserted {len(CATEGORIES)} categories")

        # Insert medicines
        for med in MEDICINES:
            med['image'] = ''
            med['createdAt'] = now
        medicines_col().insert_many(MEDICINES)
        self.stdout.write(f"  ✓ Inserted {len(MEDICINES)} medicines")

        # Insert users
        inserted_users = []
        for u in USERS:
            user_doc = {
                'name': u['name'],
                'email': u['email'],
                'phone': u.get('phone', ''),
                'password': hash_password(u['password']),
                'address': u.get('address', ''),
                'role': u['role'],
                'isBlocked': False,
                'createdAt': now,
            }
            res = users_col().insert_one(user_doc)
            user_doc['_id'] = res.inserted_id
            inserted_users.append(user_doc)
        self.stdout.write(f"  ✓ Inserted {len(USERS)} users")

        # Insert sample orders
        rahul = next(u for u in inserted_users if u['email'] == 'rahul@gmail.com')
        priya = next(u for u in inserted_users if u['email'] == 'priya@gmail.com')
        paracetamol = medicines_col().find_one({'medicineName': 'Paracetamol 650'})
        vitamin_c = medicines_col().find_one({'medicineName': 'Vitamin C Tablets'})

        sample_orders = [
            {
                'userId': rahul['_id'],
                'userName': 'Rahul Sharma',
                'userEmail': 'rahul@gmail.com',
                'userPhone': '9876543210',
                'shippingAddress': '12 MG Road, Delhi',
                'items': [{'medicineId': paracetamol['_id'], 'medicineName': 'Paracetamol 650',
                           'quantity': 2, 'price': 45, 'image': ''}],
                'totalAmount': 90,
                'paymentMethod': 'Cash on Delivery',
                'status': 'Pending',
                'createdAt': now - timedelta(days=2),
            },
            {
                'userId': priya['_id'],
                'userName': 'Priya Verma',
                'userEmail': 'priya@gmail.com',
                'userPhone': '9765432109',
                'shippingAddress': '45 Park Street, Bangalore',
                'items': [{'medicineId': vitamin_c['_id'], 'medicineName': 'Vitamin C Tablets',
                           'quantity': 1, 'price': 150, 'image': ''}],
                'totalAmount': 150,
                'paymentMethod': 'Cash on Delivery',
                'status': 'Delivered',
                'createdAt': now - timedelta(days=5),
            },
        ]
        orders_col().insert_many(sample_orders)
        self.stdout.write(f"  ✓ Inserted {len(sample_orders)} sample orders")

        self.stdout.write(self.style.SUCCESS(
            "\nDatabase seeded successfully!\n"
            "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
            "Admin Login: admin@pharmacy.com / admin123\n"
            "Customer 1 : rahul@gmail.com / rahul123\n"
            "Customer 2 : priya@gmail.com / priya123\n"
            "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        ))
