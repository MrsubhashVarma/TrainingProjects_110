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
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "event_db")

# Detect placeholder values
if not MONGO_URI or "your-cluster-url" in MONGO_URI or "<username>" in MONGO_URI:
    MONGO_URI = "mongodb://localhost:27017/"

# Default Seed Data
SEED_PARTICIPANTS = [
    {
        "participant_id": 1001,
        "full_name": "Rahul Sharma",
        "email": "rahul@gmail.com",
        "phone": "9876543210",
        "college": "ABC Engineering College",
        "event_name": "Hackathon 2026",
        "registration_fee": 500
    },
    {
        "participant_id": 1002,
        "full_name": "Sneha Patel",
        "email": "sneha@gmail.com",
        "phone": "9988776655",
        "college": "XYZ University",
        "event_name": "AI Workshop",
        "registration_fee": 300
    },
    {
        "participant_id": 1003,
        "full_name": "Kiran Kumar",
        "email": "kiran@gmail.com",
        "phone": "9123456789",
        "college": "National Institute of Technology",
        "event_name": "Web Development Bootcamp",
        "registration_fee": 400
    },
    {
        "participant_id": 1004,
        "full_name": "Anjali Verma",
        "email": "anjali@gmail.com",
        "phone": "9012345678",
        "college": "Government Engineering College",
        "event_name": "Cloud Computing Seminar",
        "registration_fee": 350
    },
    {
        "participant_id": 1005,
        "full_name": "Vikram Singh",
        "email": "vikram@gmail.com",
        "phone": "9090909090",
        "college": "Tech University",
        "event_name": "Python Programming Workshop",
        "registration_fee": 450
    }
]

# In-memory & JSON Database Mock for offline capability
class MockInsertOneResult:
    def __init__(self, inserted_id):
        self.inserted_id = inserted_id

class MockUpdateResult:
    def __init__(self, matched_count):
        self.matched_count = matched_count

class MockDeleteResult:
    def __init__(self, deleted_count):
        self.deleted_count = deleted_count

class MockParticipantsCollection:
    def __init__(self, filepath):
        self.filepath = filepath
        self._ensure_seed_data()

    def _ensure_seed_data(self):
        if not os.path.exists(self.filepath):
            # Ensure every participant has a unique hex _id
            for p in SEED_PARTICIPANTS:
                if '_id' not in p:
                    p['_id'] = str(uuid.uuid4().hex)[:24]
            self._write_data(SEED_PARTICIPANTS)

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

    def find(self, filter_dict=None):
        data = self._read_data()
        if not filter_dict:
            return data
        
        filtered = []
        for doc in data:
            match = True
            for k, v in filter_dict.items():
                if doc.get(k) != v:
                    match = False
                    break
            if match:
                filtered.append(doc)
        return filtered

    def find_one(self, filter_dict):
        data = self._read_data()
        for doc in data:
            match = True
            for k, v in filter_dict.items():
                if doc.get(k) != v:
                    match = False
                    break
            if match:
                return doc
        return None

    def insert_one(self, document):
        data = self._read_data()
        if '_id' not in document:
            document['_id'] = str(uuid.uuid4().hex)[:24]
        data.append(document)
        self._write_data(data)
        return MockInsertOneResult(document['_id'])

    def update_one(self, filter_dict, update_dict):
        data = self._read_data()
        matched_count = 0
        set_fields = update_dict.get('$set', {})
        for doc in data:
            match = True
            for k, v in filter_dict.items():
                if doc.get(k) != v:
                    match = False
                    break
            if match:
                doc.update(set_fields)
                matched_count = 1
                break
        if matched_count:
            self._write_data(data)
        return MockUpdateResult(matched_count)

    def delete_one(self, filter_dict):
        data = self._read_data()
        initial_len = len(data)
        new_data = []
        deleted_count = 0
        for doc in data:
            match = True
            for k, v in filter_dict.items():
                if doc.get(k) != v:
                    match = False
                    break
            if match and deleted_count == 0:
                deleted_count = 1
                continue
            new_data.append(doc)
        if deleted_count:
            self._write_data(new_data)
        return MockDeleteResult(deleted_count)

    def count_documents(self, filter_dict={}):
        return len(self.find(filter_dict))


IS_MOCK_MODE = False
participants_collection = None

# Attempt to connect to MongoDB with a short timeout
try:
    client = pymongo.MongoClient(
        MONGO_URI,
        serverSelectionTimeoutMS=1000,
        connectTimeoutMS=1000
    )
    # Trigger a connection check command (ping)
    client.admin.command('ping')
    db = client[MONGO_DB_NAME]
    participants_collection = db["participants"]
    
    # Check if we should seed the MongoDB collection
    if participants_collection.count_documents({}) == 0:
        import copy
        seed_data_clone = copy.deepcopy(SEED_PARTICIPANTS)
        participants_collection.insert_many(seed_data_clone)
        print("Database Status: Successfully seeded MongoDB Atlas collection 'participants'.")
        
    IS_MOCK_MODE = False
    print("Database Status: Successfully connected to MongoDB Atlas.")
except Exception as e:
    IS_MOCK_MODE = True
    print(f"Database Status: MongoDB offline or unreachable ({e}).")
    print("Database Status: Falling back to local JSON database mode.")
    mock_db_path = os.path.join(os.path.dirname(__file__), 'participants_db.json')
    participants_collection = MockParticipantsCollection(mock_db_path)
