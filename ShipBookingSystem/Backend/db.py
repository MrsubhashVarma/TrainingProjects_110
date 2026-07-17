from django.db import models

class Passenger(models.Model):
    passenger_id = models.AutoField(primary_key=True)
    full_name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=50)
    nationality = models.CharField(max_length=100)
    passport_number = models.CharField(max_length=100)
    password = models.CharField(max_length=255)

    def __str__(self):
        return self.full_name

class Ship(models.Model):
    ship_id = models.AutoField(primary_key=True)
    ship_name = models.CharField(max_length=255)
    ship_type = models.CharField(max_length=100)
    capacity = models.IntegerField()
    operator_name = models.CharField(max_length=255)
    status = models.CharField(max_length=50) # e.g. Active, Maintenance, Inactive

    def __str__(self):
        return self.ship_name

class Schedule(models.Model):
    schedule_id = models.AutoField(primary_key=True)
    ship_name = models.CharField(max_length=255)
    source_port = models.CharField(max_length=255)
    destination_port = models.CharField(max_length=255)
    departure_date = models.DateField()
    departure_time = models.TimeField()
    arrival_date = models.DateField()
    arrival_time = models.TimeField()
    fare = models.FloatField()

    def __str__(self):
        return f"{self.ship_name}: {self.source_port} to {self.destination_port}"

class Booking(models.Model):
    booking_id = models.AutoField(primary_key=True)
    passenger_name = models.CharField(max_length=255)
    ship_name = models.CharField(max_length=255)
    cabin_type = models.CharField(max_length=100) # Economy, Deluxe, Suite, Family Cabin, VIP Cabin
    journey_date = models.DateField()
    source_port = models.CharField(max_length=255)
    destination_port = models.CharField(max_length=255)
    total_amount = models.FloatField()
    booking_status = models.CharField(max_length=50) # Confirmed, Waiting, Cancelled

    def __str__(self):
        return f"Booking {self.booking_id} - {self.passenger_name}"

class Payment(models.Model):
    payment_id = models.AutoField(primary_key=True)
    booking_id = models.IntegerField()
    passenger_name = models.CharField(max_length=255)
    amount = models.FloatField()
    payment_method = models.CharField(max_length=100) # UPI, Credit Card, Debit Card, Net Banking, Wallet
    payment_status = models.CharField(max_length=50) # Success, Pending, Failed
    transaction_id = models.CharField(max_length=255)
    payment_date = models.DateField()

    def __str__(self):
        return f"Payment {self.payment_id} - {self.passenger_name}"
