"""
Pydantic schemas for validating incoming requests and structuring responses.
Implements DRY principles with base schemas and field reusability.
"""

from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field, validator


# ============================================================================
# BASE SCHEMAS (DRY Principle - Reusable Components)
# ============================================================================

class PaginationMixin(BaseModel):
    """Mixin for pagination metadata."""
    page: int = Field(default=1, ge=1, description="Page number")
    per_page: int = Field(default=10, ge=1, le=100, description="Items per page")
    total: int = Field(default=0, ge=0, description="Total number of items")


class TimestampMixin(BaseModel):
    """Mixin for timestamp tracking."""
    created_at: datetime = Field(default_factory=datetime.utcnow, description="Creation timestamp")
    updated_at: Optional[datetime] = Field(default=None, description="Last update timestamp")


# ============================================================================
# CROP RECOMMENDATION SCHEMAS
# ============================================================================

class CropPredictionRequest(BaseModel):
    """
    Request schema for crop recommendation.
    Validates 7 agricultural parameters.
    """
    nitrogen: float = Field(..., ge=0, le=150, description="Nitrogen content (0-150 kg/ha)")
    phosphorus: float = Field(..., ge=0, le=150, description="Phosphorus content (0-150 kg/ha)")
    potassium: float = Field(..., ge=0, le=150, description="Potassium content (0-150 kg/ha)")
    temperature: float = Field(..., ge=-20, le=60, description="Temperature in Celsius (-20 to 60°C)")
    humidity: float = Field(..., ge=0, le=100, description="Humidity percentage (0-100%)")
    ph: float = Field(..., ge=3.0, le=9.0, description="Soil pH level (3.0-9.0)")
    rainfall: float = Field(..., ge=0, le=500, description="Annual rainfall (0-500 mm)")

    class Config:
        schema_extra = {
            "example": {
                "nitrogen": 90,
                "phosphorus": 42,
                "potassium": 43,
                "temperature": 25,
                "humidity": 70,
                "ph": 6.5,
                "rainfall": 200
            }
        }

    @validator("*", pre=True)
    def empty_str_to_none(cls, v):
        """Convert empty strings to None for optional fields."""
        if isinstance(v, str) and v == "":
            return None
        return v


class CropPredictionResponse(BaseModel):
    """Response schema for crop recommendation."""
    id: Optional[str] = Field(None, description="MongoDB document ID")
    recommended_crop: str = Field(..., description="Recommended crop name")
    confidence_score: float = Field(..., ge=0, le=1, description="Prediction confidence (0-1)")
    explanation: Dict[str, Any] = Field(default_factory=dict, description="Feature importance explanation")
    input_parameters: Dict[str, float] = Field(..., description="Echo back input parameters")
    created_at: datetime = Field(default_factory=datetime.utcnow, description="Prediction timestamp")
    
    class Config:
        schema_extra = {
            "example": {
                "recommended_crop": "wheat",
                "confidence_score": 0.92,
                "explanation": {
                    "temperature": 0.35,
                    "rainfall": 0.28,
                    "nitrogen": 0.21
                },
                "input_parameters": {
                    "nitrogen": 90,
                    "phosphorus": 42,
                    "potassium": 43,
                    "temperature": 25,
                    "humidity": 70,
                    "ph": 6.5,
                    "rainfall": 200
                },
                "created_at": "2024-01-15T10:30:00"
            }
        }


# ============================================================================
# SOIL ANALYSIS SCHEMAS
# ============================================================================

class SoilPredictionRequest(BaseModel):
    """
    Request schema for soil analysis.
    Validates soil composition parameters.
    """
    nitrogen: float = Field(..., ge=0, le=200, description="Nitrogen content (0-200 ppm)")
    phosphorus: float = Field(..., ge=0, le=200, description="Phosphorus content (0-200 ppm)")
    potassium: float = Field(..., ge=0, le=200, description="Potassium content (0-200 ppm)")
    ph: float = Field(..., ge=3.0, le=9.0, description="Soil pH level (3.0-9.0)")
    organic_matter: float = Field(..., ge=0, le=10, description="Organic matter percentage (0-10%)")
    
    class Config:
        schema_extra = {
            "example": {
                "nitrogen": 50,
                "phosphorus": 30,
                "potassium": 40,
                "ph": 7.0,
                "organic_matter": 2.5
            }
        }


class SoilPredictionResponse(BaseModel):
    """Response schema for soil analysis."""
    id: Optional[str] = Field(None, description="MongoDB document ID")
    soil_type: str = Field(..., description="Classified soil type")
    fertility_level: str = Field(..., description="Fertility classification (low/medium/high)")
    confidence_score: float = Field(..., ge=0, le=1, description="Prediction confidence (0-1)")
    recommendations: List[str] = Field(default_factory=list, description="Soil improvement recommendations")
    input_parameters: Dict[str, float] = Field(..., description="Echo back input parameters")
    created_at: datetime = Field(default_factory=datetime.utcnow, description="Analysis timestamp")
    
    class Config:
        schema_extra = {
            "example": {
                "soil_type": "loamy",
                "fertility_level": "high",
                "confidence_score": 0.88,
                "recommendations": [
                    "Maintain organic matter through crop rotation",
                    "Monitor phosphorus levels for next season"
                ],
                "input_parameters": {
                    "nitrogen": 50,
                    "phosphorus": 30,
                    "potassium": 40,
                    "ph": 7.0,
                    "organic_matter": 2.5
                },
                "created_at": "2024-01-15T10:30:00"
            }
        }


