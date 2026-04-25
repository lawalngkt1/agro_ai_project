from flask import Blueprint, request, jsonify, current_app
from app import mongo
from app.utils.image_processor import process_plant_image
from app.utils.model_loader import get_plant_model
from app.utils.ai_processor import generate_plant_summary, generate_plant_hausa
from datetime import datetime
import os

bp = Blueprint('plant', __name__, url_prefix='/api/plant')


@bp.route('/predict', methods=['POST'])
def predict_plant_disease():
    """
    Detect plant diseases from image
    
    Expected: multipart/form-data with 'image' file
    """
    try:
        # Check if image is present
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400
        
        file = request.files['image']
        if file.filename == '':
            return jsonify({'error': 'No image selected'}), 400
        
        # Validate file type
        allowed_extensions = {'jpg', 'jpeg', 'png', 'gif'}
        if '.' not in file.filename or file.filename.rsplit('.', 1)[1].lower() not in allowed_extensions:
            return jsonify({'error': 'Invalid file type. Allowed: jpg, jpeg, png, gif'}), 400
        
        # Process image
        processed_image, image_hash = process_plant_image(file)
        
        # Load model
        model = get_plant_model()
        if model is None:
            return jsonify({'error': 'Model not available'}), 503
        
        # Make prediction
        import numpy as np
        
        # Add batch dimension
        processed_image = np.expand_dims(processed_image, axis=0)
        predictions = model.predict(processed_image)
        confidence = float(np.max(predictions))
        disease_class = int(np.argmax(predictions))
        
        # Disease classes (example - update with actual classes from your model)
        diseases = {
            0: 'Healthy',
            1: 'Early Blight',
            2: 'Late Blight',
            3: 'Leaf Spot',
            4: 'Powdery Mildew',
            # Add more diseases as needed
        }
        
        detected_disease = diseases.get(disease_class, f'Disease Class {disease_class}')
        
        # Treatment recommendations
        treatments = {
            'Healthy': 'Plant is healthy. Continue regular maintenance.',
            'Early Blight': 'Remove affected leaves, apply fungicide, improve ventilation',
            'Late Blight': 'Apply copper fungicide immediately, reduce humidity',
            'Leaf Spot': 'Remove affected leaves, avoid overhead watering',
            'Powdery Mildew': 'Apply sulfur spray, improve air circulation',
        }
        
        # Store in database
        record = {
            'type': 'plant_prediction',
            'image_hash': image_hash,
            'output': {
                'detected_disease': detected_disease,
                'confidence': confidence,
                'treatment': treatments.get(detected_disease, 'Consult agricultural expert'),
                'all_predictions': {diseases.get(i, f'Class {i}'): float(predictions[0][i]) for i in range(len(predictions[0]))}
            },
            'timestamp': datetime.utcnow()
        }
        
        result = mongo.db.predictions.insert_one(record)
        
        return jsonify({
            'success': True,
            'detected_disease': detected_disease,
            'confidence': round(confidence, 4),
            'treatment': treatments.get(detected_disease, 'Consult agricultural expert'),
            'ai_summary': generate_plant_summary(detected_disease, treatments.get(detected_disease, 'Consult agricultural expert')),
            'ai_summary_hausa': generate_plant_hausa(detected_disease),
            'prediction_id': str(result.inserted_id)
        }), 200
        
    except Exception as e:
        current_app.logger.error(f'Plant prediction error: {str(e)}')
        return jsonify({'error': 'Prediction failed', 'details': str(e)}), 500


@bp.route('/history', methods=['GET'])
def get_plant_history():
    """Get plant disease detection history"""
    try:
        limit = request.args.get('limit', 10, type=int)
        predictions = list(mongo.db.predictions.find(
            {'type': 'plant_prediction'}
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
