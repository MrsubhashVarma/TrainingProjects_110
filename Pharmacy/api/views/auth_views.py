"""Authentication API views for Pharmacy Management System."""

from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from bson import ObjectId
from .. import db
from ..utils import (
    success_response, error_response, hash_password, verify_password,
    generate_token, get_request_user, require_auth, parse_body, now, mongo_to_dict
)


@csrf_exempt
@require_http_methods(["POST"])
def register(request):
    """POST /api/register — Register a new customer."""
    data = parse_body(request)
    name = data.get('name', '').strip()
    email = data.get('email', '').strip().lower()
    phone = data.get('phone', '').strip()
    password = data.get('password', '')
    address = data.get('address', '')

    if not all([name, email, password]):
        return error_response("Name, email, and password are required.")

    if db.users_col().find_one({'email': email}):
        return error_response("Email already registered.")

    user = {
        'name': name,
        'email': email,
        'phone': phone,
        'password': hash_password(password),
        'address': address,
        'role': 'customer',
        'isBlocked': False,
        'createdAt': now(),
    }
    result = db.users_col().insert_one(user)
    user['_id'] = result.inserted_id
    user.pop('password')

    token = generate_token()
    db.tokens_col().insert_one({'token': token, 'userId': result.inserted_id, 'createdAt': now()})

    return success_response({
        'user': mongo_to_dict(user),
        'token': token
    }, "Registration successful.", 201)


@csrf_exempt
@require_http_methods(["POST"])
def login(request):
    """POST /api/login — Login user."""
    data = parse_body(request)
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    if not email or not password:
        return error_response("Email and password are required.")

    user = db.users_col().find_one({'email': email})
    if not user or not verify_password(password, user['password']):
        return error_response("Invalid email or password.", 401)

    if user.get('isBlocked'):
        return error_response("Your account has been blocked. Contact admin.", 403)

    token = generate_token()
    db.tokens_col().insert_one({'token': token, 'userId': user['_id'], 'createdAt': now()})

    user_data = mongo_to_dict(user)
    user_data.pop('password', None)

    return success_response({'user': user_data, 'token': token}, "Login successful.")


@csrf_exempt
@require_http_methods(["POST"])
def logout(request):
    """POST /api/logout — Logout user (delete token)."""
    auth_header = request.META.get('HTTP_AUTHORIZATION', '')
    if auth_header.startswith('Bearer '):
        token = auth_header[7:]
        db.tokens_col().delete_one({'token': token})
    return success_response(message="Logged out successfully.")


@csrf_exempt
@require_http_methods(["GET", "PUT"])
def profile(request):
    """GET/PUT /api/profile — Get or update user profile."""
    user = get_request_user(request)
    if not user:
        return error_response("Authentication required.", 401)

    if request.method == 'GET':
        user_data = mongo_to_dict(user)
        user_data.pop('password', None)
        return success_response(user_data)

    # PUT — update profile
    data = parse_body(request)
    update_fields = {}
    for field in ['name', 'phone', 'address']:
        if field in data:
            update_fields[field] = data[field]

    if 'newPassword' in data and data['newPassword']:
        if not data.get('currentPassword'):
            return error_response("Current password is required to change password.")
        if not verify_password(data['currentPassword'], user['password']):
            return error_response("Current password is incorrect.")
        update_fields['password'] = hash_password(data['newPassword'])

    if update_fields:
        db.users_col().update_one({'_id': user['_id']}, {'$set': update_fields})

    updated = db.users_col().find_one({'_id': user['_id']})
    updated_data = mongo_to_dict(updated)
    updated_data.pop('password', None)
    return success_response(updated_data, "Profile updated successfully.")
