"""
AI-Driven Student Performance & Personalized Learning System
Flask REST API Backend Application
"""

import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv

from services.ml_service import ml_service
from services.gemini_service import gemini_service

load_dotenv()

FRONTEND_DIST = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "dist"))
app = Flask(__name__, static_folder=FRONTEND_DIST, static_url_path="/")
# Enable CORS for frontend development and production ports
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Realistic Default Sample Student Profile
DEFAULT_STUDENT = {
    "student_name": "Anuj Dubey",
    "student_id": "STU1024",
    "attendance": 84.5,
    "previous_percentage": 78.0,
    "assignment_score": 76.5,
    "quiz_score": 72.0,
    "internal_marks": 74.0,
    "study_hours": 14.5,
    "completed_assignments": 8,
    "completed_quizzes": 4,
    "subjects": {
        "Data Structures": {"marks": 68.0, "attendance": 82.0},
        "DBMS": {"marks": 76.0, "attendance": 85.0},
        "Artificial Intelligence": {"marks": 84.0, "attendance": 88.0},
        "Computer Networks": {"marks": 56.0, "attendance": 78.0},
        "Operating Systems": {"marks": 72.0, "attendance": 84.0}
    }
}

@app.route("/api/health", methods=["GET"])
def health_check():
    """Health check returning backend status, model readiness, and Gemini config."""
    return jsonify({
        "status": "online",
        "service": "AI-Driven Student Performance & Learning System",
        "model_loaded": ml_service.is_ready(),
        "gemini_api_configured": gemini_service.is_api_configured(),
        "mode": "Live GenAI" if gemini_service.is_api_configured() else "Demo Fallback Mode"
    }), 200

@app.route("/api/model-metrics", methods=["GET"])
def get_model_metrics():
    """Returns Machine Learning model metrics, confusion matrix, and feature importances."""
    metrics = ml_service.get_metrics()
    return jsonify(metrics), 200

@app.route("/api/student/default", methods=["GET"])
def get_default_student():
    """Returns the pre-configured sample student data."""
    return jsonify(DEFAULT_STUDENT), 200

@app.route("/api/predict", methods=["POST"])
def predict_performance():
    """
    Executes ML prediction on student academic features and evaluates subject performance.
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid request. JSON payload is required."}), 400

        # Validate presence of features
        required_fields = [
            "attendance", "previous_percentage", "assignment_score",
            "quiz_score", "internal_marks", "study_hours",
            "completed_assignments", "completed_quizzes"
        ]
        missing = [f for f in required_fields if f not in data]
        if missing:
            return jsonify({"error": f"Missing required fields: {', '.join(missing)}"}), 400

        # Run ML inference
        prediction_result = ml_service.predict(data)

        # Run Subject Analysis if provided
        subjects_data = data.get("subjects", {})
        subject_analysis = ml_service.analyze_subjects(subjects_data)

        return jsonify({
            "student_name": data.get("student_name", "Student"),
            "student_id": data.get("student_id", "Unknown"),
            "prediction": prediction_result,
            "subject_analysis": subject_analysis
        }), 200

    except ValueError as ve:
        return jsonify({"error": "Validation Error", "message": str(ve)}), 400
    except Exception as e:
        return jsonify({"error": "Prediction Error", "message": "Unable to compute prediction at this moment."}), 500

@app.route("/api/generate-feedback", methods=["POST"])
def generate_feedback():
    """
    Generates personalized pedagogical feedback using Gemini API (or demo fallback engine).
    ML and GenAI are kept strictly separate.
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "JSON payload required"}), 400

        student_name = data.get("student_name", "Student")
        student_data = data.get("student_data", {})
        ml_prediction = data.get("prediction", {})
        subject_analysis = data.get("subject_analysis", {})

        feedback_result = gemini_service.generate_feedback(
            student_name=student_name,
            student_data=student_data,
            ml_prediction=ml_prediction,
            subject_analysis=subject_analysis
        )
        return jsonify(feedback_result), 200

    except Exception as e:
        return jsonify({
            "error": "Feedback Generation Error",
            "message": "Unable to generate personalized feedback right now. Please try again."
        }), 500

@app.route("/api/generate-study-plan", methods=["POST"])
def generate_study_plan():
    """
    Generates a personalized 7-day study plan using Gemini API (or demo fallback engine).
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "JSON payload required"}), 400

        student_name = data.get("student_name", "Student")
        student_data = data.get("student_data", {})
        ml_prediction = data.get("prediction", {})
        subject_analysis = data.get("subject_analysis", {})

        plan_result = gemini_service.generate_study_plan(
            student_name=student_name,
            student_data=student_data,
            ml_prediction=ml_prediction,
            subject_analysis=subject_analysis
        )
        return jsonify(plan_result), 200

    except Exception as e:
        return jsonify({
            "error": "Study Plan Error",
            "message": "Unable to generate the study plan right now. Please try again."
        }), 500

@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_frontend(path):
    """Serves the compiled React frontend for SPA routing."""
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, "index.html")

@app.errorhandler(404)
def not_found(e):
    """Fallback handler for SPA client-side routing."""
    if request.path.startswith("/api/"):
        return jsonify({"error": "API endpoint not found"}), 404
    return send_from_directory(app.static_folder, "index.html")

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5001))
    print(f"Starting AI Student Performance Backend on port {port}...")
    app.run(host="0.0.0.0", port=port, debug=True)
