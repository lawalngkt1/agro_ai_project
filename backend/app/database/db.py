"""
MongoDB connection and initialization.
Implements connection pooling and error handling for production use.
"""

import os
from typing import Optional
from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError, ConnectionFailure
import logging

logger = logging.getLogger(__name__)

# Global MongoDB client instance
_client: Optional[MongoClient] = None
_db = None


def init_db(mongo_uri: str, db_name: str = "agro_ai", timeout: int = 5000) -> None:
    """
    Initialize MongoDB connection with connection pooling.
    
    Args:
        mongo_uri: MongoDB connection string
        db_name: Database name
        timeout: Connection timeout in milliseconds
        
    Raises:
        ConnectionFailure: If unable to connect to MongoDB
    """
    global _client, _db
    
    try:
        _client = MongoClient(
            mongo_uri,
            serverSelectionTimeoutMS=timeout,
            connectTimeoutMS=timeout,
            socketTimeoutMS=timeout,
            retryWrites=True,
            w="majority"
        )
        
        # Verify connection
        _client.admin.command("ping")
        _db = _client[db_name]
        
        logger.info(f"✅ MongoDB connected: {db_name}")
        
        # Create indexes
        _create_indexes()
        
    except (ServerSelectionTimeoutError, ConnectionFailure) as e:
        logger.error(f"❌ MongoDB connection failed: {e}")
        raise


def get_db():
    """
    Get MongoDB database instance.
    
    Returns:
        MongoDB database object
        
    Raises:
        RuntimeError: If database not initialized
    """
    if _db is None:
        raise RuntimeError("Database not initialized. Call init_db() first.")
    return _db


def close_db() -> None:
    """Close MongoDB connection gracefully."""
    global _client
    
    if _client:
        try:
            _client.close()
            logger.info("✅ MongoDB connection closed")
        except Exception as e:
            logger.error(f"Error closing MongoDB: {e}")
        finally:
            _client = None


def _create_indexes() -> None:
    """Create database indexes for performance optimization."""
    try:
        db = get_db()
        
        # Crop predictions indexes
        db["crop_predictions"].create_index("created_at", background=True)
        db["crop_predictions"].create_index([("recommended_crop", 1), ("created_at", -1)], background=True)
        
        # Soil predictions indexes
        db["soil_predictions"].create_index("created_at", background=True)
        db["soil_predictions"].create_index([("soil_type", 1), ("created_at", -1)], background=True)
        
        # Plant predictions indexes
        db["plant_predictions"].create_index("created_at", background=True)
        db["plant_predictions"].create_index([("is_healthy", 1), ("created_at", -1)], background=True)
        
        logger.info("✅ Database indexes created")
        
    except Exception as e:
        logger.warning(f"Could not create indexes: {e}")


# Context manager for database sessions
class DatabaseSession:
    """Context manager for safe database operations."""
    
    def __init__(self):
        self.db = None
    
    def __enter__(self):
        self.db = get_db()
        return self.db
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        if exc_type:
            logger.error(f"Database error: {exc_val}")
        return False
