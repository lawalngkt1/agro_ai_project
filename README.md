# 🌱 AgroAI Advisor

An AI-powered agricultural decision support system that helps farmers and users:
- 🌿 Detect plant diseases from images
- 🌍 Classify soil types
- 🌾 Recommend the best crops to plant
- 🧠 Provide explainable AI insights

---

# 🚀 Features

## 📱 Mobile App (Flutter)
- Camera-based plant detection
- Crop recommendation interface
- Soil analysis input
- Voice assistant (Hausa & English)

## 🧠 AI Models
- CNN for plant disease detection
- Random Forest for soil classification
- Random Forest for crop recommendation

## ☁️ Backend API
- Flask REST API
- JSON-based communication
- Deployable on cloud (Render/Railway)

## 🌍 Offline Support
- Cached predictions
- Lightweight local logic for crop recommendation

---

# 🏗️ Project Structure

```
agro_ai_project/
├── data/
├── models/
├── frontend/
├── backend/
├── app.py
├── train_crop_model.py
├── train_soil_model.py
├── train_plant_model.py
├── explain.py
├── requirements.txt
├── Procfile
└── README.md
```

---

# ⚙️ Installation

## 1. Clone Repository
```
git clone https://github.com/yourusername/agroai.git
cd agroai
```

## 2. Create Virtual Environment
```
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate   # Windows
```

## 3. Install Dependencies
```
pip install -r requirements.txt
```

---

# 🧠 Train Models

```
python train_crop_model.py
python train_soil_model.py
python train_plant_model.py
```

Models will be saved in `/models`

---

# ▶️ Run Backend API

```
python app.py
```

API will run at:
```
http://127.0.0.1:5000
```

---

# 📡 API Endpoints

## 🌾 Crop Recommendation
```
POST /predict_crop
```

## 🌍 Soil Classification
```
POST /predict_soil
```

## 🌿 Plant Disease Detection
```
POST /predict_plant
```

---

# 📱 Flutter App Setup

```
flutter create agro_ai_app
cd agro_ai_app
```

Update API base URL:
```dart
static const baseUrl = "http://10.0.2.2:5000";
```

Run:
```
flutter run
```

---

# ☁️ Deployment (Render)

## Build Command
```
pip install -r requirements.txt
```

## Start Command
```
gunicorn app:app
```

After deployment, you will get:
```
https://your-app.onrender.com
```

---

# 📊 Datasets

- PlantVillage (Plant Disease Images)
- Crop Recommendation Dataset (Kaggle)
- Soil Dataset (Kaggle)

---

# 🧪 Evaluation Metrics

- Accuracy
- Precision
- Recall
- F1 Score
- Confusion Matrix

---

# 🧾 Contribution

This project integrates:
- Artificial Intelligence
- Computer Vision
- Explainable AI
- Mobile Computing
- Cloud Deployment

---

# 🔮 Future Improvements

- Real-time camera inference (on-device AI)
- Weather API integration
- Offline full model support
- Multi-language voice assistant

---

# 👨‍💻 Author

- Name: Your Name
- Program: MSc / BSc Project
- Field: Artificial Intelligence / Computer Science

---

# 📄 License

This project is for academic and research purposes.
