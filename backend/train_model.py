#!/usr/bin/env python3
"""
AI-Driven Student Performance & Personalized Learning System
Machine Learning Training Pipeline
Model: Random Forest Classifier
Target: Performance Category ('High Performance', 'Average Performance', 'At Risk')
"""

import os
import json
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    precision_recall_fscore_support,
    confusion_matrix,
    classification_report
)
import joblib

# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
MODEL_DIR = os.path.join(BASE_DIR, "model")
CSV_PATH = os.path.join(DATA_DIR, "students.csv")
MODEL_PATH = os.path.join(MODEL_DIR, "performance_model.pkl")
METADATA_PATH = os.path.join(MODEL_DIR, "model_metadata.json")

# Ensure target directories exist
os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(MODEL_DIR, exist_ok=True)

def generate_synthetic_dataset(num_records=500, random_seed=42):
    """
    Generates realistic, explainable synthetic academic data for 500 engineering students.
    Features:
      - attendance: 50.0 to 98.0 (%)
      - previous_percentage: 45.0 to 96.0 (%)
      - assignment_score: 40.0 to 100.0 (%)
      - quiz_score: 35.0 to 100.0 (%)
      - internal_marks: 35.0 to 98.0 (%)
      - study_hours: 2.0 to 35.0 (hours/week)
      - completed_assignments: 2 to 10 (count out of 10)
      - completed_quizzes: 1 to 5 (count out of 5)
    """
    np.random.seed(random_seed)
    
    # 1. Base academic aptitudes (latent student capability variable)
    capability = np.random.beta(a=3.5, b=2.5, size=num_records) # normalized 0 to 1
    
    # Attendance: correlated with capability with realistic student variance
    attendance = np.clip(capability * 45 + 50 + np.random.normal(0, 6, num_records), 45, 99).round(1)
    
    # Study hours per week: between 3 and 35 hours
    study_hours = np.clip(capability * 20 + 5 + np.random.normal(0, 4, num_records), 2, 35).round(1)
    
    # Completed assignments (out of 10) and quizzes (out of 5)
    completed_assignments = np.clip(np.round(capability * 6 + 4 + np.random.normal(0, 1, num_records)), 1, 10).astype(int)
    completed_quizzes = np.clip(np.round(capability * 3 + 2 + np.random.normal(0, 0.8, num_records)), 1, 5).astype(int)
    
    # Assignment score (0-100)
    assignment_score = np.clip(
        (capability * 45 + 50) * (completed_assignments / 10.0) ** 0.3 + np.random.normal(0, 5, num_records),
        35, 100
    ).round(1)
    
    # Quiz score (0-100)
    quiz_score = np.clip(
        (capability * 50 + 45) * (completed_quizzes / 5.0) ** 0.3 + np.random.normal(0, 6, num_records),
        30, 100
    ).round(1)
    
    # Previous semester percentage (0-100)
    previous_percentage = np.clip(capability * 45 + 50 + np.random.normal(0, 5, num_records), 40, 98).round(1)
    
    # Internal marks (0-100)
    internal_marks = np.clip(
        0.35 * assignment_score + 0.35 * quiz_score + 0.30 * (capability * 50 + 45) + np.random.normal(0, 4, num_records),
        30, 100
    ).round(1)
    
    # Target ground-truth classification logic with slight stochastic noise
    composite_index = (
        0.25 * internal_marks +
        0.20 * assignment_score +
        0.15 * quiz_score +
        0.15 * attendance +
        0.15 * previous_percentage +
        0.10 * np.minimum(study_hours * 3.5, 100.0) +
        np.random.normal(0, 3.5, num_records)
    )
    
    categories = []
    for score in composite_index:
        if score >= 75.0:
            categories.append("High Performance")
        elif score >= 58.0:
            categories.append("Average Performance")
        else:
            categories.append("At Risk")
            
    # Student IDs
    student_ids = [f"STU{1000 + i}" for i in range(num_records)]
    
    df = pd.DataFrame({
        "student_id": student_ids,
        "attendance": attendance,
        "previous_percentage": previous_percentage,
        "assignment_score": assignment_score,
        "quiz_score": quiz_score,
        "internal_marks": internal_marks,
        "study_hours": study_hours,
        "completed_assignments": completed_assignments,
        "completed_quizzes": completed_quizzes,
        "performance_category": categories
    })
    
    return df

