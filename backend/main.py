#!/usr/bin/env python
"""
AgroAI Backend API
Flask-based REST API for AI-powered agricultural decision support
"""
import os
from app import create_app, mongo
from flask import jsonify

# Create Flask app
app = create_app(os.getenv('FLASK_ENV', 'development'))


@app.shell_context_processor
def make_shell_context():
    """Add useful objects to shell context"""
    return {'db': mongo.db}


@app.route('/', methods=['GET'])
def root():
    """Root endpoint"""
    return jsonify({
        'name': 'AgroAI Advisor Backend',
        'version': '1.0.0',
        'status': 'running',
        'endpoints': {
            'health': '/api/health',
            'crop': {
                'predict': 'POST /api/crop/predict',
                'history': 'GET /api/crop/history'
            },
            'soil': {
                'predict': 'POST /api/soil/predict',
                'history': 'GET /api/soil/history'
            },
            'plant': {
                'predict': 'POST /api/plant/predict',
                'history': 'GET /api/plant/history'
            }
        }
    }), 200


if __name__ == '__main__':
    port = int(os.getenv('API_PORT', 5000))
    host = os.getenv('API_HOST', '0.0.0.0')
    debug = os.getenv('FLASK_ENV') == 'development'
    
    print(f"🌱 Starting AgroAI Backend on {host}:{port}")
    app.run(host=host, port=port, debug=debug)
