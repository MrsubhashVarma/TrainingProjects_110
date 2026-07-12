"""Utility functions for Pharmacy Management System."""

import hashlib
import secrets
import json
from datetime import datetime
from bson import ObjectId
from django.http import JsonResponse
from . import db


class MongoJSONEncoder(json.JSONEncoder):
    """Custom JSON encoder to handle MongoDB ObjectId and datetime."""
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        if isinstance(obj, datetime):
            return obj.isoformat()
        return super().default(obj)


def mongo_to_dict(doc):
    """Convert a MongoDB document to a JSON-serializable dict."""
    if doc is None:
        return None
    result = {}
    for key, value in doc.items():
        if isinstance(value, ObjectId):
            result[key] = str(value)
        elif isinstance(value, datetime):
            result[key] = value.isoformat()
        elif isinstance(value, list):
            result[key] = [mongo_to_dict(item) if isinstance(item, dict) else
                           str(item) if isinstance(item, ObjectId) else item
                           for item in value]
        elif isinstance(value, dict):
            result[key] = mongo_to_dict(value)
        else:
            result[key] = value
    return result


def success_response(data=None, message="Success", status=200):
    """Return a standardized success JSON response."""
    response = {"success": True, "message": message}
    if data is not None:
        response["data"] = data
    return JsonResponse(response, status=status, encoder=MongoJSONEncoder)


def error_response(message="Error", status=400):
    """Return a standardized error JSON response."""
    return JsonResponse({"success": False, "message": message}, status=status)


def hash_password(password: str) -> str:
    """Hash a password using SHA-256."""
    return hashlib.sha256(password.encode()).hexdigest()


def verify_password(plain: str, hashed: str) -> bool:
    """Verify a plain password against a hashed password."""
    return hash_password(plain) == hashed


def generate_token() -> str:
    """Generate a secure random token."""
    return secrets.token_hex(32)


def get_request_user(request):
    """Extract authenticated user from request using Bearer token."""
    auth_header = request.META.get('HTTP_AUTHORIZATION', '')
    if not auth_header.startswith('Bearer '):
        return None
    token = auth_header[7:]
    token_doc = db.tokens_col().find_one({'token': token})
    if not token_doc:
        return None
    user = db.users_col().find_one({'_id': token_doc['userId']})
    return user


def require_auth(func):
    """Decorator: require authenticated user."""
    def wrapper(request, *args, **kwargs):
        user = get_request_user(request)
        if not user:
            return error_response("Authentication required.", 401)
        request.current_user = user
        return func(request, *args, **kwargs)
    wrapper.__name__ = func.__name__
    return wrapper


def require_admin(func):
    """Decorator: require admin role."""
    def wrapper(request, *args, **kwargs):
        user = get_request_user(request)
        if not user:
            return error_response("Authentication required.", 401)
        if user.get('role') != 'admin':
            return error_response("Admin access required.", 403)
        request.current_user = user
        return func(request, *args, **kwargs)
    wrapper.__name__ = func.__name__
    return wrapper


def parse_body(request):
    """Parse JSON request body."""
    try:
        return json.loads(request.body)
    except Exception:
        return {}


def now():
    """Return current UTC datetime."""
    return datetime.utcnow()
