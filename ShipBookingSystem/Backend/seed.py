import os
import sys
import django

# Add parent directory to sys.path so Backend is importable as a module
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Backend.settings')
django.setup()

from Backend.db import Passenger, Ship, Schedule, Booking, Payment

# Clear existing data to avoid primary key conflicts
Passenger.objects.all().delete()
Ship.objects.all().delete()
Schedule.objects.all().delete()
Booking.objects.all().delete()
Payment.objects.all().delete()

# Add Passenger
p = Passenger(
    passenger_id=101,
    full_name="Rahul Sharma",
    email="rahul@gmail.com",
    phone="9876543210",
    nationality="Indian",
    passport_number="N1234567",
    password="rahul123"
)
p.save()

# Add Ship
s = Ship(
    ship_id=201,
    ship_name="Ocean Paradise",
    ship_type="Cruise Ship",
    capacity=2000,
    operator_name="Royal Cruises",
    status="Active"
)
s.save()

# Add more ships
ships_data = [
    {"ship_id": 202, "ship_name": "Sea Empress", "ship_type": "Luxury Yacht", "capacity": 150, "operator_name": "Elite Sails", "status": "Active"},
    {"ship_id": 203, "ship_name": "Blue Waves Ferry", "ship_type": "Ferry", "capacity": 800, "operator_name": "Coastal Ferries", "status": "Active"},
    {"ship_id": 204, "ship_name": "River Queen", "ship_type": "River Cruise", "capacity": 300, "operator_name": "Heritage Riverways", "status": "Active"},
    {"ship_id": 205, "ship_name": "Atlantis Voyager", "ship_type": "Cruise Ship", "capacity": 3500, "operator_name": "Global Cruises", "status": "Maintenance"},
]
for sd in ships_data:
    Ship(**sd).save()

# Add Schedule
sch = Schedule(
    schedule_id=301,
    ship_name="Ocean Paradise",
    source_port="Chennai Port",
    destination_port="Port Blair",
    departure_date="2026-10-15",
    departure_time="08:00:00",
    arrival_date="2026-10-16",
    arrival_time="06:00:00",
    fare=8500
)
sch.save()

# Add more schedules
schedules_data = [
    {"schedule_id": 302, "ship_name": "Sea Empress", "source_port": "Mumbai Port", "destination_port": "Goa Port", "departure_date": "2026-10-20", "departure_time": "18:00:00", "arrival_date": "2026-10-21", "arrival_time": "09:00:00", "fare": 15000},
    {"schedule_id": 303, "ship_name": "Blue Waves Ferry", "source_port": "Kochi Port", "destination_port": "Lakshadweep Port", "departure_date": "2026-11-01", "departure_time": "10:00:00", "arrival_date": "2026-11-02", "arrival_time": "14:00:00", "fare": 4500},
    {"schedule_id": 304, "ship_name": "Ocean Paradise", "source_port": "Kolkata Port", "destination_port": "Port Blair", "departure_date": "2026-11-15", "departure_time": "12:00:00", "arrival_date": "2026-11-17", "arrival_time": "10:00:00", "fare": 9000},
    {"schedule_id": 305, "ship_name": "River Queen", "source_port": "Varanasi Port", "destination_port": "Patna Port", "departure_date": "2026-10-25", "departure_time": "06:00:00", "arrival_date": "2026-10-26", "arrival_time": "18:00:00", "fare": 3200},
]
for scd in schedules_data:
    Schedule(**scd).save()

# Add Booking
b = Booking(
    booking_id=401,
    passenger_name="Rahul Sharma",
    ship_name="Ocean Paradise",
    cabin_type="Deluxe",
    journey_date="2026-10-15",
    source_port="Chennai Port",
    destination_port="Port Blair",
    total_amount=12000,
    booking_status="Confirmed"
)
b.save()

# Add Payment
pay = Payment(
    payment_id=501,
    booking_id=401,
    passenger_name="Rahul Sharma",
    amount=12000,
    payment_method="UPI",
    payment_status="Success",
    transaction_id="TXN789456123",
    payment_date="2026-09-20"
)
pay.save()

print("Database seeded successfully with sample data!")
