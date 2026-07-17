import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .db import Passenger, Ship, Schedule, Booking, Payment

# Helper function to parse JSON body
def parse_body(request):
    try:
        return json.loads(request.body)
    except Exception:
        return {}

# Root endpoint welcome index
@csrf_exempt
def api_root(request):
    return JsonResponse({
        'name': 'OceanVoyage REST API',
        'status': 'active',
        'version': '1.0',
        'endpoints': {
            'passengers_add': '/passengers/add/',
            'passengers_list': '/passengers/',
            'ships_add': '/ships/add/',
            'ships_list': '/ships/',
            'schedules_add': '/schedules/add/',
            'schedules_list': '/schedules/',
            'bookings_add': '/bookings/add/',
            'bookings_list': '/bookings/',
            'payments_add': '/payments/add/',
            'payments_list': '/payments/'
        }
    })

# ==================== PASSENGER VIEWS ====================
@csrf_exempt
@require_http_methods(["POST"])
def passenger_add(request):
    try:
        body = parse_body(request)
        # Handle manual passenger_id if provided (e.g. for seed data)
        p_id = body.get('passenger_id')
        
        passenger = Passenger(
            full_name=body.get('full_name'),
            email=body.get('email'),
            phone=body.get('phone'),
            nationality=body.get('nationality'),
            passport_number=body.get('passport_number'),
            password=body.get('password')
        )
        if p_id is not None:
            passenger.passenger_id = int(p_id)
        passenger.save()
        return JsonResponse({
            'status': 'success',
            'message': 'Passenger registered successfully',
            'data': {
                'passenger_id': passenger.passenger_id,
                'full_name': passenger.full_name,
                'email': passenger.email
            }
        }, status=201)
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=400)

@csrf_exempt
@require_http_methods(["GET"])
def passenger_list(request):
    try:
        passengers = Passenger.objects.all().order_by('passenger_id')
        data = [{
            'passenger_id': p.passenger_id,
            'full_name': p.full_name,
            'email': p.email,
            'phone': p.phone,
            'nationality': p.nationality,
            'passport_number': p.passport_number,
            'password': p.password
        } for p in passengers]
        return JsonResponse(data, safe=False)
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["PUT"])
def passenger_update(request, pk):
    try:
        passenger = Passenger.objects.get(pk=pk)
        body = parse_body(request)
        passenger.full_name = body.get('full_name', passenger.full_name)
        passenger.email = body.get('email', passenger.email)
        passenger.phone = body.get('phone', passenger.phone)
        passenger.nationality = body.get('nationality', passenger.nationality)
        passenger.passport_number = body.get('passport_number', passenger.passport_number)
        passenger.password = body.get('password', passenger.password)
        passenger.save()
        return JsonResponse({
            'status': 'success',
            'message': 'Passenger updated successfully',
            'data': {
                'passenger_id': passenger.passenger_id,
                'full_name': passenger.full_name
            }
        })
    except Passenger.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Passenger not found'}, status=404)
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=400)

@csrf_exempt
@require_http_methods(["DELETE"])
def passenger_delete(request, pk):
    try:
        passenger = Passenger.objects.get(pk=pk)
        passenger.delete()
        return JsonResponse({'status': 'success', 'message': 'Passenger deleted successfully'})
    except Passenger.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Passenger not found'}, status=404)
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=400)


# ==================== SHIP VIEWS ====================
@csrf_exempt
@require_http_methods(["POST"])
def ship_add(request):
    try:
        body = parse_body(request)
        s_id = body.get('ship_id')
        
        ship = Ship(
            ship_name=body.get('ship_name'),
            ship_type=body.get('ship_type'),
            capacity=int(body.get('capacity', 0)),
            operator_name=body.get('operator_name'),
            status=body.get('status')
        )
        if s_id is not None:
            ship.ship_id = int(s_id)
        ship.save()
        return JsonResponse({
            'status': 'success',
            'message': 'Ship added successfully',
            'data': {
                'ship_id': ship.ship_id,
                'ship_name': ship.ship_name
            }
        }, status=201)
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=400)

@csrf_exempt
@require_http_methods(["GET"])
def ship_list(request):
    try:
        ships = Ship.objects.all().order_by('ship_id')
        data = [{
            'ship_id': s.ship_id,
            'ship_name': s.ship_name,
            'ship_type': s.ship_type,
            'capacity': s.capacity,
            'operator_name': s.operator_name,
            'status': s.status
        } for s in ships]
        return JsonResponse(data, safe=False)
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["PUT"])
def ship_update(request, pk):
    try:
        ship = Ship.objects.get(pk=pk)
        body = parse_body(request)
        ship.ship_name = body.get('ship_name', ship.ship_name)
        ship.ship_type = body.get('ship_type', ship.ship_type)
        ship.capacity = int(body.get('capacity', ship.capacity))
        ship.operator_name = body.get('operator_name', ship.operator_name)
        ship.status = body.get('status', ship.status)
        ship.save()
        return JsonResponse({
            'status': 'success',
            'message': 'Ship updated successfully',
            'data': {
                'ship_id': ship.ship_id,
                'ship_name': ship.ship_name
            }
        })
    except Ship.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Ship not found'}, status=404)
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=400)

