"""Medicine API views for Pharmacy Management System."""

import os
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from bson import ObjectId
from .. import db
from ..utils import (
    success_response, error_response, get_request_user,
    parse_body, now, mongo_to_dict
)


def _get_admin(request):
    user = get_request_user(request)
    if not user:
        return None, error_response("Authentication required.", 401)
    if user.get('role') != 'admin':
        return None, error_response("Admin access required.", 403)
    return user, None


@csrf_exempt
def medicines_list(request):
    """GET /api/medicines | POST /api/medicines"""
    if request.method == 'GET':
        query = {}
        # Filtering
        category = request.GET.get('category')
        if category:
            query['category'] = {'$regex': category, '$options': 'i'}
        min_price = request.GET.get('minPrice')
        max_price = request.GET.get('maxPrice')
        if min_price or max_price:
            query['price'] = {}
            if min_price:
                query['price']['$gte'] = float(min_price)
            if max_price:
                query['price']['$lte'] = float(max_price)

        # Sorting
        sort_field = request.GET.get('sortBy', 'medicineName')
        sort_order = 1 if request.GET.get('order', 'asc') == 'asc' else -1
        valid_sort = {'medicineName': 'medicineName', 'price': 'price', 'name': 'medicineName'}
        sort_field = valid_sort.get(sort_field, 'medicineName')

        medicines = list(db.medicines_col().find(query).sort(sort_field, sort_order))
        return success_response([mongo_to_dict(m) for m in medicines])

    if request.method == 'POST':
        _, err = _get_admin(request)
        if err:
            return err
        # Handle multipart (file upload) or JSON
        if request.content_type and 'multipart' in request.content_type:
            data = request.POST
            image_file = request.FILES.get('image')
        else:
            data = parse_body(request)
            image_file = None

        name = data.get('medicineName', '').strip()
        if not name:
            return error_response("Medicine name is required.")

        image_path = ''
        if image_file:
            ext = os.path.splitext(image_file.name)[1]
            filename = f"medicine_{ObjectId()}{ext}"
            save_path = os.path.join(settings.MEDIA_ROOT, filename)
            with open(save_path, 'wb') as f:
                for chunk in image_file.chunks():
                    f.write(chunk)
            image_path = f"/media/{filename}"

        medicine = {
            'medicineName': name,
            'brand': data.get('brand', ''),
            'category': data.get('category', ''),
            'price': float(data.get('price', 0)),
            'stock': int(data.get('stock', 0)),
            'description': data.get('description', ''),
            'image': image_path,
            'expiryDate': data.get('expiryDate', ''),
            'manufacturer': data.get('manufacturer', ''),
            'createdAt': now(),
        }
        result = db.medicines_col().insert_one(medicine)
        medicine['_id'] = result.inserted_id
        return success_response(mongo_to_dict(medicine), "Medicine added.", 201)

    return error_response("Method not allowed.", 405)


@csrf_exempt
def medicine_search(request):
    """GET /api/medicines/search?q=query"""
    q = request.GET.get('q', '').strip()
    if not q:
        return error_response("Search query is required.")
    results = list(db.medicines_col().find({
        '$or': [
            {'medicineName': {'$regex': q, '$options': 'i'}},
            {'brand': {'$regex': q, '$options': 'i'}},
            {'category': {'$regex': q, '$options': 'i'}},
            {'description': {'$regex': q, '$options': 'i'}},
        ]
    }))
    return success_response([mongo_to_dict(m) for m in results])


@csrf_exempt
def medicine_by_category(request, category):
    """GET /api/medicines/category/{category}"""
    medicines = list(db.medicines_col().find({'category': {'$regex': category, '$options': 'i'}}))
    return success_response([mongo_to_dict(m) for m in medicines])


@csrf_exempt
def medicine_low_stock(request):
    """GET /api/medicines/low-stock — medicines with stock < 10"""
    medicines = list(db.medicines_col().find({'stock': {'$lt': 10}}).sort('stock', 1))
    return success_response([mongo_to_dict(m) for m in medicines])


@csrf_exempt
def medicine_detail(request, medicine_id):
    """GET/PUT/DELETE /api/medicines/{id}"""
    try:
        oid = ObjectId(medicine_id)
    except Exception:
        return error_response("Invalid medicine ID.")

    med = db.medicines_col().find_one({'_id': oid})
    if not med:
        return error_response("Medicine not found.", 404)

    if request.method == 'GET':
        return success_response(mongo_to_dict(med))

    if request.method == 'PUT':
        _, err = _get_admin(request)
        if err:
            return err

        if request.content_type and 'multipart' in request.content_type:
            data = request.POST
            image_file = request.FILES.get('image')
        else:
            data = parse_body(request)
            image_file = None

        update = {}
        for field in ['medicineName', 'brand', 'category', 'description', 'expiryDate', 'manufacturer']:
            if field in data:
                update[field] = data[field]
        if 'price' in data:
            update['price'] = float(data['price'])
        if 'stock' in data:
            update['stock'] = int(data['stock'])

        if image_file:
            ext = os.path.splitext(image_file.name)[1]
            filename = f"medicine_{oid}{ext}"
            save_path = os.path.join(settings.MEDIA_ROOT, filename)
            with open(save_path, 'wb') as f:
                for chunk in image_file.chunks():
                    f.write(chunk)
            update['image'] = f"/media/{filename}"

        if update:
            db.medicines_col().update_one({'_id': oid}, {'$set': update})
        updated = db.medicines_col().find_one({'_id': oid})
        return success_response(mongo_to_dict(updated), "Medicine updated.")

    if request.method == 'DELETE':
        _, err = _get_admin(request)
        if err:
            return err
        db.medicines_col().delete_one({'_id': oid})
        return success_response(message="Medicine deleted.")

    return error_response("Method not allowed.", 405)
