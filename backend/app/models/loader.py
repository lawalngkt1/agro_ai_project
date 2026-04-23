import joblib
import tensorflow as tf

crop_model = joblib.load("models/crop_model.pkl")
soil_model = joblib.load("models/soil_model.pkl")
plant_model = tf.keras.models.load_model("models/plant_model.h5")