# ============================================================================
# PLANT DISEASE DETECTION SCHEMAS
# ============================================================================

class PlantDiseaseDetection(BaseModel):
    """Individual disease detection result."""
    disease_name: str = Field(..., description="Name of detected disease")
    confidence: float = Field(..., ge=0, le=1, description="Confidence score (0-1)")
    treatment: str = Field(..., description="Recommended treatment")


class PlantPredictionResponse(BaseModel):
    """Response schema for plant disease detection."""
    id: Optional[str] = Field(None, description="MongoDB document ID")
    is_healthy: bool = Field(..., description="Whether plant is healthy")
    detected_diseases: List[PlantDiseaseDetection] = Field(
        default_factory=list, 
        description="List of detected diseases with confidence scores"
    )
    primary_diagnosis: Optional[str] = Field(None, description="Most likely diagnosis")
    confidence_score: float = Field(..., ge=0, le=1, description="Overall prediction confidence")
    image_filename: str = Field(..., description="Uploaded image filename")
    created_at: datetime = Field(default_factory=datetime.utcnow, description="Detection timestamp")
    
    class Config:
        schema_extra = {
            "example": {
                "is_healthy": False,
                "detected_diseases": [
                    {
                        "disease_name": "Early Blight",
                        "confidence": 0.92,
                        "treatment": "Apply fungicide, remove affected leaves"
                    }
                ],
                "primary_diagnosis": "Early Blight",
                "confidence_score": 0.92,
                "image_filename": "leaf_20240115_001.jpg",
                "created_at": "2024-01-15T10:30:00"
            }
        }


# ============================================================================
# HISTORY & PAGINATION SCHEMAS
# ============================================================================

class PredictionHistoryResponse(BaseModel):
    """Response schema for prediction history."""
    page: int = Field(..., ge=1, description="Current page number")
    per_page: int = Field(..., ge=1, description="Items per page")
    total: int = Field(..., ge=0, description="Total number of records")
    total_pages: int = Field(..., ge=0, description="Total number of pages")
    data: List[Dict[str, Any]] = Field(..., description="Paginated prediction records")
    
    class Config:
        schema_extra = {
            "example": {
                "page": 1,
                "per_page": 10,
                "total": 25,
                "total_pages": 3,
                "data": []
            }
        }


# ============================================================================
# ERROR RESPONSE SCHEMA
# ============================================================================

class ErrorResponse(BaseModel):
    """Standardized error response."""
    error: str = Field(..., description="Error message")
    error_code: str = Field(..., description="Error code for debugging")
    status_code: int = Field(..., description="HTTP status code")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="Error timestamp")
    details: Optional[Dict[str, Any]] = Field(None, description="Additional error details")
    
    class Config:
        schema_extra = {
            "example": {
                "error": "Invalid input parameters",
                "error_code": "VALIDATION_ERROR",
                "status_code": 422,
                "timestamp": "2024-01-15T10:30:00",
                "details": {
                    "nitrogen": "Value must be between 0 and 150"
                }
            }
        }


# ============================================================================
# HEALTH CHECK SCHEMA
# ============================================================================

class HealthCheckResponse(BaseModel):
    """Response schema for health check endpoint."""
    status: str = Field(..., description="Service status")
    version: str = Field(..., description="API version")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="Check timestamp")
    database: str = Field(..., description="Database connection status")
    models_loaded: bool = Field(..., description="Whether ML models are loaded")
    
    class Config:
        schema_extra = {
            "example": {
                "status": "healthy",
                "version": "1.0.0",
                "timestamp": "2024-01-15T10:30:00",
                "database": "connected",
                "models_loaded": True
            }
        }


# ============================================================================
# API INFO SCHEMA
# ============================================================================

class APIInfoResponse(BaseModel):
    """Response schema for API information."""
    name: str = Field(..., description="API name")
    version: str = Field(..., description="API version")
    description: str = Field(..., description="API description")
    endpoints: List[Dict[str, str]] = Field(..., description="Available endpoints")
    status: str = Field(..., description="API status")
    
    class Config:
        schema_extra = {
            "example": {
                "name": "AgroAI Advisor Backend API",
                "version": "1.0.0",
                "description": "AI-powered agricultural decision support system",
                "endpoints": [
                    {"method": "GET", "path": "/api/health", "description": "Health check"},
                    {"method": "POST", "path": "/api/crop/predict", "description": "Crop recommendation"}
                ],
                "status": "operational"
            }
        }
