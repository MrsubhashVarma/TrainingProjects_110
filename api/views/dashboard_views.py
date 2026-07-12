"""Dashboard API views for Pharmacy Management System."""

from django.views.decorators.csrf import csrf_exempt
from .. import db
from ..utils import (
    success_response, error_response, get_request_user, mongo_to_dict
)


def _require_admin(request):
    user = get_request_user(request)
    if not user:
        return None, error_response("Authentication required.", 401)
    if user.get('role') != 'admin':
        return None, error_response("Admin access required.", 403)
    return user, None


@csrf_exempt
def dashboard(request):
    """GET /api/dashboard — Summary stats for admin."""
    _, err = _require_admin(request)
    if err:
        return err

    total_medicines = db.medicines_col().count_documents({})
    total_categories = db.categories_col().count_documents({})
    total_orders = db.orders_col().count_documents({})
    total_users = db.users_col().count_documents({'role': 'customer'})
    low_stock_count = db.medicines_col().count_documents({'stock': {'$lt': 10}})

    # Revenue: sum of all delivered order amounts
    pipeline = [
        {'$match': {'status': 'Delivered'}},
        {'$group': {'_id': None, 'total': {'$sum': '$totalAmount'}}}
    ]
    rev_result = list(db.orders_col().aggregate(pipeline))
    revenue = rev_result[0]['total'] if rev_result else 0

    # Orders by status
    status_pipeline = [
        {'$group': {'_id': '$status', 'count': {'$sum': 1}}}
    ]
    order_by_status = {s['_id']: s['count'] for s in db.orders_col().aggregate(status_pipeline)}

    return success_response({
        'totalMedicines': total_medicines,
        'totalCategories': total_categories,
        'totalOrders': total_orders,
        'totalUsers': total_users,
        'lowStockCount': low_stock_count,
        'revenue': revenue,
        'ordersByStatus': order_by_status,
    })


@csrf_exempt
def dashboard_revenue(request):
    """GET /api/dashboard/revenue — Monthly revenue breakdown."""
    _, err = _require_admin(request)
    if err:
        return err

    pipeline = [
        {'$match': {'status': 'Delivered'}},
        {'$group': {
            '_id': {
                'year': {'$year': '$createdAt'},
                'month': {'$month': '$createdAt'}
            },
            'revenue': {'$sum': '$totalAmount'},
            'orders': {'$sum': 1}
        }},
        {'$sort': {'_id.year': -1, '_id.month': -1}},
        {'$limit': 12}
    ]
    result = list(db.orders_col().aggregate(pipeline))
    return success_response([mongo_to_dict(r) for r in result])


@csrf_exempt
def dashboard_low_stock(request):
    """GET /api/dashboard/low-stock — Medicines with low stock."""
    _, err = _require_admin(request)
    if err:
        return err

    medicines = list(db.medicines_col().find({'stock': {'$lt': 10}}).sort('stock', 1))
    return success_response([mongo_to_dict(m) for m in medicines])


@csrf_exempt
def dashboard_recent_orders(request):
    """GET /api/dashboard/recent-orders — Last 10 orders."""
    _, err = _require_admin(request)
    if err:
        return err

    orders = list(db.orders_col().find().sort('createdAt', -1).limit(10))
    enriched = []
    for o in orders:
        od = mongo_to_dict(o)
        u = db.users_col().find_one({'_id': o.get('userId')})
        od['userName'] = u.get('name', '') if u else 'Unknown'
        enriched.append(od)
    return success_response(enriched)


@csrf_exempt
def user_management(request):
    """GET /api/users — Admin: list all users."""
    _, err = _require_admin(request)
    if err:
        return err

    users = list(db.users_col().find({'role': 'customer'}))
    result = []
    for u in users:
        ud = mongo_to_dict(u)
        ud.pop('password', None)
        result.append(ud)
    return success_response(result)


@csrf_exempt
def user_action(request, user_id):
    """PUT/DELETE /api/users/{id} — Admin: block/activate/delete user."""
    _, err = _require_admin(request)
    if err:
        return err

    from bson import ObjectId
    try:
        oid = ObjectId(user_id)
    except Exception:
        return error_response("Invalid user ID.")

    user = db.users_col().find_one({'_id': oid})
    if not user:
        return error_response("User not found.", 404)

    if request.method == 'GET':
        ud = mongo_to_dict(user)
        ud.pop('password', None)
        return success_response(ud)

    if request.method == 'PUT':
        from ..utils import parse_body
        data = parse_body(request)
        update = {}
        if 'isBlocked' in data:
            update['isBlocked'] = bool(data['isBlocked'])
        if update:
            db.users_col().update_one({'_id': oid}, {'$set': update})
        updated = db.users_col().find_one({'_id': oid})
        ud = mongo_to_dict(updated)
        ud.pop('password', None)
        msg = "User blocked." if update.get('isBlocked') else "User activated."
        return success_response(ud, msg)

    if request.method == 'DELETE':
        db.users_col().delete_one({'_id': oid})
        return success_response(message="User deleted.")

    return error_response("Method not allowed.", 405)
