from app.db.client import client
from app.core.config import settings

db = client[settings.DB_NAME]

crop_collection = db["crop_predictions"]
soil_collection = db["soil_predictions"]
plant_collection = db["plant_predictions"]