@csrf_exempt
@require_http_methods(["DELETE"])
def ship_delete(request, pk):
    try:
        ship = Ship.objects.get(pk=pk)
        ship.delete()
        return JsonResponse({'status': 'success', 'message': 'Ship deleted successfully'})
    except Ship.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Ship not found'}, status=404)
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=400)


# ==================== ROUTE & SCHEDULE VIEWS ====================
@csrf_exempt
@require_http_methods(["POST"])
def schedule_add(request):
    try:
        body = parse_body(request)
        sc_id = body.get('schedule_id')
        
        schedule = Schedule(
            ship_name=body.get('ship_name'),
            source_port=body.get('source_port'),
            destination_port=body.get('destination_port'),
            departure_date=body.get('departure_date'),
            departure_time=body.get('departure_time'),
            arrival_date=body.get('arrival_date'),
            arrival_time=body.get('arrival_time'),
            fare=float(body.get('fare', 0))
        )
        if sc_id is not None:
            schedule.schedule_id = int(sc_id)
        schedule.save()
        return JsonResponse({
            'status': 'success',
            'message': 'Schedule added successfully',
            'data': {
                'schedule_id': schedule.schedule_id,
                'ship_name': schedule.ship_name
            }
        }, status=201)
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=400)

@csrf_exempt
@require_http_methods(["GET"])
def schedule_list(request):
    try:
        schedules = Schedule.objects.all().order_by('schedule_id')
        data = [{
            'schedule_id': s.schedule_id,
            'ship_name': s.ship_name,
            'source_port': s.source_port,
            'destination_port': s.destination_port,
            'departure_date': str(s.departure_date),
            'departure_time': str(s.departure_time),
            'arrival_date': str(s.arrival_date),
            'arrival_time': str(s.arrival_time),
            'fare': s.fare
        } for s in schedules]
        return JsonResponse(data, safe=False)
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["PUT"])
def schedule_update(request, pk):
    try:
        schedule = Schedule.objects.get(pk=pk)
        body = parse_body(request)
        schedule.ship_name = body.get('ship_name', schedule.ship_name)
        schedule.source_port = body.get('source_port', schedule.source_port)
        schedule.destination_port = body.get('destination_port', schedule.destination_port)
        schedule.departure_date = body.get('departure_date', schedule.departure_date)
        schedule.departure_time = body.get('departure_time', schedule.departure_time)
        schedule.arrival_date = body.get('arrival_date', schedule.arrival_date)
        schedule.arrival_time = body.get('arrival_time', schedule.arrival_time)
        schedule.fare = float(body.get('fare', schedule.fare))
        schedule.save()
        return JsonResponse({
            'status': 'success',
            'message': 'Schedule updated successfully',
            'data': {
                'schedule_id': schedule.schedule_id
            }
        })
    except Schedule.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Schedule not found'}, status=404)
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=400)

@csrf_exempt
@require_http_methods(["DELETE"])
def schedule_delete(request, pk):
    try:
        schedule = Schedule.objects.get(pk=pk)
        schedule.delete()
        return JsonResponse({'status': 'success', 'message': 'Schedule deleted successfully'})
    except Schedule.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Schedule not found'}, status=404)
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=400)


# ==================== BOOKING VIEWS ====================
@csrf_exempt
@require_http_methods(["POST"])
def booking_add(request):
    try:
        body = parse_body(request)
        b_id = body.get('booking_id')
        
        booking = Booking(
            passenger_name=body.get('passenger_name'),
            ship_name=body.get('ship_name'),
            cabin_type=body.get('cabin_type'),
            journey_date=body.get('journey_date'),
            source_port=body.get('source_port'),
            destination_port=body.get('destination_port'),
            total_amount=float(body.get('total_amount', 0)),
            booking_status=body.get('booking_status', 'Confirmed')
        )
        if b_id is not None:
            booking.booking_id = int(b_id)
        booking.save()
        return JsonResponse({
            'status': 'success',
            'message': 'Booking registered successfully',
            'data': {
                'booking_id': booking.booking_id,
                'passenger_name': booking.passenger_name,
                'booking_status': booking.booking_status
            }
        }, status=201)
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=400)

