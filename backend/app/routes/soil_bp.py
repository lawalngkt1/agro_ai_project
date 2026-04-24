from flask import Blueprint, request, jsonify, current_app
from app import mongo
from app.utils.validators import validate_soil_input
from app.utils.model_loader import get_soil_model
from datetime import datetime

bp = Blueprint('soil', __name__, url_prefix='/api/soil')


@bp.route('/predict', methods=['POST'])
def predict_soil():
    """
    Analyze soil and classify soil type
    
    Expected JSON:
    {
        "nitrogen": float,
        "phosphorus": float,
        "potassium": float,
        "ph": float,
        "organic_matter": float
    }
    """
    try:
        data = request.get_json()
        
        # Validate input
        is_valid, error_msg = validate_soil_input(data)
        if not is_valid:
            return jsonify({'error': error_msg}), 400
        
        # Extract parameters
        N = float(data['nitrogen'])
        P = float(data['phosphorus'])
        K = float(data['potassium'])
        ph = float(data['ph'])
        organic_matter = float(data['organic_matter'])
        
        # Load model
        model = get_soil_model()
        if model is None:
            return jsonify({'error': 'Model not available'}), 503
        
        # Make prediction
        import numpy as np
        input_data = np.array([[N, P, K, ph, organic_matter]])
        prediction = model.predict(input_data)[0]
        prediction_proba = model.predict_proba(input_data)[0]
        confidence = float(np.max(prediction_proba))
        
        # Soil type classification
        soil_types = {
            0: 'Sandy',
            1: 'Loamy',
            2: 'Clay',
            3: 'Silty',
            4: 'Peaty'
        }
        
        soil_type = soil_types.get(prediction, 'Unknown')
        
        # Recommendations based on soil type
        recommendations = {
            'Sandy': ['Add organic matter', 'Increase water retention', 'Apply compost'],
            'Loamy': ['Maintain balance', 'Good for most crops', 'Regular monitoring'],
            'Clay': ['Improve drainage', 'Add sand/organic matter', 'Consider raised beds'],
            'Silty': ['Add drainage material', 'Prevent compaction', 'Regular tilling'],
            'Peaty': ['Increase pH', 'Add minerals', 'Improve drainage']
        }
        
        # Store in database
        record = {
            'type': 'soil_prediction',
            'input': {
                'nitrogen': N,
                'phosphorus': P,
                'potassium': K,
                'ph': ph,
                'organic_matter': organic_matter
            },
            'output': {
                'soil_type': soil_type,
                'confidence': confidence,
                'recommendations': recommendations.get(soil_type, [])
            },
            'timestamp': datetime.utcnow()
        }
        
        result = mongo.db.predictions.insert_one(record)
        
        return jsonify({
            'success': True,
            'soil_type': soil_type,
            'confidence': round(confidence, 4),
            'recommendations': recommendations.get(soil_type, []),
            'prediction_id': str(result.inserted_id)
        }), 200
        
    except ValueError as e:
        return jsonify({'error': f'Invalid input value: {str(e)}'}), 400
    except Exception as e:
        current_app.logger.error(f'Soil prediction error: {str(e)}')
        return jsonify({'error': 'Prediction failed', 'details': str(e)}), 500


@bp.route('/history', methods=['GET'])
def get_soil_history():
    """Get soil analysis history"""
    try:
        limit = request.args.get('limit', 10, type=int)
        predictions = list(mongo.db.predictions.find(
            {'type': 'soil_prediction'}
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
