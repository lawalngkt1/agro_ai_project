import os
import sys
from datetime import datetime
from pymongo import MongoClient
from dotenv import load_dotenv

# Add the backend directory to the sys.path so we can import config
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

load_dotenv()

def seed_database():
    mongo_uri = os.getenv('MONGO_URI', 'mongodb://127.0.0.1:27017/agroai')
    db_name = mongo_uri.split('/')[-1] if '/' in mongo_uri else 'agroai'
    
    print(f"Connecting to MongoDB at {mongo_uri}...")
    client = MongoClient(mongo_uri)
    db = client[db_name]
    
    # 1. Seed Crop Predictions
    print("Seeding crop_predictions...")
    crop_seeds = [
        {
            'type': 'crop_prediction',
            'input': {
                'nitrogen': 90, 'phosphorus': 42, 'potassium': 43,
                'temperature': 20.8, 'humidity': 82.0, 'ph': 6.5, 'rainfall': 202.9
            },
            'output': {
                'predicted_crop': 'rice',
                'confidence': 0.95
            },
            'timestamp': datetime.utcnow()
        },
        {
            'type': 'crop_prediction',
            'input': {
                'nitrogen': 60, 'phosphorus': 55, 'potassium': 44,
                'temperature': 23.0, 'humidity': 60.3, 'ph': 7.0, 'rainfall': 150.2
            },
            'output': {
                'predicted_crop': 'maize',
                'confidence': 0.88
            },
            'timestamp': datetime.utcnow()
        }
    ]
    db.predictions.insert_many(crop_seeds)
    
    # 2. Seed Soil Predictions
    print("Seeding soil_predictions...")
    soil_seeds = [
        {
            'type': 'soil_prediction',
            'input': {
                'nitrogen': 40, 'phosphorus': 50, 'potassium': 30,
                'ph': 6.2, 'organic_matter': 2.5
            },
            'output': {
                'soil_type': 'Loamy',
                'confidence': 0.92,
                'recommendations': ['Maintain balance', 'Good for most crops', 'Regular monitoring']
            },
            'timestamp': datetime.utcnow()
        },
        {
            'type': 'soil_prediction',
            'input': {
                'nitrogen': 20, 'phosphorus': 10, 'potassium': 15,
                'ph': 7.5, 'organic_matter': 0.5
            },
            'output': {
                'soil_type': 'Sandy',
                'confidence': 0.85,
                'recommendations': ['Add organic matter', 'Increase water retention', 'Apply compost']
            },
            'timestamp': datetime.utcnow()
        }
    ]
    db.predictions.insert_many(soil_seeds)
    
    # 3. Seed Plant Predictions
    print("Seeding plant_predictions...")
    plant_seeds = [
        {
            'type': 'plant_prediction',
            'image_hash': 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
            'output': {
                'detected_disease': 'Healthy',
                'confidence': 0.99,
                'treatment': 'Plant is healthy. Continue regular maintenance.'
            },
            'timestamp': datetime.utcnow()
        },
        {
            'type': 'plant_prediction',
            'image_hash': 'fba0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
            'output': {
                'detected_disease': 'Early Blight',
                'confidence': 0.82,
                'treatment': 'Remove affected leaves, apply fungicide, improve ventilation'
            },
            'timestamp': datetime.utcnow()
        }
    ]
    db.predictions.insert_many(plant_seeds)
    
    print("Successfully seeded the database! 🌱")
    client.close()

if __name__ == "__main__":
    seed_database()
