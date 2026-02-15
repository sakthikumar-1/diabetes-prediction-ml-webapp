from flask import Flask, render_template, request
import pickle
import os
import numpy as np

app = Flask(__name__)

# Load models (make sure you have these pickle files in models folder)
try:
    # For quick prediction model
    quick_model_path = os.path.join("models", "diabetes_quick_model.pkl")
    if os.path.exists(quick_model_path):
        quick_model = pickle.load(open(quick_model_path, "rb"))
    else:
        print("Quick model not found, using dummy logic")
        quick_model = None
        
    # For full prediction model
    full_model_path = os.path.join("models", "diabetes_full_model.pkl")
    if os.path.exists(full_model_path):
        full_model = pickle.load(open(full_model_path, "rb"))
    else:
        print("Full model not found, using dummy logic")
        full_model = None
        
except Exception as e:
    print(f"Error loading models: {e}")
    quick_model = None
    full_model = None

def safe_float(val, default=0.0):
    """Safely convert to float"""
    if val is None or val == '':
        return default
    try:
        return float(val)
    except:
        return default

def predict_with_model(model, features):
    """Make prediction using loaded model"""
    if model is not None:
        try:
            # Convert features to numpy array
            features_array = np.array(features).reshape(1, -1)
            prediction = model.predict(features_array)
            probability = model.predict_proba(features_array)[0][1] * 100 if hasattr(model, 'predict_proba') else (prediction[0] * 100)
            return prediction[0], round(float(probability), 2)
        except Exception as e:
            print(f"Model prediction error: {e}")
    
    # Fallback dummy logic if model fails
    return 1, 65.5  # Default: Diabetic with 65.5% probability

@app.route("/")
def patient():
    """Patient details page"""
    return render_template("patient.html")

@app.route("/choice")
def choice():
    """Prediction type selection page"""
    # Get patient details from previous page
    name = request.args.get("name", "")
    age = request.args.get("age", "")
    gender = request.args.get("gender", "")
    
    return render_template("choice.html", 
                         name=name, 
                         age=age, 
                         gender=gender)

@app.route("/quick")
def quick():
    """Quick prediction page"""
    return render_template("quick.html")

@app.route("/full")
def full():
    """Full prediction page"""
    return render_template("full.html")

@app.route("/predict")
def predict():
    """Handle both quick and full predictions"""
    # Get all parameters from form
    bmi = safe_float(request.args.get("bmi"))
    glucose = safe_float(request.args.get("glucose"))
    age = safe_float(request.args.get("age"))
    
    # Full prediction parameters
    pregnancies = safe_float(request.args.get("preg", 0))
    blood_pressure = safe_float(request.args.get("bp", 0))
    skin_thickness = safe_float(request.args.get("skin", 0))
    insulin = safe_float(request.args.get("insulin", 0))
    dpf = safe_float(request.args.get("dpf", 0.0))
    
    # Check if this is quick or full prediction
    is_full_prediction = (pregnancies > 0 or blood_pressure > 0 or 
                         skin_thickness > 0 or insulin > 0 or dpf > 0)
    
    # Make prediction
    if is_full_prediction:
        # Full prediction with all parameters
        if full_model is not None:
            features = [pregnancies, glucose, blood_pressure, skin_thickness,
                       insulin, bmi, dpf, age]
            prediction, probability = predict_with_model(full_model, features)
        else:
            # Dummy logic for full prediction
            probability = min(100, round((pregnancies * 5 + glucose * 0.3 + 
                                         bmi * 0.8 + age * 0.5 + 
                                         insulin * 0.1) / 2, 2))
            prediction = 1 if probability > 50 else 0
    else:
        # Quick prediction with minimal parameters
        if quick_model is not None:
            features = [bmi, glucose, age]
            prediction, probability = predict_with_model(quick_model, features)
        else:
            # Dummy logic for quick prediction
            probability = min(100, round((bmi * 0.8 + glucose * 0.4 + age * 0.2), 2))
            prediction = 1 if probability > 50 else 0
    
    # Determine risk level
    if probability < 30:
        risk = "Low"
        risk_level = "low"
        result_text = "Non-Diabetic"
    elif probability < 70:
        risk = "Medium"
        risk_level = "medium"
        result_text = "Pre-Diabetic"
    else:
        risk = "High"
        risk_level = "high"
        result_text = "Diabetic"
    
    # Prepare data for result page
    result_data = {
        "probability": round(probability, 2),
        "risk": risk,
        "risk_level": risk_level,
        "result_text": result_text,
        "bmi": bmi,
        "glucose": glucose,
        "age": age,
        "insulin": insulin,
        "pregnancies": pregnancies,
        "blood_pressure": blood_pressure,
        "skin_thickness": skin_thickness,
        "dpf": dpf
    }
    
    return render_template("result.html", **result_data)

@app.route("/analysis")
def analysis():
    """Detailed analysis page with charts"""
    # Get data from URL parameters
    probability = safe_float(request.args.get("probability", 50))
    bmi = safe_float(request.args.get("bmi", 25))
    glucose = safe_float(request.args.get("glucose", 100))
    age = safe_float(request.args.get("age", 40))
    insulin = safe_float(request.args.get("insulin", 100))
    
    # Get additional parameters if available
    pregnancies = safe_float(request.args.get("pregnancies", 0))
    blood_pressure = safe_float(request.args.get("blood_pressure", 120))
    skin_thickness = safe_float(request.args.get("skin_thickness", 20))
    dpf = safe_float(request.args.get("dpf", 0.5))
    
    # Determine risk level for display
    if probability < 30:
        risk_level = "low"
        risk_text = "Low Risk"
    elif probability < 70:
        risk_level = "medium"
        risk_text = "Medium Risk"
    else:
        risk_level = "high"
        risk_text = "High Risk"
    
    return render_template(
        "analysis.html",
        probability=probability,
        bmi=bmi,
        glucose=glucose,
        age=age,
        insulin=insulin,
        pregnancies=pregnancies,
        blood_pressure=blood_pressure,
        skin_thickness=skin_thickness,
        dpf=dpf,
        risk_level=risk_level,
        risk_text=risk_text
    )

@app.route("/result")
def result():
    """Direct result page (if needed)"""
    # Get data from URL parameters
    probability = safe_float(request.args.get("probability", 50))
    risk = request.args.get("risk", "Medium")
    risk_level = request.args.get("risk_level", "medium")
    result_text = request.args.get("result_text", "Pre-Diabetic")
    
    return render_template(
        "result.html",
        probability=probability,
        risk=risk,
        risk_level=risk_level,
        result_text=result_text
    )

# Error handlers
@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

@app.errorhandler(500)
def internal_server_error(e):
    return render_template('500.html'), 500

if __name__ == "__main__":
    # Create models folder if it doesn't exist
    if not os.path.exists("models"):
        os.makedirs("models")
        print("Created models folder - please add your pickle files here")
    
    # Run the app
    app.run(debug=True, host='0.0.0.0', port=5000)