@csrf_exempt
@require_http_methods(["GET"])
def booking_list(request):
    try:
        bookings = Booking.objects.all().order_by('booking_id')
        data = [{
            'booking_id': b.booking_id,
            'passenger_name': b.passenger_name,
            'ship_name': b.ship_name,
            'cabin_type': b.cabin_type,
            'journey_date': str(b.journey_date),
            'source_port': b.source_port,
            'destination_port': b.destination_port,
            'total_amount': b.total_amount,
            'booking_status': b.booking_status
        } for b in bookings]
        return JsonResponse(data, safe=False)
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["PUT"])
def booking_update(request, pk):
    try:
        booking = Booking.objects.get(pk=pk)
        body = parse_body(request)
        booking.passenger_name = body.get('passenger_name', booking.passenger_name)
        booking.ship_name = body.get('ship_name', booking.ship_name)
        booking.cabin_type = body.get('cabin_type', booking.cabin_type)
        booking.journey_date = body.get('journey_date', booking.journey_date)
        booking.source_port = body.get('source_port', booking.source_port)
        booking.destination_port = body.get('destination_port', booking.destination_port)
        booking.total_amount = float(body.get('total_amount', booking.total_amount))
        booking.booking_status = body.get('booking_status', booking.booking_status)
        booking.save()
        return JsonResponse({
            'status': 'success',
            'message': 'Booking updated successfully',
            'data': {
                'booking_id': booking.booking_id,
                'booking_status': booking.booking_status
            }
        })
    except Booking.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Booking not found'}, status=404)
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=400)

@csrf_exempt
@require_http_methods(["DELETE"])
def booking_delete(request, pk):
    try:
        booking = Booking.objects.get(pk=pk)
        booking.delete()
        return JsonResponse({'status': 'success', 'message': 'Booking deleted successfully'})
    except Booking.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Booking not found'}, status=404)
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=400)


# ==================== PAYMENT VIEWS ====================
@csrf_exempt
@require_http_methods(["POST"])
def payment_add(request):
    try:
        body = parse_body(request)
        pay_id = body.get('payment_id')
        
        payment = Payment(
            booking_id=int(body.get('booking_id', 0)),
            passenger_name=body.get('passenger_name'),
            amount=float(body.get('amount', 0)),
            payment_method=body.get('payment_method'),
            payment_status=body.get('payment_status', 'Pending'),
            transaction_id=body.get('transaction_id'),
            payment_date=body.get('payment_date')
        )
        if pay_id is not None:
            payment.payment_id = int(pay_id)
        payment.save()
        return JsonResponse({
            'status': 'success',
            'message': 'Payment registered successfully',
            'data': {
                'payment_id': payment.payment_id,
                'booking_id': payment.booking_id,
                'payment_status': payment.payment_status
            }
        }, status=201)
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=400)

@csrf_exempt
@require_http_methods(["GET"])
def payment_list(request):
    try:
        payments = Payment.objects.all().order_by('payment_id')
        data = [{
            'payment_id': p.payment_id,
            'booking_id': p.booking_id,
            'passenger_name': p.passenger_name,
            'amount': p.amount,
            'payment_method': p.payment_method,
            'payment_status': p.payment_status,
            'transaction_id': p.transaction_id,
            'payment_date': str(p.payment_date)
        } for p in payments]
        return JsonResponse(data, safe=False)
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["PUT"])
def payment_update(request, pk):
    try:
        payment = Payment.objects.get(pk=pk)
        body = parse_body(request)
        payment.booking_id = int(body.get('booking_id', payment.booking_id))
        payment.passenger_name = body.get('passenger_name', payment.passenger_name)
        payment.amount = float(body.get('amount', payment.amount))
        payment.payment_method = body.get('payment_method', payment.payment_method)
        payment.payment_status = body.get('payment_status', payment.payment_status)
        payment.transaction_id = body.get('transaction_id', payment.transaction_id)
        payment.payment_date = body.get('payment_date', payment.payment_date)
        payment.save()
        return JsonResponse({
            'status': 'success',
            'message': 'Payment updated successfully',
            'data': {
                'payment_id': payment.payment_id,
                'payment_status': payment.payment_status
            }
        })
    except Payment.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Payment not found'}, status=404)
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=400)

@csrf_exempt
@require_http_methods(["DELETE"])
def payment_delete(request, pk):
    try:
        payment = Payment.objects.get(pk=pk)
        payment.delete()
        return JsonResponse({'status': 'success', 'message': 'Payment deleted successfully'})
    except Payment.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Payment not found'}, status=404)
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=400)
