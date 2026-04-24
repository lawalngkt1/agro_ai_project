from flask import Blueprint, request, jsonify, current_app
from app import mongo
from app.utils.validators import validate_crop_input
from app.utils.model_loader import get_crop_model
from datetime import datetime
from bson.objectid import ObjectId

bp = Blueprint('crop', __name__, url_prefix='/api/crop')


@bp.route('/predict', methods=['POST'])
def predict_crop():
    """
    Predict best crop based on soil and climate parameters
    
    Expected JSON:
    {
        "nitrogen": float,
        "phosphorus": float,
        "potassium": float,
        "temperature": float,
        "humidity": float,
        "ph": float,
        "rainfall": float
    }
    """
    try:
        data = request.get_json()
        
        # Validate input
        is_valid, error_msg = validate_crop_input(data)
        if not is_valid:
            return jsonify({'error': error_msg}), 400
        
        # Extract parameters
        N = float(data['nitrogen'])
        P = float(data['phosphorus'])
        K = float(data['potassium'])
        temperature = float(data['temperature'])
        humidity = float(data['humidity'])
        ph = float(data['ph'])
        rainfall = float(data['rainfall'])
        
        # Load model
        model = get_crop_model()
        if model is None:
            return jsonify({'error': 'Model not available'}), 503
        
        # Make prediction
        import numpy as np
        input_data = np.array([[N, P, K, temperature, humidity, ph, rainfall]])
        prediction = model.predict(input_data)[0]
        
        # Get prediction probability
        prediction_proba = model.predict_proba(input_data)[0]
        confidence = float(np.max(prediction_proba))
        
        # Store in database
        record = {
            'type': 'crop_prediction',
            'input': {
                'nitrogen': N,
                'phosphorus': P,
                'potassium': K,
                'temperature': temperature,
                'humidity': humidity,
                'ph': ph,
                'rainfall': rainfall
            },
            'output': {
                'predicted_crop': str(prediction),
                'confidence': confidence
            },
            'timestamp': datetime.utcnow()
        }
        
        result = mongo.db.predictions.insert_one(record)
        record['_id'] = str(result.inserted_id)
        
        return jsonify({
            'success': True,
            'predicted_crop': str(prediction),
            'confidence': round(confidence, 4),
            'message': f'Based on your soil and climate parameters, {prediction} is recommended.',
            'prediction_id': str(result.inserted_id)
        }), 200
        
    except ValueError as e:
        return jsonify({'error': f'Invalid input value: {str(e)}'}), 400
    except Exception as e:
        current_app.logger.error(f'Crop prediction error: {str(e)}')
        return jsonify({'error': 'Prediction failed', 'details': str(e)}), 500


@bp.route('/history', methods=['GET'])
def get_crop_history():
    """Get prediction history"""
    try:
        limit = request.args.get('limit', 10, type=int)
        predictions = list(mongo.db.predictions.find(
            {'type': 'crop_prediction'}
        ).sort('timestamp', -1).limit(limit))
        
        for pred in predictions:
            pred['_id'] = str(pred['_id'])
            pred['timestamp'] = pred['timestamp'].isoformat()
        
        return jsonify({
            'success': True,
            'count': len(predictions),
            'predictions': predictions
        }), 200
    except Exception as e:
        current_app.logger.error(f'Error fetching history: {str(e)}')
        return jsonify({'error': 'Failed to fetch history'}), 500
