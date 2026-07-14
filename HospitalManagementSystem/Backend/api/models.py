from django.db import models

class Patient(models.Model):
    patient_id = models.AutoField(primary_key=True)
    patient_name = models.CharField(max_length=100)
    age = models.IntegerField()
    gender = models.CharField(max_length=10)
    phone = models.CharField(max_length=15)
    email = models.EmailField()
    blood_group = models.CharField(max_length=5)
    address = models.TextField()

    def __str__(self):
        return self.patient_name

class Doctor(models.Model):
    doctor_id = models.AutoField(primary_key=True)
    doctor_name = models.CharField(max_length=100)
    specialization = models.CharField(max_length=100)
    department = models.CharField(max_length=100)
    experience = models.IntegerField()
    phone = models.CharField(max_length=15)
    consultation_fee = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.doctor_name

class Appointment(models.Model):
    STATUS_CHOICES = [
        ('Scheduled', 'Scheduled'),
        ('Completed', 'Completed'),
        ('Cancelled', 'Cancelled'),
    ]
    appointment_id = models.AutoField(primary_key=True)
    patient_name = models.CharField(max_length=100)
    doctor_name = models.CharField(max_length=100)
    appointment_date = models.DateField()
    appointment_time = models.TimeField()
    appointment_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Scheduled')

    def __str__(self):
        return f"{self.patient_name} with {self.doctor_name} on {self.appointment_date}"

class MedicalRecord(models.Model):
    record_id = models.AutoField(primary_key=True)
    patient_name = models.CharField(max_length=100)
    doctor_name = models.CharField(max_length=100)
    diagnosis = models.TextField()
    prescription = models.TextField()
    treatment = models.TextField()
    visit_date = models.DateField()

    def __str__(self):
        return f"Record for {self.patient_name}"

class Bill(models.Model):
    PAYMENT_METHODS = [
        ('Cash', 'Cash'),
        ('UPI', 'UPI'),
        ('Credit Card', 'Credit Card'),
        ('Debit Card', 'Debit Card'),
        ('Insurance', 'Insurance'),
    ]
    PAYMENT_STATUS = [
        ('Paid', 'Paid'),
        ('Pending', 'Pending'),
    ]
    bill_id = models.AutoField(primary_key=True)
    patient_name = models.CharField(max_length=100)
    consultation_fee = models.DecimalField(max_digits=10, decimal_places=2)
    medicine_charge = models.DecimalField(max_digits=10, decimal_places=2)
    laboratory_charge = models.DecimalField(max_digits=10, decimal_places=2)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=50, choices=PAYMENT_METHODS)
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS, default='Pending')

    def save(self, *args, **kwargs):
        self.total_amount = self.consultation_fee + self.medicine_charge + self.laboratory_charge
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Bill {self.bill_id} for {self.patient_name}"
