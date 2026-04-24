"""Input validation utilities"""


def validate_crop_input(data):
    """Validate crop prediction input"""
    if not isinstance(data, dict):
        return False, "Invalid input format"
    
    required_fields = ['nitrogen', 'phosphorus', 'potassium', 'temperature', 'humidity', 'ph', 'rainfall']
    
    for field in required_fields:
        if field not in data:
            return False, f"Missing required field: {field}"
    
    try:
        # Check ranges
        N = float(data['nitrogen'])
        P = float(data['phosphorus'])
        K = float(data['potassium'])
        temp = float(data['temperature'])
        humid = float(data['humidity'])
        ph = float(data['ph'])
        rain = float(data['rainfall'])
        
        # Validate reasonable ranges
        if not (0 <= N <= 250):
            return False, "Nitrogen should be between 0-250"
        if not (0 <= P <= 250):
            return False, "Phosphorus should be between 0-250"
        if not (0 <= K <= 250):
            return False, "Potassium should be between 0-250"
        if not (-20 <= temp <= 50):
            return False, "Temperature should be between -20 to 50°C"
        if not (0 <= humid <= 100):
            return False, "Humidity should be between 0-100%"
        if not (0 <= ph <= 14):
            return False, "pH should be between 0-14"
        if not (0 <= rain <= 500):
            return False, "Rainfall should be between 0-500 mm"
        
        return True, ""
    except (ValueError, TypeError):
        return False, "All fields must be numeric"


def validate_soil_input(data):
    """Validate soil analysis input"""
    if not isinstance(data, dict):
        return False, "Invalid input format"
    
    required_fields = ['nitrogen', 'phosphorus', 'potassium', 'ph', 'organic_matter']
    
    for field in required_fields:
        if field not in data:
            return False, f"Missing required field: {field}"
    
    try:
        N = float(data['nitrogen'])
        P = float(data['phosphorus'])
        K = float(data['potassium'])
        ph = float(data['ph'])
        om = float(data['organic_matter'])
        
        if not (0 <= N <= 250):
            return False, "Nitrogen should be between 0-250"
        if not (0 <= P <= 250):
            return False, "Phosphorus should be between 0-250"
        if not (0 <= K <= 250):
            return False, "Potassium should be between 0-250"
        if not (0 <= ph <= 14):
            return False, "pH should be between 0-14"
        if not (0 <= om <= 100):
            return False, "Organic matter should be between 0-100%"
        
        return True, ""
    except (ValueError, TypeError):
        return False, "All fields must be numeric"
