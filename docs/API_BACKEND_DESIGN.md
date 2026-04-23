# 🧠 AgroAI API Backend Design Document

## Overview
This document provides a comprehensive guide for building the AgroAI application's API backend. It is intended for use by AI code generation tools and developers. The backend is responsible for serving AI-powered agricultural insights via a RESTful API.

---

## 1. Philosophy & Principles
- **Clarity:** Simple, predictable endpoints and responses.
- **Extensibility:** Modular code for adding new models or endpoints.
- **Security:** Input validation and safe model loading.
- **Explainability:** Provide clear, interpretable outputs and error messages.

---

## 2. Tech Stack
- **Language:** Python 3.9+
- **Framework:** Flask (REST API)
- **ML Libraries:** scikit-learn, TensorFlow, Pillow, SHAP
- **Data:** Models and data files stored in `/models` and `/data`

---

## 3. Project Structure
```
backend/
├── main.py                # API entry point
├── requirements.txt       # Python dependencies
├── models/                # Trained ML models
├── utils/                 # Helper functions (optional)
└── ...
```

---

## 4. API Endpoints
### 4.1. Crop Recommendation
- **POST /predict_crop**
  - **Input:** JSON with soil, weather, and location features
  - **Output:** Recommended crop, confidence, explanation

### 4.2. Soil Classification
- **POST /predict_soil**
  - **Input:** JSON with soil features
  - **Output:** Soil type, confidence, explanation

### 4.3. Plant Disease Detection
- **POST /predict_plant**
  - **Input:** Image file (multipart/form-data)
  - **Output:** Disease label, confidence, explanation

### 4.4. Explainability
- **POST /explain**
  - **Input:** Model type, input features
  - **Output:** SHAP or feature importance explanation

---

## 5. Implementation Guidelines
### 5.1. Model Loading
- Load models at startup (from `/models`).
- Use joblib for scikit-learn, TensorFlow for CNNs.
- Handle missing/corrupt models gracefully.

### 5.2. Input Validation
- Use Pydantic or manual validation for JSON.
- Check for required fields and types.
- For images, validate file type and size.

### 5.3. Prediction Logic
- Preprocess input (scaling, encoding) as per training.
- Run prediction and postprocess output.
- Return confidence scores and explanations.

### 5.4. Error Handling
- Return JSON errors with HTTP status codes (400, 404, 500).
- Log errors for debugging.

### 5.5. CORS & Security
- Enable CORS for frontend domains.
- Limit file upload size.
- Sanitize all inputs.

### 5.6. Documentation
- Use OpenAPI/Swagger (e.g., flask-swagger-ui) for API docs.
- Provide example requests and responses.

---

## 6. Example Endpoint (Flask)
```python
from flask import Flask, request, jsonify
import joblib

app = Flask(__name__)
model = joblib.load('models/crop_model.pkl')

@app.route('/predict_crop', methods=['POST'])
def predict_crop():
    data = request.get_json()
    # Validate and preprocess data...
    pred = model.predict([data['features']])
    return jsonify({'crop': pred[0]})
```

---

## 7. Requirements File Example
```
flask
scikit-learn
tensorflow
pillow
shap
```

---

## 8. Testing & Deployment
- Test endpoints with Postman or curl.
- Use Gunicorn or Waitress for production.
- Deploy on Render, Railway, or similar.

---

## 9. References
- See `README.md` for endpoint list and usage.
- See `requirements.txt` for dependencies.

---

This document should be updated as the API evolves. All code should follow these guidelines for maintainability and clarity.
