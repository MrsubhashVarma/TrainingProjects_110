"""Order API views for Pharmacy Management System."""

from django.views.decorators.csrf import csrf_exempt
from bson import ObjectId
from .. import db
from ..utils import (
    success_response, error_response, get_request_user,
    parse_body, now, mongo_to_dict
)

ORDER_STATUSES = ['Pending', 'Confirmed', 'Dispatched', 'Delivered', 'Cancelled']


def _require_user(request):
    user = get_request_user(request)
    if not user:
        return None, error_response("Authentication required.", 401)
    return user, None


@csrf_exempt
def orders_list(request):
    """GET /api/orders | POST /api/orders"""
    user, err = _require_user(request)
    if err:
        return err

    if request.method == 'GET':
        # Admin sees all orders, customers see their own
        if user.get('role') == 'admin':
            orders = list(db.orders_col().find().sort('createdAt', -1))
        else:
            orders = list(db.orders_col().find({'userId': user['_id']}).sort('createdAt', -1))

        # Enrich with user name for admin
        enriched = []
        for o in orders:
            od = mongo_to_dict(o)
            if user.get('role') == 'admin':
                u = db.users_col().find_one({'_id': o.get('userId')})
                od['userName'] = u.get('name', '') if u else 'Unknown'
                od['userEmail'] = u.get('email', '') if u else ''
            enriched.append(od)
        return success_response(enriched)

    if request.method == 'POST':
        data = parse_body(request)
        # Get cart or use items from request
        cart = db.cart_col().find_one({'userId': user['_id']})
        if not cart or not cart.get('items'):
            return error_response("Cart is empty. Add items before placing order.")

        items = cart.get('items', [])
        total_amount = cart.get('total', 0)

        # Deduct stock
        for item in items:
            med_id = item.get('medicineId')
            qty = item.get('quantity', 1)
            db.medicines_col().update_one({'_id': med_id}, {'$inc': {'stock': -qty}})

        order = {
            'userId': user['_id'],
            'userName': user.get('name', ''),
            'userEmail': user.get('email', ''),
            'userPhone': user.get('phone', ''),
            'shippingAddress': data.get('address', user.get('address', '')),
            'items': items,
            'totalAmount': total_amount,
            'paymentMethod': data.get('paymentMethod', 'Cash on Delivery'),
            'status': 'Pending',
            'createdAt': now(),
        }
        result = db.orders_col().insert_one(order)
        order['_id'] = result.inserted_id

        # Clear cart
        db.cart_col().update_one({'userId': user['_id']}, {'$set': {'items': [], 'total': 0}})

        return success_response(mongo_to_dict(order), "Order placed successfully.", 201)

    return error_response("Method not allowed.", 405)


@csrf_exempt
def order_detail(request, order_id):
    """GET/PUT/DELETE /api/orders/{id}"""
    user, err = _require_user(request)
    if err:
        return err

    try:
        oid = ObjectId(order_id)
    except Exception:
        return error_response("Invalid order ID.")

    order = db.orders_col().find_one({'_id': oid})
    if not order:
        return error_response("Order not found.", 404)

    # Customers can only access their own orders
    if user.get('role') != 'admin' and str(order.get('userId')) != str(user['_id']):
        return error_response("Access denied.", 403)

    if request.method == 'GET':
        return success_response(mongo_to_dict(order))

    if request.method == 'PUT':
        data = parse_body(request)
        update = {}

        if user.get('role') == 'admin':
            # Admin can update status
            if 'status' in data:
                if data['status'] not in ORDER_STATUSES:
                    return error_response(f"Invalid status. Must be one of: {', '.join(ORDER_STATUSES)}")
                update['status'] = data['status']
        else:
            # Customer can only cancel pending orders
            if data.get('status') == 'Cancelled':
                if order.get('status') != 'Pending':
                    return error_response("You can only cancel pending orders.")
                update['status'] = 'Cancelled'
                # Restore stock
                for item in order.get('items', []):
                    med_id = item.get('medicineId')
                    qty = item.get('quantity', 1)
                    db.medicines_col().update_one({'_id': med_id}, {'$inc': {'stock': qty}})

        if update:
            db.orders_col().update_one({'_id': oid}, {'$set': update})

        updated = db.orders_col().find_one({'_id': oid})
        return success_response(mongo_to_dict(updated), "Order updated.")

    if request.method == 'DELETE':
        if user.get('role') != 'admin':
            return error_response("Admin access required.", 403)
        db.orders_col().delete_one({'_id': oid})
        return success_response(message="Order deleted.")

    return error_response("Method not allowed.", 405)
