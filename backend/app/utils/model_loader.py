"""Model loading utilities"""
import os
import pickle
import numpy as np
from flask import current_app

# Global model cache
_crop_model = None
_soil_model = None
_plant_model = None


def get_crop_model():
    """Load and cache crop recommendation model"""
    global _crop_model
    
    if _crop_model is not None:
        return _crop_model
    
    try:
        model_path = current_app.config['CROP_MODEL_PATH']
        if os.path.exists(model_path):
            with open(model_path, 'rb') as f:
                _crop_model = pickle.load(f)
            return _crop_model
    except Exception as e:
        current_app.logger.error(f"Error loading crop model: {str(e)}")
        return None


def get_soil_model():
    """Load and cache soil analysis model"""
    global _soil_model
    
    if _soil_model is not None:
        return _soil_model
    
    try:
        model_path = current_app.config['SOIL_MODEL_PATH']
        if os.path.exists(model_path):
            with open(model_path, 'rb') as f:
                _soil_model = pickle.load(f)
            return _soil_model
    except Exception as e:
        current_app.logger.error(f"Error loading soil model: {str(e)}")
        return None


def get_plant_model():
    """Load and cache plant disease detection model"""
    global _plant_model
    
    if _plant_model is not None:
        return _plant_model
    
    try:
        model_path = current_app.config['PLANT_MODEL_PATH']
        if os.path.exists(model_path):
            import tensorflow as tf
            _plant_model = tf.keras.models.load_model(model_path)
            return _plant_model
    except Exception as e:
        current_app.logger.error(f"Error loading plant model: {str(e)}")
        return None


def reset_models():
    """Reset cached models"""
    global _crop_model, _soil_model, _plant_model
    _crop_model = None
    _soil_model = None
    _plant_model = None
