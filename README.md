🩺 Diabetes Prediction Web Application
End-to-End Machine Learning Deployment using Flask
📌 Project Description

The Diabetes Prediction Web Application is a full-stack Machine Learning system designed to predict the risk of diabetes based on patient medical attributes.

This application integrates:

Data preprocessing

Feature engineering

Supervised Machine Learning models

Model serialization

Flask backend deployment

Interactive frontend interface

The system delivers real-time predictions through a structured web interface.

🎯 Problem Statement

Diabetes is a chronic health condition that requires early detection for effective management. This project aims to build a predictive system using clinical health parameters to classify whether a patient is at risk of diabetes.

The model is trained on the PIMA Indian Diabetes Dataset.

🧠 Machine Learning Pipeline

The complete ML lifecycle implemented:

Data Cleaning & Preprocessing

Feature Selection

Model Training

Model Evaluation

Model Serialization using Joblib

Backend Integration with Flask

Real-Time Prediction System

⚙️ Tech Stack
Backend

Python

Flask

Scikit-Learn

NumPy

Pandas

Joblib

Frontend

HTML5

CSS3

JavaScript

Visualization

Charts.js

🏗 Application Architecture

User Input → Flask Backend → Data Preprocessing → ML Model → Prediction → Result Rendering

The system supports:

✔ Quick Prediction Mode
✔ Detailed Prediction Mode
✔ Result Visualization
✔ Structured Multi-Page Flow

📂 Project Structure
DIABETES_APP/
│
├── models/
│     ├── diabetes_full_model.pkl
│     └── diabetes_quick_model.pkl
│
├── static/
│     ├── css/
│     │     └── main.css
│     └── scripts/
│           └── charts.js
│
├── templates/
│     ├── choice.html
│     ├── patient.html
│     ├── quick.html
│     ├── full.html
│     ├── result.html
│     └── analysis.html
│
├── assets/
│     └── screenshots/
│
├── app.py
├── requirements.txt
└── README.md

📊 Model Performance

Algorithm: Classification Model

Evaluation Metrics: Accuracy, Confusion Matrix

Optimized through preprocessing and feature engineering

📸 Application Screenshots
1️⃣ Home Page

2️⃣ Prediction Type Selection

3️⃣ Quick Prediction Input

4️⃣ Quick Prediction Result

5️⃣ Detailed Prediction Result

🚀 How to Run the Project Locally
Step 1: Clone Repository
git clone <your-repo-link>

Step 2: Navigate to Project Folder
cd diabetes-prediction-ml-flask

Step 3: Install Dependencies
pip install -r requirements.txt

Step 4: Run Application
python app.py

Step 5: Open in Browser
http://127.0.0.1:5000/

🔥 Key Highlights

✔ End-to-End ML Implementation
✔ Flask-Based Backend Deployment
✔ Structured Frontend Architecture
✔ Real-Time Prediction System
✔ Clean Project Organization

📈 Future Enhancements

Cloud Deployment (Render / AWS)

REST API Conversion

User Authentication

Model Optimization & Hyperparameter Tuning

👨‍💻 Author

Sakthi Kumar
Data Analyst | ML Engineer
