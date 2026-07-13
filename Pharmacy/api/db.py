"""MongoDB connection module for Pharmacy Management System."""

import pymongo
from django.conf import settings

_client = None
_db = None


def get_db():
    """Get MongoDB database instance (singleton)."""
    global _client, _db
    if _db is None:
        _client = pymongo.MongoClient(settings.MONGODB_URI)
        _db = _client[settings.MONGODB_DB]
    return _db


def get_collection(name):
    """Get a specific MongoDB collection."""
    return get_db()[name]


# Collection accessors
def users_col():
    return get_collection('users')

def categories_col():
    return get_collection('categories')

def medicines_col():
    return get_collection('medicines')

def cart_col():
    return get_collection('cart')

def orders_col():
    return get_collection('orders')

def tokens_col():
    return get_collection('tokens')