def train_and_evaluate():
    print("=" * 60)
    print("AI-Driven Student Performance System: Model Training")
    print("=" * 60)
    
    # 1. Generate & Save Dataset
    print(f"Generating 500 realistic student academic records...")
    df = generate_synthetic_dataset(num_records=500, random_seed=42)
    df.to_csv(CSV_PATH, index=False)
    print(f"Dataset successfully saved to: {CSV_PATH}")
    print(f"Class distribution:\n{df['performance_category'].value_counts()}\n")
    
    # 2. Prepare Features & Labels
    feature_columns = [
        "attendance",
        "previous_percentage",
        "assignment_score",
        "quiz_score",
        "internal_marks",
        "study_hours",
        "completed_assignments",
        "completed_quizzes"
    ]
    target_column = "performance_category"
    
    X = df[feature_columns]
    y = df[target_column]
    
    classes = ["High Performance", "Average Performance", "At Risk"]
    
    # 3. Train/Test Split (80% Train, 20% Test, Stratified)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )
    print(f"Training set: {len(X_train)} samples | Test set: {len(X_test)} samples")
    
    # 4. Train Random Forest Classifier
    rf_classifier = RandomForestClassifier(
        n_estimators=100,
        max_depth=6,
        min_samples_split=4,
        min_samples_leaf=2,
        random_state=42
    )
    rf_classifier.fit(X_train, y_train)
    
    # 5. Evaluate on Test Set
    y_pred = rf_classifier.predict(X_test)
    y_proba = rf_classifier.predict_proba(X_test)
    
    accuracy = float(accuracy_score(y_test, y_pred))
    precision, recall, f1, _ = precision_recall_fscore_support(
        y_test, y_pred, average="weighted", zero_division=0
    )
    
    cm = confusion_matrix(y_test, y_pred, labels=classes).tolist()
    class_report = classification_report(y_test, y_pred, output_dict=True, zero_division=0)
    
    # Feature importances
    feature_importances = {
        feat: float(imp)
        for feat, imp in sorted(
            zip(feature_columns, rf_classifier.feature_importances_),
            key=lambda x: x[1],
            reverse=True
        )
    }
    
    print("-" * 60)
    print("Model Evaluation Metrics:")
    print(f"Accuracy:  {accuracy * 100:.2f}%")
    print(f"Precision: {precision * 100:.2f}%")
    print(f"Recall:    {recall * 100:.2f}%")
    print(f"F1-Score:  {f1 * 100:.2f}%")
    print("-" * 60)
    print("Confusion Matrix (Classes: High Performance, Average Performance, At Risk):")
    for row in cm:
        print(f"  {row}")
    print("-" * 60)
    print("Feature Importances:")
    for feat, imp in feature_importances.items():
        print(f"  {feat:24s}: {imp * 100:.2f}%")
    print("-" * 60)
    
    # 6. Save Model Artifact
    joblib.dump(rf_classifier, MODEL_PATH)
    print(f"Model saved to: {MODEL_PATH}")
    
    # 7. Save Metrics Metadata for Frontend / API
    metadata = {
        "model_name": "Random Forest Classifier",
        "n_estimators": 100,
        "features": feature_columns,
        "target_classes": list(rf_classifier.classes_),
        "metrics": {
            "accuracy": round(accuracy, 4),
            "precision": round(float(precision), 4),
            "recall": round(float(recall), 4),
            "f1_score": round(float(f1), 4),
            "confusion_matrix": {
                "labels": classes,
                "matrix": cm
            },
            "classification_report": class_report
        },
        "feature_importances": feature_importances,
        "dataset_summary": {
            "total_records": len(df),
            "train_records": len(X_train),
            "test_records": len(X_test),
            "class_distribution": df['performance_category'].value_counts().to_dict()
        }
    }
    
    with open(METADATA_PATH, "w") as f:
        json.dump(metadata, f, indent=2)
    print(f"Metadata saved to: {METADATA_PATH}")
    print("Model training complete.\n")

if __name__ == "__main__":
    train_and_evaluate()
