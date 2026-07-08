from bson.objectid import ObjectId
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import pymongo.errors
from db import tasks_collection, IS_MOCK_MODE

HELP_MSG = " Please check your database connection or configure a valid MongoDB Atlas connection string in TodoApp/Backend/.env."

def get_database_mode_header():
    return 'Mock-JSON' if IS_MOCK_MODE else 'MongoDB-Atlas'

@api_view(['GET'])
def get_all_tasks(request):
    """
    GET /tasks/
    Display all available tasks.
    """
    try:
        tasks = list(tasks_collection.find())
        for task in tasks:
            task['id'] = str(task['_id'])
            del task['_id']
        response = Response(tasks, status=status.HTTP_200_OK)
        response['X-Database-Mode'] = get_database_mode_header()
        return response
    except pymongo.errors.PyMongoError as e:
        return Response(
            {'error': f"Database connection failed: {str(e)}.{HELP_MSG}"}, 
            status=status.HTTP_503_SERVICE_UNAVAILABLE
        )
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def add_task(request):
    """
    POST /tasks/add/
    Add a new task to the To-Do list.
    """
    try:
        data = request.data
        title = data.get('title')
        description = data.get('description')
        priority = data.get('priority')
        status_val = data.get('status', 'Pending')

        if not title or not description or not priority:
            return Response(
                {'error': 'Title, description, and priority are required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if priority not in ['High', 'Medium', 'Low']:
            return Response(
                {'error': "Priority must be 'High', 'Medium', or 'Low'."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if status_val not in ['Pending', 'Completed']:
            return Response(
                {'error': "Status must be 'Pending' or 'Completed'."},
                status=status.HTTP_400_BAD_REQUEST
            )

        new_task = {
            'title': title,
            'description': description,
            'priority': priority,
            'status': status_val
        }

        result = tasks_collection.insert_one(new_task)
        new_task['id'] = str(result.inserted_id)
        
        response = Response(new_task, status=status.HTTP_201_CREATED)
        response['X-Database-Mode'] = get_database_mode_header()
        return response
    except pymongo.errors.PyMongoError as e:
        return Response(
            {'error': f"Database write failed: {str(e)}.{HELP_MSG}"}, 
            status=status.HTTP_503_SERVICE_UNAVAILABLE
        )
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PUT'])
def update_task(request, id):
    """
    PUT /tasks/update/<id>/
    Update the task title, description, priority, or status.
    """
    try:
        try:
            obj_id = ObjectId(id)
        except Exception:
            return Response({'error': 'Invalid task ID format.'}, status=status.HTTP_400_BAD_REQUEST)

        data = request.data
        update_fields = {}

        if 'title' in data:
            update_fields['title'] = data['title']
        if 'description' in data:
            update_fields['description'] = data['description']
        if 'priority' in data:
            if data['priority'] not in ['High', 'Medium', 'Low']:
                return Response(
                    {'error': "Priority must be 'High', 'Medium', or 'Low'."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            update_fields['priority'] = data['priority']
        if 'status' in data:
            if data['status'] not in ['Pending', 'Completed']:
                return Response(
                    {'error': "Status must be 'Pending' or 'Completed'."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            update_fields['status'] = data['status']

        if not update_fields:
            return Response({'error': 'No valid fields provided to update.'}, status=status.HTTP_400_BAD_REQUEST)

        result = tasks_collection.update_one({'_id': obj_id}, {'$set': update_fields})
        if result.matched_count == 0:
            return Response({'error': 'Task not found.'}, status=status.HTTP_404_NOT_FOUND)

        updated_task = tasks_collection.find_one({'_id': obj_id})
        updated_task['id'] = str(updated_task['_id'])
        del updated_task['_id']

        response = Response(updated_task, status=status.HTTP_200_OK)
        response['X-Database-Mode'] = get_database_mode_header()
        return response
    except pymongo.errors.PyMongoError as e:
        return Response(
            {'error': f"Database update failed: {str(e)}.{HELP_MSG}"}, 
            status=status.HTTP_503_SERVICE_UNAVAILABLE
        )
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['DELETE'])
def delete_task(request, id):
    """
    DELETE /tasks/delete/<id>/
    Delete a task using its unique ID.
    """
    try:
        try:
            obj_id = ObjectId(id)
        except Exception:
            return Response({'error': 'Invalid task ID format.'}, status=status.HTTP_400_BAD_REQUEST)

        result = tasks_collection.delete_one({'_id': obj_id})
        if result.deleted_count == 0:
            return Response({'error': 'Task not found.'}, status=status.HTTP_404_NOT_FOUND)

        response = Response({'message': 'Task deleted successfully.'}, status=status.HTTP_200_OK)
        response['X-Database-Mode'] = get_database_mode_header()
        return response
    except pymongo.errors.PyMongoError as e:
        return Response(
            {'error': f"Database deletion failed: {str(e)}.{HELP_MSG}"}, 
            status=status.HTTP_503_SERVICE_UNAVAILABLE
        )
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
