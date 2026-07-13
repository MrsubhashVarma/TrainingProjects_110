"""Cart API views for Pharmacy Management System."""

from django.views.decorators.csrf import csrf_exempt
from bson import ObjectId
from .. import db
from ..utils import (
    success_response, error_response, get_request_user,
    parse_body, now, mongo_to_dict
)


def _require_user(request):
    user = get_request_user(request)
    if not user:
        return None, error_response("Authentication required.", 401)
    return user, None


def _calc_total(items):
    return sum(item.get('price', 0) * item.get('quantity', 1) for item in items)


@csrf_exempt
def cart_view(request):
    """GET /api/cart | DELETE /api/cart/clear"""
    user, err = _require_user(request)
    if err:
        return err

    if request.method == 'GET':
        cart = db.cart_col().find_one({'userId': user['_id']})
        if not cart:
            cart = {'userId': user['_id'], 'items': [], 'total': 0}
        return success_response(mongo_to_dict(cart))

    return error_response("Method not allowed.", 405)


@csrf_exempt
def cart_add(request):
    """POST /api/cart/add — add item to cart."""
    user, err = _require_user(request)
    if err:
        return err

    data = parse_body(request)
    medicine_id_str = data.get('medicineId', '')
    quantity = int(data.get('quantity', 1))

    try:
        med_oid = ObjectId(medicine_id_str)
    except Exception:
        return error_response("Invalid medicine ID.")

    medicine = db.medicines_col().find_one({'_id': med_oid})
    if not medicine:
        return error_response("Medicine not found.", 404)
    if medicine.get('stock', 0) < quantity:
        return error_response(f"Only {medicine.get('stock', 0)} units in stock.")

    cart = db.cart_col().find_one({'userId': user['_id']})
    if not cart:
        cart = {'userId': user['_id'], 'items': [], 'total': 0, 'createdAt': now()}

    items = cart.get('items', [])
    # Check if already in cart
    existing = next((i for i in items if str(i.get('medicineId', '')) == medicine_id_str), None)
    if existing:
        existing['quantity'] += quantity
    else:
        items.append({
            'medicineId': med_oid,
            'medicineName': medicine.get('medicineName', ''),
            'image': medicine.get('image', ''),
            'quantity': quantity,
            'price': medicine.get('price', 0),
        })

    total = _calc_total(items)
    db.cart_col().update_one(
        {'userId': user['_id']},
        {'$set': {'items': items, 'total': total}},
        upsert=True
    )
    updated = db.cart_col().find_one({'userId': user['_id']})
    return success_response(mongo_to_dict(updated), "Item added to cart.")


@csrf_exempt
def cart_update(request):
    """PUT /api/cart/update — update item quantity."""
    user, err = _require_user(request)
    if err:
        return err

    data = parse_body(request)
    medicine_id_str = data.get('medicineId', '')
    quantity = int(data.get('quantity', 1))

    if quantity <= 0:
        return cart_remove_by_id(request, medicine_id_str)

    cart = db.cart_col().find_one({'userId': user['_id']})
    if not cart:
        return error_response("Cart not found.", 404)

    items = cart.get('items', [])
    for item in items:
        if str(item.get('medicineId', '')) == medicine_id_str:
            item['quantity'] = quantity
            break

    total = _calc_total(items)
    db.cart_col().update_one({'userId': user['_id']}, {'$set': {'items': items, 'total': total}})
    updated = db.cart_col().find_one({'userId': user['_id']})
    return success_response(mongo_to_dict(updated), "Cart updated.")


@csrf_exempt
def cart_remove(request, medicine_id):
    """DELETE /api/cart/remove/{id} — remove item from cart."""
    return cart_remove_by_id(request, medicine_id)


def cart_remove_by_id(request, medicine_id_str):
    user, err = _require_user(request)
    if err:
        return err

    cart = db.cart_col().find_one({'userId': user['_id']})
    if not cart:
        return error_response("Cart not found.", 404)

    items = [i for i in cart.get('items', []) if str(i.get('medicineId', '')) != medicine_id_str]
    total = _calc_total(items)
    db.cart_col().update_one({'userId': user['_id']}, {'$set': {'items': items, 'total': total}})
    updated = db.cart_col().find_one({'userId': user['_id']})
    return success_response(mongo_to_dict(updated), "Item removed from cart.")


@csrf_exempt
def cart_clear(request):
    """DELETE /api/cart/clear — clear all cart items."""
    user, err = _require_user(request)
    if err:
        return err

    db.cart_col().update_one(
        {'userId': user['_id']},
        {'$set': {'items': [], 'total': 0}},
        upsert=True
    )
    return success_response(message="Cart cleared.")
