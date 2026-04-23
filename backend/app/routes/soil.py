from fastapi import APIRouter
from app.services.explainability import explain_result

router = APIRouter()

@router.post("/explain")
async def explain(model_type: str):
    return {
        "success": True,
        "data": explain_result(model_type)
    }