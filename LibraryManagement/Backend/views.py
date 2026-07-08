import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from Backend.db import books_collection, IS_MOCK_MODE

@csrf_exempt
def get_all_books(request):
    """
    GET /books/
    Retrieve all books.
    """
    if request.method != 'GET':
        return JsonResponse({'error': 'Method not allowed. Use GET.'}, status=405)
    try:
        books = list(books_collection.find())
        for book in books:
            book['id'] = str(book['_id'])
            del book['_id']
        response = JsonResponse(books, safe=False)
        response['X-Database-Mode'] = 'Mock-JSON' if IS_MOCK_MODE else 'MongoDB-Atlas'
        return response
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
def add_book(request):
    """
    POST /books/add/
    Add a new book.
    """
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed. Use POST.'}, status=405)
    try:
        data = json.loads(request.body)
        
        book_id = data.get('book_id')
        title = data.get('title')
        author = data.get('author')
        category = data.get('category')
        price = data.get('price')
        quantity = data.get('quantity')
        publisher = data.get('publisher')
        
        # Form field presence validation
        if book_id is None or not title or not author or not category or price is None or quantity is None or not publisher:
            return JsonResponse({'error': 'All fields are required.'}, status=400)
            
        # Type conversions and numeric validation
        try:
            book_id = int(book_id)
            price = float(price)
            quantity = int(quantity)
        except ValueError:
            return JsonResponse({'error': 'Book ID and Quantity must be integers. Price must be a number.'}, status=400)
            
        if book_id <= 0:
            return JsonResponse({'error': 'Book ID must be a positive integer.'}, status=400)
        if price < 0:
            return JsonResponse({'error': 'Price cannot be negative.'}, status=400)
        if quantity < 0:
            return JsonResponse({'error': 'Quantity cannot be negative.'}, status=400)
            
        # Check uniqueness of book_id
        existing = books_collection.find_one({'book_id': book_id})
        if existing:
            return JsonResponse({'error': f'Book with ID {book_id} already exists.'}, status=400)
            
        new_book = {
            'book_id': book_id,
            'title': title,
            'author': author,
            'category': category,
            'price': price,
            'quantity': quantity,
            'publisher': publisher
        }
        
        result = books_collection.insert_one(new_book)
        new_book['id'] = str(result.inserted_id)
        if '_id' in new_book:
            del new_book['_id']
            
        response = JsonResponse(new_book, status=201)
        response['X-Database-Mode'] = 'Mock-JSON' if IS_MOCK_MODE else 'MongoDB-Atlas'
        return response
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON in request body.'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
def update_book(request, book_id):
    """
    PUT /books/update/<book_id>/
    Update an existing book's details by book_id.
    """
    if request.method != 'PUT':
        return JsonResponse({'error': 'Method not allowed. Use PUT.'}, status=405)
    try:
        try:
            book_id = int(book_id)
        except ValueError:
            return JsonResponse({'error': 'Invalid Book ID format.'}, status=400)
            
        # Verify book exists
        existing = books_collection.find_one({'book_id': book_id})
        if not existing:
            return JsonResponse({'error': f'Book with ID {book_id} not found.'}, status=404)
            
        data = json.loads(request.body)
        update_fields = {}
        
        if 'title' in data:
            update_fields['title'] = data['title']
        if 'author' in data:
            update_fields['author'] = data['author']
        if 'category' in data:
            update_fields['category'] = data['category']
        if 'price' in data:
            try:
                price_val = float(data['price'])
                if price_val < 0:
                    return JsonResponse({'error': 'Price cannot be negative.'}, status=400)
                update_fields['price'] = price_val
            except ValueError:
                return JsonResponse({'error': 'Price must be a number.'}, status=400)
        if 'quantity' in data:
            try:
                qty_val = int(data['quantity'])
                if qty_val < 0:
                    return JsonResponse({'error': 'Quantity cannot be negative.'}, status=400)
                update_fields['quantity'] = qty_val
            except ValueError:
                return JsonResponse({'error': 'Quantity must be an integer.'}, status=400)
        if 'publisher' in data:
            update_fields['publisher'] = data['publisher']
            
        if not update_fields:
            return JsonResponse({'error': 'No fields provided to update.'}, status=400)
            
        books_collection.update_one({'book_id': book_id}, {'$set': update_fields})
        
        # Retrieve the updated record
        updated_book = books_collection.find_one({'book_id': book_id})
        updated_book['id'] = str(updated_book['_id'])
        del updated_book['_id']
        
        response = JsonResponse(updated_book)
        response['X-Database-Mode'] = 'Mock-JSON' if IS_MOCK_MODE else 'MongoDB-Atlas'
        return response
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON in request body.'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
def delete_book(request, book_id):
    """
    DELETE /books/delete/<book_id>/
    Delete a book by book_id.
    """
    if request.method != 'DELETE':
        return JsonResponse({'error': 'Method not allowed. Use DELETE.'}, status=405)
    try:
        try:
            book_id = int(book_id)
        except ValueError:
            return JsonResponse({'error': 'Invalid Book ID format.'}, status=400)
            
        # Verify book exists
        existing = books_collection.find_one({'book_id': book_id})
        if not existing:
            return JsonResponse({'error': f'Book with ID {book_id} not found.'}, status=404)
            
        books_collection.delete_one({'book_id': book_id})
        
        response = JsonResponse({'message': f'Book with ID {book_id} has been deleted successfully.'})
        response['X-Database-Mode'] = 'Mock-JSON' if IS_MOCK_MODE else 'MongoDB-Atlas'
        return response
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
