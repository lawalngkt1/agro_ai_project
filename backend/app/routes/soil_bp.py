from flask import Blueprint, request, jsonify, current_app
from app import mongo
from app.utils.validator import validate_soil_input
from app.utils.model_loader import get_soil_model
from app.utils.ai_processor import generate_soil_summary, generate_soil_hausa
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
        N = float(data.get('nitrogen', data.get('N', 0)))
        P = float(data.get('phosphorus', data.get('P', 0)))
        K = float(data.get('potassium', data.get('K', 0)))
        ph = float(data.get('ph', 0))
        organic_matter = float(data.get('organic_matter', data.get('moisture', 0)))
        
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
        
        # Calculate status for metrics
        def get_status(val, min_val, max_val):
            if val < min_val: return "low"
            if val > max_val: return "high"
            return "optimal"

        metrics = [
            {"label": "Nitrogen", "value": f"{N} mg/kg", "status": get_status(N, 40, 80), "recommendation": "Crucial for plant development."},
            {"label": "Phosphorus", "value": f"{P} mg/kg", "status": get_status(P, 20, 50), "recommendation": "Supports energy transfer."},
            {"label": "Potassium", "value": f"{K} mg/kg", "status": get_status(K, 20, 50), "recommendation": "Regulates water movement."},
            {"label": "Organic Matter", "value": f"{organic_matter}%", "status": get_status(organic_matter, 3, 6), "recommendation": "Improves soil structure."}
        ]
        
        overall_score = 0
        if metrics:
            optimal_count = len([m for m in metrics if m['status'] == 'optimal'])
            overall_score = int((optimal_count / len(metrics)) * 100)

        return jsonify({
            'success': True,
            'soil_type': soil_type,
            'confidence': round(confidence, 4),
            'recommendations': recommendations.get(soil_type, []),
            'ai_summary': generate_soil_summary(soil_type, organic_matter),
            'ai_summary_hausa': generate_soil_hausa(soil_type),
            'metrics': metrics,
            'overall_score': overall_score,
            'prediction_id': str(result.inserted_id)
        }), 200
        
    except ValueError as e:
        return jsonify({'error': f'Invalid input value: {str(e)}'}), 400
    except Exception as e:
        current_app.logger.error(f'Soil prediction error: {str(e)}')
        error_msg = str(e)
        if "not found" in error_msg.lower() or "no such file" in error_msg.lower():
            return jsonify({'error': 'Soil model file is missing on the server.', 'details': error_msg}), 503
        return jsonify({'error': 'Prediction failed', 'details': error_msg}), 500


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
