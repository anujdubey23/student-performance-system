"""
ML Service: Handles model loading, real-time prediction, probability computation,
and subject performance analysis.
"""

import os
import json
import joblib
import numpy as np
import pandas as pd

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_DIR = os.path.join(BASE_DIR, "model")
MODEL_PATH = os.path.join(MODEL_DIR, "performance_model.pkl")
METADATA_PATH = os.path.join(MODEL_DIR, "model_metadata.json")

FEATURE_COLUMNS = [
    "attendance",
    "previous_percentage",
    "assignment_score",
    "quiz_score",
    "internal_marks",
    "study_hours",
    "completed_assignments",
    "completed_quizzes"
]

class MLService:
    def __init__(self):
        self.model = None
        self.metadata = None
        self.load_model()

    def load_model(self):
        """Loads trained Random Forest model and evaluation metadata."""
        try:
            if os.path.exists(MODEL_PATH) and os.path.exists(METADATA_PATH):
                self.model = joblib.load(MODEL_PATH)
                with open(METADATA_PATH, "r") as f:
                    self.metadata = json.load(f)
                print(f"[MLService] Loaded model successfully from {MODEL_PATH}")
            else:
                print(f"[MLService] Model or metadata file not found. Please run train_model.py first.")
        except Exception as e:
            print(f"[MLService] Error loading model: {str(e)}")
            self.model = None

    def is_ready(self):
        return self.model is not None and self.metadata is not None

    def get_metrics(self):
        """Returns model evaluation metrics (Accuracy, Precision, Recall, F1, Confusion Matrix)."""
        if self.metadata:
            return self.metadata
        return {
            "model_name": "Random Forest Classifier",
            "status": "not_trained",
            "message": "Run train_model.py to generate metrics."
        }

    def predict(self, student_data):
        """
        Performs ML prediction for a student.
        Args:
            student_data: dict containing feature values
        Returns:
            dict containing predicted_category, confidence, probabilities, and factors
        """
        if not self.is_ready():
            self.load_model()
            if not self.is_ready():
                raise RuntimeError("Machine Learning model is not available. Please train the model first.")

        # Extract and validate features
        feature_values = []
        for col in FEATURE_COLUMNS:
            val = student_data.get(col)
            if val is None:
                raise ValueError(f"Missing required feature: '{col}'")
            try:
                feature_values.append(float(val))
            except (ValueError, TypeError):
                raise ValueError(f"Feature '{col}' must be a valid number, got: {val}")

        # Input array for scikit-learn
        X_input = pd.DataFrame([feature_values], columns=FEATURE_COLUMNS)

        # Prediction and probabilities
        predicted_class = self.model.predict(X_input)[0]
        probabilities = self.model.predict_proba(X_input)[0]
        class_names = list(self.model.classes_)

        prob_dict = {
            cls_name: round(float(prob), 4)
            for cls_name, prob in zip(class_names, probabilities)
        }

        # Confidence is the probability of the predicted class
        confidence = prob_dict.get(predicted_class, 0.0)

        # Factor analysis based on actual data
        strengths, risk_factors = self._analyze_factors(student_data)

        return {
            "predicted_category": predicted_class,
            "confidence": round(confidence * 100, 1),
            "confidence_decimal": confidence,
            "probabilities": prob_dict,
            "strengths": strengths,
            "risk_factors": risk_factors
        }

    def _analyze_factors(self, data):
        """Identifies strengths and potential risk factors from student features."""
        strengths = []
        risk_factors = []

        attendance = float(data.get("attendance", 0))
        assignment_score = float(data.get("assignment_score", 0))
        quiz_score = float(data.get("quiz_score", 0))
        internal_marks = float(data.get("internal_marks", 0))
        study_hours = float(data.get("study_hours", 0))
        completed_assignments = int(data.get("completed_assignments", 0))
        previous_percentage = float(data.get("previous_percentage", 0))

        # Attendance factor
        if attendance >= 85:
            strengths.append(f"Excellent class attendance record ({attendance}%)")
        elif attendance < 75:
            risk_factors.append(f"Attendance ({attendance}%) is below recommended university threshold of 75%")

        # Internal Marks factor
        if internal_marks >= 75:
            strengths.append(f"Solid internal examination score ({internal_marks}%)")
        elif internal_marks < 60:
            risk_factors.append(f"Internal assessment score ({internal_marks}%) indicates conceptual gaps")

        # Study hours factor
        if study_hours >= 18:
            strengths.append(f"Dedicated weekly self-study routine ({study_hours} hrs/week)")
        elif study_hours < 10:
            risk_factors.append(f"Low self-study commitment ({study_hours} hrs/week; minimum 15 hrs recommended)")

        # Assignments factor
        if completed_assignments >= 9 and assignment_score >= 80:
            strengths.append(f"Consistent assignment submissions ({completed_assignments}/10 completed, {assignment_score}% avg)")
        elif completed_assignments <= 6 or assignment_score < 60:
            risk_factors.append(f"Incomplete assignment submission record ({completed_assignments}/10 completed, {assignment_score}% avg)")

        # Quizzes
        if quiz_score >= 80:
            strengths.append(f"High continuous evaluation quiz scores ({quiz_score}%)")
        elif quiz_score < 55:
            risk_factors.append(f"Frequent quiz shortfalls ({quiz_score}% avg)")

        # Previous semester
        if previous_percentage >= 80:
            strengths.append(f"Strong prior academic foundation ({previous_percentage}%)")
        elif previous_percentage < 60:
            risk_factors.append(f"Historical academic difficulty ({previous_percentage}% previous sem)")

        # Default fallbacks if empty
        if not strengths:
            strengths.append("Standard academic engagement observed")
        if not risk_factors:
            risk_factors.append("No immediate critical risk factors identified")

        return strengths, risk_factors

    def analyze_subjects(self, subjects_dict):
        """
        Analyzes subject-wise scores and identifies key focus areas.
        Args:
            subjects_dict: dict of {subject_name: marks} or {subject_name: {"marks": X, "attendance": Y}}
        Returns:
            dict containing stats, strongest, weakest, attention needed
        """
        if not subjects_dict:
            return {
                "average_marks": 0,
                "strongest_subject": None,
                "weakest_subject": None,
                "attention_needed": [],
                "subjects": {}
            }

        parsed_subjects = {}
        for name, val in subjects_dict.items():
            if isinstance(val, dict):
                marks = float(val.get("marks", 0))
                att = float(val.get("attendance", 80))
            else:
                marks = float(val)
                att = 80.0
            
            status = "Good"
            if marks >= 75:
                status = "Strong"
            elif marks < 60:
                status = "Critical Attention"
            else:
                status = "Average"

            parsed_subjects[name] = {
                "name": name,
                "marks": marks,
                "attendance": att,
                "status": status,
                "improvement_required": marks < 60 or att < 75
            }

        marks_list = [(name, data["marks"]) for name, data in parsed_subjects.items()]
        marks_list.sort(key=lambda x: x[1])

        weakest = marks_list[0] if marks_list else (None, 0)
        strongest = marks_list[-1] if marks_list else (None, 0)
        
        avg_marks = round(sum(m[1] for m in marks_list) / len(marks_list), 1) if marks_list else 0
        attention_needed = [name for name, m in marks_list if m < 60]

        return {
            "average_marks": avg_marks,
            "strongest_subject": {
                "name": strongest[0],
                "marks": strongest[1]
            },
            "weakest_subject": {
                "name": weakest[0],
                "marks": weakest[1]
            },
            "attention_needed": attention_needed,
            "subjects_list": list(parsed_subjects.values())
        }

# Global singleton instance
ml_service = MLService()
