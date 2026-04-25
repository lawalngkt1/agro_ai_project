from flask import Blueprint, request, jsonify, current_app
from app import mongo
from app.utils.validator import validate_crop_input
from app.utils.model_loader import get_crop_model
from app.utils.ai_processor import generate_crop_summary, generate_crop_hausa
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
        nitrogen = float(data['nitrogen'])
        phosphorus = float(data['phosphorus'])
        potassium = float(data['potassium'])
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
        input_data = np.array([[nitrogen, phosphorus, potassium, temperature, humidity, ph, rainfall]])
        prediction = model.predict(input_data)[0]
        
        # Get prediction probability
        prediction_proba = model.predict_proba(input_data)[0]
        confidence = float(np.max(prediction_proba))
        
        # Store in database
        record = {
            'type': 'crop_prediction',
            'input': {
                'nitrogen': nitrogen,
                'phosphorus': phosphorus,
                'potassium': potassium,
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
        
        # Calculate status for metrics
        def get_status(val, min_val, max_val):
            if val < min_val: return "low"
            if val > max_val: return "high"
            return "optimal"
        
        metrics = [
            {"label": "Nitrogen", "value": f"{nitrogen} mg/kg", "status": get_status(nitrogen, 60, 100), "recommendation": "Essential for leaf growth and green color."},
            {"label": "Phosphorus", "value": f"{phosphorus} mg/kg", "status": get_status(phosphorus, 30, 60), "recommendation": "Vital for root development and flowering."},
            {"label": "Potassium", "value": f"{potassium} mg/kg", "status": get_status(potassium, 30, 60), "recommendation": "Improves disease resistance and water use."},
            {"label": "pH Level", "value": f"{ph}", "status": get_status(ph, 6.0, 7.5), "recommendation": "Influences nutrient availability to plants."}
        ]
        
        return jsonify({
            'success': True,
            'predicted_crop': str(prediction),
            'confidence': round(confidence, 4),
            'message': f'Based on your soil and climate parameters, {prediction} is recommended.',
            'ai_summary': generate_crop_summary(str(prediction), confidence),
            'ai_summary_hausa': generate_crop_hausa(str(prediction)),
            'metrics': metrics,
            'prediction_id': str(result.inserted_id)
        }), 200
        
    except ValueError as e:
        return jsonify({'error': f'Invalid input value: {str(e)}'}), 400
    except Exception as e:
        current_app.logger.error(f'Crop prediction error: {str(e)}')
        error_msg = str(e)
        if "not found" in error_msg.lower() or "no such file" in error_msg.lower():
            return jsonify({'error': 'Prediction model file is missing on the server. Please contact support.', 'details': error_msg}), 503
        return jsonify({'error': 'Prediction failed', 'details': error_msg}), 500


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
