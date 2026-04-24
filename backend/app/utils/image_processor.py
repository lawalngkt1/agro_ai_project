"""
Image processing utilities for plant disease detection.
Handles image validation, resizing, and preprocessing.
"""

import os
import io
import hashlib
from typing import Tuple, Optional
from PIL import Image
import numpy as np
import logging

from .errors import ImageProcessingError

logger = logging.getLogger(__name__)

# Configuration constants
ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png', 'gif', 'bmp'}
MAX_IMAGE_SIZE_MB = 10
MAX_IMAGE_DIMENSIONS = (4096, 4096)
TARGET_SIZE = (224, 224)  # Standard CNN input size


def validate_image_file(file_obj, filename: str, max_size_mb: int = MAX_IMAGE_SIZE_MB) -> Tuple[str, float]:
    """
    Validate image file for format, size, and content.
    
    Args:
        file_obj: File object from request
        filename: Original filename
        max_size_mb: Maximum allowed file size in MB
        
    Returns:
        Tuple of (validated_filename, file_size_mb)
        
    Raises:
        ImageProcessingError: If validation fails
    """
    # Validate extension
    if not filename or '.' not in filename:
        raise ImageProcessingError("Invalid filename")
    
    ext = filename.rsplit('.', 1)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise ImageProcessingError(
            f"Invalid file type. Allowed: {', '.join(ALLOWED_EXTENSIONS)}",
            details={"allowed_extensions": list(ALLOWED_EXTENSIONS)}
        )
    
    # Read file content
    file_obj.seek(0)
    file_content = file_obj.read()
    file_size_mb = len(file_content) / (1024 * 1024)
    
    if file_size_mb > max_size_mb:
        raise ImageProcessingError(
            f"File too large. Maximum size: {max_size_mb}MB, received: {file_size_mb:.2f}MB",
            details={"max_size_mb": max_size_mb, "received_mb": round(file_size_mb, 2)}
        )
    
    # Validate image format
    try:
        img = Image.open(io.BytesIO(file_content))
        if img.size[0] > MAX_IMAGE_DIMENSIONS[0] or img.size[1] > MAX_IMAGE_DIMENSIONS[1]:
            raise ImageProcessingError(
                f"Image dimensions too large. Maximum: {MAX_IMAGE_DIMENSIONS}",
                details={"max_dimensions": MAX_IMAGE_DIMENSIONS, "received": img.size}
            )
        
        # Ensure RGB or RGBA
        if img.mode not in ('RGB', 'RGBA', 'L'):
            img = img.convert('RGB')
            
    except Exception as e:
        if isinstance(e, ImageProcessingError):
            raise
        raise ImageProcessingError(f"Invalid image file: {str(e)}")
    
    logger.info(f"✅ Image validated: {filename} ({file_size_mb:.2f}MB, {img.size})")
    return filename, file_size_mb


def process_plant_image(file_obj, target_size: Tuple[int, int] = TARGET_SIZE) -> Tuple[np.ndarray, str]:
    """
    Process and preprocess plant image for model inference.
    
    Args:
        file_obj: File object from request
        target_size: Target image size for model input
        
    Returns:
        Tuple of (processed_array, image_hash)
        
    Raises:
        ImageProcessingError: If processing fails
    """
    try:
        file_obj.seek(0)
        img = Image.open(io.BytesIO(file_obj.read()))
        
        # Convert to RGB if necessary
        if img.mode != 'RGB':
            img = img.convert('RGB')
        
        # Resize maintaining aspect ratio
        img.thumbnail(target_size, Image.Resampling.LANCZOS)
        
        # Create new image with target size (pad if necessary)
        new_img = Image.new('RGB', target_size, (0, 0, 0))
        offset = (
            (target_size[0] - img.size[0]) // 2,
            (target_size[1] - img.size[1]) // 2
        )
        new_img.paste(img, offset)
        
        # Convert to numpy array
        img_array = np.array(new_img, dtype=np.float32)
        
        # Normalize to [0, 1]
        img_array = img_array / 255.0
        
        # Calculate image hash for deduplication
        file_obj.seek(0)
        image_hash = hashlib.sha256(file_obj.read()).hexdigest()
        
        logger.info(f"✅ Image processed: {target_size}, hash: {image_hash[:8]}...")
        return img_array, image_hash
        
    except ImageProcessingError:
        raise
    except Exception as e:
        raise ImageProcessingError(f"Image processing failed: {str(e)}")


def get_image_metadata(file_obj) -> dict:
    """
    Extract metadata from image file.
    
    Args:
        file_obj: File object from request
        
    Returns:
        Dictionary containing image metadata
    """
    try:
        file_obj.seek(0)
        img = Image.open(io.BytesIO(file_obj.read()))
        
        metadata = {
            "format": img.format,
            "size": img.size,
            "mode": img.mode,
            "dpi": img.info.get('dpi', None),
        }
        
        return metadata
        
    except Exception as e:
        logger.warning(f"Could not extract image metadata: {e}")
        return {}


def save_image_locally(file_obj, filename: str, upload_dir: str = "uploads/images") -> str:
    """
    Save uploaded image to local filesystem.
    
    Args:
        file_obj: File object from request
        filename: Original filename
        upload_dir: Directory to save images
        
    Returns:
        Path to saved file
    """
    try:
        os.makedirs(upload_dir, exist_ok=True)
        
        # Generate unique filename
        timestamp = __import__('time').strftime('%Y%m%d_%H%M%S_')
        safe_filename = timestamp + os.path.basename(filename)
        filepath = os.path.join(upload_dir, safe_filename)
        
        file_obj.seek(0)
        with open(filepath, 'wb') as f:
            f.write(file_obj.read())
        
        logger.info(f"✅ Image saved: {filepath}")
        return filepath
        
    except Exception as e:
        logger.error(f"Error saving image: {e}")
        raise ImageProcessingError(f"Failed to save image: {str(e)}")


def delete_image_locally(filepath: str) -> bool:
    """
    Delete image file from local filesystem.
    
    Args:
        filepath: Path to file to delete
        
    Returns:
        True if successful, False otherwise
    """
    try:
        if os.path.exists(filepath):
            os.remove(filepath)
            logger.info(f"✅ Image deleted: {filepath}")
            return True
        return False
    except Exception as e:
        logger.error(f"Error deleting image: {e}")
        return False
