import numpy as np
from app.models.loader import crop_model, soil_model

def predict_crop(data):
    features = np.array([[data.N, data.P, data.K,
                          data.temperature,
                          data.humidity,
                          data.ph,
                          data.rainfall]])
    return crop_model.predict(features)[0]


def predict_soil(data):
    features = np.array([[data.N, data.P, data.K,
                          data.ph, data.moisture]])
    return soil_model.predict(features)[0]