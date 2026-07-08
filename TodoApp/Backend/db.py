import os
import pymongo
import json
import uuid

# Lightweight manual .env file loader
env_path = os.path.join(os.path.dirname(__file__), '.env')
if os.path.exists(env_path):
    with open(env_path, 'r') as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                key, val = line.split('=', 1)
                os.environ[key.strip()] = val.strip().strip('"').strip("'")

# Read connection URI from environment
MONGO_URI = os.getenv("MONGO_URI", "")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "todo_db")

# Detect placeholder values
if not MONGO_URI or "your-cluster-url" in MONGO_URI or "<username>" in MONGO_URI:
    MONGO_URI = "mongodb://localhost:27017/"

# In-memory JSON Database Mock for offline capability
class MockInsertOneResult:
    def __init__(self, inserted_id):
        self.inserted_id = inserted_id

class MockUpdateResult:
    def __init__(self, matched_count):
        self.matched_count = matched_count

class MockDeleteResult:
    def __init__(self, deleted_count):
        self.deleted_count = deleted_count

class MockTasksCollection:
    def __init__(self, filepath):
        self.filepath = filepath
        self._ensure_seed_data()

    def _ensure_seed_data(self):
        if not os.path.exists(self.filepath):
            seed_data = [
                {
                    "_id": "60c72b2f9b1d8e2b8c9d4b1a",
                    "title": "Complete Django Assignment",
                    "description": "Finish CRUD APIs using Django REST Framework",
                    "priority": "High",
                    "status": "Pending"
                },
                {
                    "_id": "60c72b2f9b1d8e2b8c9d4b1b",
                    "title": "Prepare Interview",
                    "description": "Practice JavaScript interview questions",
                    "priority": "Medium",
                    "status": "Pending"
                },
                {
                    "_id": "60c72b2f9b1d8e2b8c9d4b1c",
                    "title": "Buy Groceries",
                    "description": "Purchase vegetables, fruits, and milk",
                    "priority": "Low",
                    "status": "Completed"
                },
                {
                    "_id": "60c72b2f9b1d8e2b8c9d4b1d",
                    "title": "Workout",
                    "description": "Go to the gym for one hour",
                    "priority": "High",
                    "status": "Pending"
                },
                {
                    "_id": "60c72b2f9b1d8e2b8c9d4b1e",
                    "title": "Read Python Notes",
                    "description": "Study Django Models and Serializers",
                    "priority": "Medium",
                    "status": "Completed"
                }
            ]
            self._write_data(seed_data)

    def _read_data(self):
        try:
            with open(self.filepath, 'r') as f:
                return json.load(f)
        except Exception:
            return []

    def _write_data(self, data):
        try:
            with open(self.filepath, 'w') as f:
                json.dump(data, f, indent=4)
        except Exception as e:
            print(f"Failed to write mock data: {e}")

    def find(self):
        return self._read_data()

    def insert_one(self, document):
        data = self._read_data()
        doc_id = str(uuid.uuid4().hex)[:24]
        document['_id'] = doc_id
        data.append(document)
        self._write_data(data)
        return MockInsertOneResult(doc_id)

    def find_one(self, filter_dict):
        target_id = str(filter_dict.get('_id'))
        data = self._read_data()
        for doc in data:
            if str(doc.get('_id')) == target_id:
                return doc
        return None

    def update_one(self, filter_dict, update_dict):
        target_id = str(filter_dict.get('_id'))
        data = self._read_data()
        matched_count = 0
        set_fields = update_dict.get('$set', {})
        for doc in data:
            if str(doc.get('_id')) == target_id:
                doc.update(set_fields)
                matched_count = 1
                break
        if matched_count:
            self._write_data(data)
        return MockUpdateResult(matched_count)

    def delete_one(self, filter_dict):
        target_id = str(filter_dict.get('_id'))
        data = self._read_data()
        initial_len = len(data)
        data = [doc for doc in data if str(doc.get('_id')) != target_id]
        deleted_count = initial_len - len(data)
        if deleted_count:
            self._write_data(data)
        return MockDeleteResult(deleted_count)

IS_MOCK_MODE = False
tasks_collection = None

# Attempt to connect to MongoDB with a short timeout
try:
    client = pymongo.MongoClient(
        MONGO_URI,
        serverSelectionTimeoutMS=500,
        connectTimeoutMS=500
    )
    # Trigger a connection check command (ping)
    client.admin.command('ping')
    db = client[MONGO_DB_NAME]
    tasks_collection = db["tasks"]
    IS_MOCK_MODE = False
    print("Database Status: Successfully connected to MongoDB.")
except Exception as e:
    IS_MOCK_MODE = True
    print(f"Database Status: MongoDB offline or unreachable ({e}).")
    print("Database Status: Falling back to local JSON database mode.")
    mock_db_path = os.path.join(os.path.dirname(__file__), 'tasks_db.json')
    tasks_collection = MockTasksCollection(mock_db_path)
