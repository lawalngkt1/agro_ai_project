"""Model loading utilities"""
import os
import pickle
import numpy as np
from flask import current_app

# Global model cache
_crop_model = None
_soil_model = None
_plant_model = None

class MockModel:
    """Mock model for development when actual files are missing"""
    def predict(self, data):
        import random
        # Return a random class or value based on input shape if needed
        # For simplicity, returning a fixed value or based on context
        if hasattr(self, 'type') and self.type == 'soil':
            return [random.randint(0, 4)]
        if hasattr(self, 'type') and self.type == 'plant':
            return [[0.8, 0.1, 0.05, 0.03, 0.02]]
        return ["rice"] # Default for crop

    def predict_proba(self, data):
        import numpy as np
        if hasattr(self, 'type') and self.type == 'plant':
             return np.array([[0.8, 0.1, 0.05, 0.03, 0.02]])
        return np.array([[0.85, 0.05, 0.03, 0.02, 0.01, 0.01, 0.01, 0.01, 0.01]])

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
        elif current_app.config.get('DEBUG'):
            current_app.logger.warning("Crop model not found, using MockModel")
            mock = MockModel()
            mock.type = 'crop'
            return mock
    except Exception as e:
        current_app.logger.error(f"Error loading crop model: {str(e)}")
        if current_app.config.get('DEBUG'):
             mock = MockModel()
             mock.type = 'crop'
             return mock
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
        elif current_app.config.get('DEBUG'):
            current_app.logger.warning("Soil model not found, using MockModel")
            mock = MockModel()
            mock.type = 'soil'
            return mock
    except Exception as e:
        current_app.logger.error(f"Error loading soil model: {str(e)}")
        if current_app.config.get('DEBUG'):
            mock = MockModel()
            mock.type = 'soil'
            return mock
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
        elif current_app.config.get('DEBUG'):
            current_app.logger.warning("Plant model not found, using MockModel")
            mock = MockModel()
            mock.type = 'plant'
            return mock
    except Exception as e:
        current_app.logger.error(f"Error loading plant model: {str(e)}")
        if current_app.config.get('DEBUG'):
            mock = MockModel()
            mock.type = 'plant'
            return mock
    return None


def reset_models():
    """Reset cached models"""
    global _crop_model, _soil_model, _plant_model
    _crop_model = None
    _soil_model = None
    _plant_model = None
