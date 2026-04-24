"""
MongoDB document schemas using mongoengine.
Implements data persistence for all prediction types with audit trails.
"""

from datetime import datetime
from typing import Optional, Dict, Any, List
from mongoengine import (
    Document,
    StringField,
    FloatField,
    BooleanField,
    DateTimeField,
    DictField,
    ListField,
    EmbeddedDocument,
    EmbeddedDocumentField,
    indexes,
)


class DiseaseDetection(EmbeddedDocument):
    """Embedded document for disease detection results."""
    disease_name = StringField(required=True, max_length=100)
    confidence = FloatField(required=True, min_value=0, max_value=1)
    treatment = StringField(required=True, max_length=500)


class CropPrediction(Document):
    """Document model for crop recommendation predictions."""
    
    recommended_crop = StringField(required=True, max_length=100)
    confidence_score = FloatField(required=True, min_value=0, max_value=1)
    
    # Input parameters (echo back for audit trail)
    nitrogen = FloatField(required=True)
    phosphorus = FloatField(required=True)
    potassium = FloatField(required=True)
    temperature = FloatField(required=True)
    humidity = FloatField(required=True)
    ph = FloatField(required=True)
    rainfall = FloatField(required=True)
    
    # Explanation (SHAP values or feature importance)
    explanation = DictField()
    
    # Metadata
    created_at = DateTimeField(default=datetime.utcnow, required=True)
    updated_at = DateTimeField(default=datetime.utcnow)
    
    # Audit trail
    user_agent = StringField(max_length=255)
    ip_address = StringField(max_length=45)  # IPv6 max length
    
    meta = {
        'collection': 'crop_predictions',
        'indexes': [
            'created_at',
            ('recommended_crop', 'created_at'),
            '-created_at',  # Descending for recent first queries
        ]
    }
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert document to dictionary."""
        return {
            "id": str(self.id),
            "recommended_crop": self.recommended_crop,
            "confidence_score": self.confidence_score,
            "input_parameters": {
                "nitrogen": self.nitrogen,
                "phosphorus": self.phosphorus,
                "potassium": self.potassium,
                "temperature": self.temperature,
                "humidity": self.humidity,
                "ph": self.ph,
                "rainfall": self.rainfall,
            },
            "explanation": self.explanation or {},
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }


class SoilPrediction(Document):
    """Document model for soil analysis predictions."""
    
    soil_type = StringField(required=True, max_length=100)
    fertility_level = StringField(
        required=True,
        choices=['low', 'medium', 'high'],
        max_length=10
    )
    confidence_score = FloatField(required=True, min_value=0, max_value=1)
    
    # Input parameters (echo back for audit trail)
    nitrogen = FloatField(required=True)
    phosphorus = FloatField(required=True)
    potassium = FloatField(required=True)
    ph = FloatField(required=True)
    organic_matter = FloatField(required=True)
    
    # Recommendations
    recommendations = ListField(StringField(max_length=500), default=list)
    
    # Metadata
    created_at = DateTimeField(default=datetime.utcnow, required=True)
    updated_at = DateTimeField(default=datetime.utcnow)
    
    # Audit trail
    user_agent = StringField(max_length=255)
    ip_address = StringField(max_length=45)
    
    meta = {
        'collection': 'soil_predictions',
        'indexes': [
            'created_at',
            ('soil_type', 'created_at'),
            ('fertility_level', '-created_at'),
            '-created_at',
        ]
    }
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert document to dictionary."""
        return {
            "id": str(self.id),
            "soil_type": self.soil_type,
            "fertility_level": self.fertility_level,
            "confidence_score": self.confidence_score,
            "input_parameters": {
                "nitrogen": self.nitrogen,
                "phosphorus": self.phosphorus,
                "potassium": self.potassium,
                "ph": self.ph,
                "organic_matter": self.organic_matter,
            },
            "recommendations": self.recommendations,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }


class PlantPrediction(Document):
    """Document model for plant disease detection predictions."""
    
    is_healthy = BooleanField(required=True)
    primary_diagnosis = StringField(max_length=100)
    confidence_score = FloatField(required=True, min_value=0, max_value=1)
    
    # Detected diseases with confidence scores
    detected_diseases = ListField(
        EmbeddedDocumentField(DiseaseDetection),
        default=list
    )
    
    # Image information
    image_filename = StringField(required=True, max_length=255)
    image_size_kb = FloatField(min_value=0)
    image_hash = StringField(max_length=64)  # SHA256 hash for deduplication
    
    # Model information
    model_version = StringField(default="1.0.0", max_length=20)
    
    # Metadata
    created_at = DateTimeField(default=datetime.utcnow, required=True)
    updated_at = DateTimeField(default=datetime.utcnow)
    
    # Audit trail
    user_agent = StringField(max_length=255)
    ip_address = StringField(max_length=45)
    
    meta = {
        'collection': 'plant_predictions',
        'indexes': [
            'created_at',
            ('is_healthy', '-created_at'),
            ('primary_diagnosis', '-created_at'),
            '-created_at',
            'image_hash',  # For deduplication
        ]
    }
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert document to dictionary."""
        return {
            "id": str(self.id),
            "is_healthy": self.is_healthy,
            "primary_diagnosis": self.primary_diagnosis,
            "confidence_score": self.confidence_score,
            "detected_diseases": [
                {
                    "disease_name": d.disease_name,
                    "confidence": d.confidence,
                    "treatment": d.treatment,
                }
                for d in self.detected_diseases
            ],
            "image_filename": self.image_filename,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }


# Ensure all collections exist
try:
    CropPrediction.ensure_indexes()
    SoilPrediction.ensure_indexes()
    PlantPrediction.ensure_indexes()
except Exception as e:
    import logging
    logger = logging.getLogger(__name__)
    logger.warning(f"Could not ensure indexes: {e}")
