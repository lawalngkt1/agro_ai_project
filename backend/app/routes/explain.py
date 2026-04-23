from fastapi import APIRouter

router = APIRouter()

@router.post("/explain")
async def explain(model_type: str):

    return {
        "success": True,
        "data": {
            "model": model_type,
            "feature_importance": {
                "N": 0.35,
                "P": 0.25,
                "K": 0.20,
                "ph": 0.20
            },
            "note": "SHAP integration can replace this static output"
        }
    }