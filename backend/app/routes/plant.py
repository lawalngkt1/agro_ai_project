from fastapi import APIRouter, UploadFile, File
from PIL import Image
import numpy as np
from app.models.loader import plant_model
from app.db.collections import plant_collection

router = APIRouter()

@router.post("/predict_plant")
async def predict_plant(file: UploadFile = File(...)):

    image = Image.open(file.file).resize((224,224))
    img = np.array(image)/255.0
    img = np.expand_dims(img, axis=0)

    pred = plant_model.predict(img)
    class_id = int(np.argmax(pred))

    response = {
        "success": True,
        "data": {
            "disease_class": class_id,
            "confidence": float(np.max(pred)),
            "explanation": "CNN-based image classification result"
        }
    }

    await plant_collection.insert_one(response)

    return response