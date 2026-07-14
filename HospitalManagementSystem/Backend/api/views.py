import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Patient, Doctor, Appointment, MedicalRecord, Bill

def get_data(request):
    try:
        return json.loads(request.body)
    except:
        return {}

# ---------------- PATIENT APIs ---------------- #
@csrf_exempt
def add_patient(request):
    if request.method == 'POST':
        data = get_data(request)
        patient = Patient.objects.create(**data)
        return JsonResponse({"message": "Patient added successfully", "id": patient.patient_id})
    return JsonResponse({"error": "Invalid method"}, status=400)

def list_patients(request):
    if request.method == 'GET':
        patients = list(Patient.objects.values())
        return JsonResponse(patients, safe=False)
    return JsonResponse({"error": "Invalid method"}, status=400)

@csrf_exempt
def update_patient(request, id):
    if request.method == 'PUT':
        data = get_data(request)
        Patient.objects.filter(patient_id=id).update(**data)
        return JsonResponse({"message": "Patient updated successfully"})
    return JsonResponse({"error": "Invalid method"}, status=400)

@csrf_exempt
def delete_patient(request, id):
    if request.method == 'DELETE':
        Patient.objects.filter(patient_id=id).delete()
        return JsonResponse({"message": "Patient deleted successfully"})
    return JsonResponse({"error": "Invalid method"}, status=400)


# ---------------- DOCTOR APIs ---------------- #
@csrf_exempt
def add_doctor(request):
    if request.method == 'POST':
        data = get_data(request)
        doctor = Doctor.objects.create(**data)
        return JsonResponse({"message": "Doctor added successfully", "id": doctor.doctor_id})
    return JsonResponse({"error": "Invalid method"}, status=400)

def list_doctors(request):
    if request.method == 'GET':
        doctors = list(Doctor.objects.values())
        return JsonResponse(doctors, safe=False)
    return JsonResponse({"error": "Invalid method"}, status=400)

@csrf_exempt
def update_doctor(request, id):
    if request.method == 'PUT':
        data = get_data(request)
        Doctor.objects.filter(doctor_id=id).update(**data)
        return JsonResponse({"message": "Doctor updated successfully"})
    return JsonResponse({"error": "Invalid method"}, status=400)

@csrf_exempt
def delete_doctor(request, id):
    if request.method == 'DELETE':
        Doctor.objects.filter(doctor_id=id).delete()
        return JsonResponse({"message": "Doctor deleted successfully"})
    return JsonResponse({"error": "Invalid method"}, status=400)


# ---------------- APPOINTMENT APIs ---------------- #
@csrf_exempt
def add_appointment(request):
    if request.method == 'POST':
        data = get_data(request)
        appointment = Appointment.objects.create(**data)
        return JsonResponse({"message": "Appointment added successfully", "id": appointment.appointment_id})
    return JsonResponse({"error": "Invalid method"}, status=400)

def list_appointments(request):
    if request.method == 'GET':
        appointments = list(Appointment.objects.values())
        return JsonResponse(appointments, safe=False)
    return JsonResponse({"error": "Invalid method"}, status=400)

@csrf_exempt
def update_appointment(request, id):
    if request.method == 'PUT':
        data = get_data(request)
        Appointment.objects.filter(appointment_id=id).update(**data)
        return JsonResponse({"message": "Appointment updated successfully"})
    return JsonResponse({"error": "Invalid method"}, status=400)

@csrf_exempt
def delete_appointment(request, id):
    if request.method == 'DELETE':
        Appointment.objects.filter(appointment_id=id).delete()
        return JsonResponse({"message": "Appointment deleted successfully"})
    return JsonResponse({"error": "Invalid method"}, status=400)


# ---------------- MEDICAL RECORD APIs ---------------- #
@csrf_exempt
def add_record(request):
    if request.method == 'POST':
        data = get_data(request)
        record = MedicalRecord.objects.create(**data)
        return JsonResponse({"message": "Record added successfully", "id": record.record_id})
    return JsonResponse({"error": "Invalid method"}, status=400)

def list_records(request):
    if request.method == 'GET':
        records = list(MedicalRecord.objects.values())
        return JsonResponse(records, safe=False)
    return JsonResponse({"error": "Invalid method"}, status=400)

@csrf_exempt
def update_record(request, id):
    if request.method == 'PUT':
        data = get_data(request)
        MedicalRecord.objects.filter(record_id=id).update(**data)
        return JsonResponse({"message": "Record updated successfully"})
    return JsonResponse({"error": "Invalid method"}, status=400)

@csrf_exempt
def delete_record(request, id):
    if request.method == 'DELETE':
        MedicalRecord.objects.filter(record_id=id).delete()
        return JsonResponse({"message": "Record deleted successfully"})
    return JsonResponse({"error": "Invalid method"}, status=400)


# ---------------- BILLING APIs ---------------- #
@csrf_exempt
def add_bill(request):
    if request.method == 'POST':
        data = get_data(request)
        bill = Bill(**data)
        bill.save() # To trigger custom save method for total_amount
        return JsonResponse({"message": "Bill added successfully", "id": bill.bill_id})
    return JsonResponse({"error": "Invalid method"}, status=400)

def list_bills(request):
    if request.method == 'GET':
        bills = list(Bill.objects.values())
        return JsonResponse(bills, safe=False)
    return JsonResponse({"error": "Invalid method"}, status=400)

@csrf_exempt
def update_bill(request, id):
    if request.method == 'PUT':
        data = get_data(request)
        # Handle recalculation of total if needed
        bill = Bill.objects.filter(bill_id=id).first()
        if bill:
            for key, value in data.items():
                setattr(bill, key, value)
            bill.save()
            return JsonResponse({"message": "Bill updated successfully"})
        return JsonResponse({"error": "Not found"}, status=404)
    return JsonResponse({"error": "Invalid method"}, status=400)

@csrf_exempt
def delete_bill(request, id):
    if request.method == 'DELETE':
        Bill.objects.filter(bill_id=id).delete()
        return JsonResponse({"message": "Bill deleted successfully"})
    return JsonResponse({"error": "Invalid method"}, status=400)

# Optional Dashboard APIs
def dashboard_stats(request):
    if request.method == 'GET':
        stats = {
            "total_patients": Patient.objects.count(),
            "total_doctors": Doctor.objects.count(),
            "today_appointments": Appointment.objects.count(), # Simplifying
            "total_revenue": sum(b.total_amount for b in Bill.objects.all() if b.total_amount)
        }
        return JsonResponse(stats)
