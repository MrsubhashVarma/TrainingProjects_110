import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from Backend.db import participants_collection, IS_MOCK_MODE

@csrf_exempt
def get_all_participants(request):
    """
    GET /participants/
    Retrieve all registered participants.
    """
    if request.method != 'GET':
        return JsonResponse({'error': 'Method not allowed. Use GET.'}, status=405)
    try:
        participants = list(participants_collection.find())
        for p in participants:
            p['id'] = str(p['_id'])
            del p['_id']
        
        response = JsonResponse(participants, safe=False)
        response['X-Database-Mode'] = 'Mock-JSON' if IS_MOCK_MODE else 'MongoDB-Atlas'
        return response
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
def add_participant(request):
    """
    POST /participants/add/
    Register a new participant.
    """
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed. Use POST.'}, status=405)
    try:
        data = json.loads(request.body)
        
        participant_id = data.get('participant_id')
        full_name = data.get('full_name')
        email = data.get('email')
        phone = data.get('phone')
        college = data.get('college')
        event_name = data.get('event_name')
        registration_fee = data.get('registration_fee')
        
        # Validations for presence
        if (participant_id is None or not full_name or not email or 
                not phone or not college or not event_name or registration_fee is None):
            return JsonResponse({'error': 'All fields are required.'}, status=400)
            
        # Type casting and bounds checks
        try:
            participant_id = int(participant_id)
            registration_fee = float(registration_fee)
        except ValueError:
            return JsonResponse({'error': 'Participant ID must be an integer. Registration Fee must be a number.'}, status=400)
            
        if participant_id <= 0:
            return JsonResponse({'error': 'Participant ID must be a positive integer.'}, status=400)
        if registration_fee < 0:
            return JsonResponse({'error': 'Registration Fee cannot be negative.'}, status=400)
            
        # Check if participant_id is unique
        existing = participants_collection.find_one({'participant_id': participant_id})
        if existing:
            return JsonResponse({'error': f'Participant with ID {participant_id} already exists.'}, status=400)
            
        new_p = {
            'participant_id': participant_id,
            'full_name': full_name.strip(),
            'email': email.strip(),
            'phone': phone.strip(),
            'college': college.strip(),
            'event_name': event_name.strip(),
            'registration_fee': registration_fee
        }
        
        result = participants_collection.insert_one(new_p)
        new_p['id'] = str(result.inserted_id)
        if '_id' in new_p:
            del new_p['_id']
            
        response = JsonResponse(new_p, status=201)
        response['X-Database-Mode'] = 'Mock-JSON' if IS_MOCK_MODE else 'MongoDB-Atlas'
        return response
        
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON in request body.'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
def update_participant(request, participant_id):
    """
    PUT /participants/update/<participant_id>/
    Update an existing participant.
    """
    if request.method != 'PUT':
        return JsonResponse({'error': 'Method not allowed. Use PUT.'}, status=405)
    try:
        try:
            participant_id = int(participant_id)
        except ValueError:
            return JsonResponse({'error': 'Invalid Participant ID format.'}, status=400)
            
        # Check if participant exists
        existing = participants_collection.find_one({'participant_id': participant_id})
        if not existing:
            return JsonResponse({'error': f'Participant with ID {participant_id} not found.'}, status=404)
            
        data = json.loads(request.body)
        update_fields = {}
        
        if 'full_name' in data:
            update_fields['full_name'] = data['full_name'].strip()
        if 'email' in data:
            update_fields['email'] = data['email'].strip()
        if 'phone' in data:
            update_fields['phone'] = data['phone'].strip()
        if 'college' in data:
            update_fields['college'] = data['college'].strip()
        if 'event_name' in data:
            update_fields['event_name'] = data['event_name'].strip()
        if 'registration_fee' in data:
            try:
                fee_val = float(data['registration_fee'])
                if fee_val < 0:
                    return JsonResponse({'error': 'Registration Fee cannot be negative.'}, status=400)
                update_fields['registration_fee'] = fee_val
            except ValueError:
                return JsonResponse({'error': 'Registration Fee must be a number.'}, status=400)
                
        if not update_fields:
            return JsonResponse({'error': 'No fields provided to update.'}, status=400)
            
        participants_collection.update_one({'participant_id': participant_id}, {'$set': update_fields})
        
        # Get updated document
        updated_p = participants_collection.find_one({'participant_id': participant_id})
        updated_p['id'] = str(updated_p['_id'])
        del updated_p['_id']
        
        response = JsonResponse(updated_p)
        response['X-Database-Mode'] = 'Mock-JSON' if IS_MOCK_MODE else 'MongoDB-Atlas'
        return response
        
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON in request body.'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
def delete_participant(request, participant_id):
    """
    DELETE /participants/delete/<participant_id>/
    Delete participant registration.
    """
    if request.method != 'DELETE':
        return JsonResponse({'error': 'Method not allowed. Use DELETE.'}, status=405)
    try:
        try:
            participant_id = int(participant_id)
        except ValueError:
            return JsonResponse({'error': 'Invalid Participant ID format.'}, status=400)
            
        # Check if participant exists
        existing = participants_collection.find_one({'participant_id': participant_id})
        if not existing:
            return JsonResponse({'error': f'Participant with ID {participant_id} not found.'}, status=404)
            
        participants_collection.delete_one({'participant_id': participant_id})
        
        response = JsonResponse({'message': f'Participant with ID {participant_id} has been deleted successfully.'})
        response['X-Database-Mode'] = 'Mock-JSON' if IS_MOCK_MODE else 'MongoDB-Atlas'
        return response
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
