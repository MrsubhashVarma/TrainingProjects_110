"""Category API views for Pharmacy Management System."""

from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from bson import ObjectId
from .. import db
from ..utils import (
    success_response, error_response, require_auth, require_admin,
    parse_body, now, mongo_to_dict
)


@csrf_exempt
def categories_list(request):
    """GET /api/categories — list all | POST /api/categories — add (admin)."""
    if request.method == 'GET':
        cats = list(db.categories_col().find())
        return success_response([mongo_to_dict(c) for c in cats])

    if request.method == 'POST':
        user = _get_admin(request)
        if isinstance(user, type(error_response())):
            return user
        data = parse_body(request)
        name = data.get('categoryName', '').strip()
        if not name:
            return error_response("Category name is required.")
        if db.categories_col().find_one({'categoryName': {'$regex': f'^{name}$', '$options': 'i'}}):
            return error_response("Category already exists.")
        cat = {'categoryName': name, 'description': data.get('description', ''), 'createdAt': now()}
        result = db.categories_col().insert_one(cat)
        cat['_id'] = result.inserted_id
        return success_response(mongo_to_dict(cat), "Category created.", 201)

    return error_response("Method not allowed.", 405)


@csrf_exempt
def category_detail(request, category_id):
    """GET/PUT/DELETE /api/categories/{id}"""
    try:
        oid = ObjectId(category_id)
    except Exception:
        return error_response("Invalid category ID.")

    cat = db.categories_col().find_one({'_id': oid})
    if not cat:
        return error_response("Category not found.", 404)

    if request.method == 'GET':
        return success_response(mongo_to_dict(cat))

    if request.method == 'PUT':
        user = _get_admin(request)
        if isinstance(user, type(error_response())):
            return user
        data = parse_body(request)
        update = {}
        if 'categoryName' in data:
            update['categoryName'] = data['categoryName']
        if 'description' in data:
            update['description'] = data['description']
        if update:
            db.categories_col().update_one({'_id': oid}, {'$set': update})
        updated = db.categories_col().find_one({'_id': oid})
        return success_response(mongo_to_dict(updated), "Category updated.")

    if request.method == 'DELETE':
        user = _get_admin(request)
        if isinstance(user, type(error_response())):
            return user
        db.categories_col().delete_one({'_id': oid})
        return success_response(message="Category deleted.")

    return error_response("Method not allowed.", 405)


def _get_admin(request):
    """Helper: validate admin token from request."""
    from ..utils import get_request_user
    user = get_request_user(request)
    if not user:
        return error_response("Authentication required.", 401)
    if user.get('role') != 'admin':
        return error_response("Admin access required.", 403)
    return user
