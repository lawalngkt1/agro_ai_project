"""
AgroAI Backend Application Factory
"""
import os
from flask import Flask
from flask_cors import CORS
from .database.db import init_db

# We'll use a simple mock for mongo since main.py expects it
class MongoMock:
    def __init__(self):
        self.db = None
mongo = MongoMock()

def create_app(config_name='development'):
    """Create and configure the Flask application"""
    app = Flask(__name__)
    
    # Load configuration
    from config import config_by_name
    app.config.from_object(config_by_name[config_name])
    
    # Initialize CORS
    CORS(app, resources={r"/api/*": {"origins": app.config['CORS_ORIGINS']}})
    
    # Initialize Database
    try:
        init_db(app.config['MONGO_URI'])
        from .database.db import get_db
        mongo.db = get_db()
    except Exception as e:
        app.logger.warning(f"Failed to initialize database: {e}. Using MongoMock.")
        # In development we might want to continue without DB for simple testing
        from unittest.mock import MagicMock
        mongo.db = MagicMock()
        if config_name == 'production':
            raise e

    # Register Blueprints
    from .routes.health_bp import bp as health_bp
    from .routes.crop_bp import bp as crop_bp
    from .routes.soil_bp import bp as soil_bp
    from .routes.plant_bp import bp as plant_bp
    
    app.register_blueprint(health_bp)
    app.register_blueprint(crop_bp)
    app.register_blueprint(soil_bp)
    app.register_blueprint(plant_bp)
    
    return app
