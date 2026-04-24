from flask import Blueprint, jsonify

bp = Blueprint('health', __name__, url_prefix='/api/health')


@bp.route('/', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'message': 'AgroAI Backend is running',
        'version': '1.0.0'
    }), 200
