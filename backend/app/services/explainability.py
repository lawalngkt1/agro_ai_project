def explain_result(model_type: str):
    return {
        "model": model_type,
        "feature_importance": {
            "N": 0.35,
            "P": 0.25,
            "K": 0.20,
            "ph": 0.20
        },
        "note": "Replace with SHAP integration in production"
    }