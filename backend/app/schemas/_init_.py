"""
Pydantic schemas for request/response validation.
"""

from .predictions import (
    CropPredictionRequest,
    CropPredictionResponse,
    SoilPredictionRequest,
    SoilPredictionResponse,
    PlantPredictionResponse,
    PredictionHistoryResponse,
    ErrorResponse,
)

__all__ = [
    "CropPredictionRequest",
    "CropPredictionResponse",
    "SoilPredictionRequest",
    "SoilPredictionResponse",
    "PlantPredictionResponse",
    "PredictionHistoryResponse",
    "ErrorResponse",
]
