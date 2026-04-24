"""
Custom exception classes for AgroAI backend.
Implements structured error handling following Python best practices.
"""


class AgroAIError(Exception):
    """Base exception for all AgroAI errors."""
    
    def __init__(self, message: str, error_code: str, status_code: int = 500, details: dict = None):
        self.message = message
        self.error_code = error_code
        self.status_code = status_code
        self.details = details or {}
        super().__init__(self.message)


class ValidationError(AgroAIError):
    """Raised when input validation fails."""
    
    def __init__(self, message: str, status_code: int = 422, details: dict = None):
        super().__init__(message, "VALIDATION_ERROR", status_code, details)


class ModelError(AgroAIError):
    """Raised when ML model loading or inference fails."""
    
    def __init__(self, message: str, status_code: int = 500, details: dict = None):
        super().__init__(message, "MODEL_ERROR", status_code, details)


class DatabaseError(AgroAIError):
    """Raised when database operations fail."""
    
    def __init__(self, message: str, status_code: int = 500, details: dict = None):
        super().__init__(message, "DATABASE_ERROR", status_code, details)


class ImageProcessingError(AgroAIError):
    """Raised when image processing fails."""
    
    def __init__(self, message: str, status_code: int = 400, details: dict = None):
        super().__init__(message, "IMAGE_PROCESSING_ERROR", status_code, details)


class NotFoundError(AgroAIError):
    """Raised when a resource is not found."""
    
    def __init__(self, message: str, details: dict = None):
        super().__init__(message, "NOT_FOUND", 404, details)


class UnauthorizedError(AgroAIError):
    """Raised when authentication fails."""
    
    def __init__(self, message: str = "Unauthorized"):
        super().__init__(message, "UNAUTHORIZED", 401)


class RateLimitError(AgroAIError):
    """Raised when rate limit is exceeded."""
    
    def __init__(self, message: str = "Rate limit exceeded"):
        super().__init__(message, "RATE_LIMIT_EXCEEDED", 429)
