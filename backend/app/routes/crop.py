from fastapi import APIRouter
from app.schemas.crop import CropInput
from app.services.predictor import predict_crop
from app.db.database import crop_collection

router = APIRouter()

@router.post("/predict_crop")
async def crop(data: CropInput):

    result = predict_crop(data)

    response = {
        "success": True,
        "data": {
            "recommended_crop": str(result),
            "input": data.dict()
        }
    }

    await crop_collection.insert_one(response)
    return response