# AI-Driven Student Performance & Personalized Learning System

> **A Full-Stack Academic Analytics and Adaptive Study Planning Platform**  
> Developed as a B.Tech Generative AI Capstone Project and Technical Interview Portfolio System.

[![Tech Stack](https://img.shields.io/badge/Stack-Python_%7C_Flask_%7C_Scikit--Learn_%7C_React_%7C_Vite_%7C_Tailwind-0f766e)](https://github.com/)
[![Model](https://img.shields.io/badge/ML_Model-Random_Forest_Classifier_(83.0%25_Acc)-0284c7)](https://github.com/)
[![GenAI](https://img.shields.io/badge/Generative_AI-Google_Gemini_1.5_Flash_%2B_Demo_Fallback-4f46e5)](https://github.com/)

---

## 1. Project Overview

The **AI-Driven Student Performance & Personalized Learning System** bridges classical Machine Learning with modern Generative AI to identify early academic difficulty and deliver structured, adaptive remediation. 

Rather than relying on generic rule engines or asking an LLM to guess numerical outcomes, this platform uses a **Random Forest Classifier** trained on continuous academic indicators (attendance, internal exams, assignments, quizzes, study hours) to classify student trajectory into **High Performance**, **Average Performance**, or **At Risk**. The verified classification and subject-level weak areas are then passed as grounded context to **Google Gemini 1.5 Flash**, which synthesizes personalized pedagogical feedback and an actionable, day-by-day 7-day study plan.

### Core End-to-End Workflow:
```
Student Data Input (Form / Database)
           │
           ▼
Data Normalization & Feature Vector Extraction
           │
           ▼
Machine Learning Inference (Random Forest Classifier)
           ├──► Performance Category ('High Performance', 'Average', 'At Risk')
           ├──► Softmax / Voting Class Probabilities (Confidence %)
           └──► Feature Contribution & Risk Factor Identification
           │
           ▼
Subject-Wise Coursework Analyzer
           └──► Strongest, Weakest & Critical Remediations (< 60%)
           │
           ▼
Generative AI Synthesis (Google Gemini API / Pedagogical Fallback Engine)
           ├──► Personalized Academic Advisor Feedback
           └──► 7-Day Structured Adaptive Revision Timetable
```

---

## 2. Key Features

- **Academic Command Dashboard**: Real-time KPI metric cards (Attendance %, Average Marks, Study Hours/week, Assignment Submissions), comparative Recharts bar chart, competency radar chart, and quick AI insights.
- **ML Performance & Explainability Module**:
  - Exact prediction probabilities (`High Performance`, `Average Performance`, `At Risk`).
  - Feature factor identification (top positive strengths vs. risk flags).
  - Authentic holdout evaluation metrics panel (Accuracy, Precision, Recall, F1-score, and 3x3 Confusion Matrix).
- **Subject-Level Diagnostic**:
  - Detailed tracking across 5 core engineering subjects (*Data Structures*, *DBMS*, *Artificial Intelligence*, *Computer Networks*, *Operating Systems*).
  - Benchmarking against a 60% remedial threshold line.
- **AI-Generated 7-Day Adaptive Study Plan**:
  - Interactive day-by-day timetable cards (Day 1 through Day 7).
  - Specific topics, actionable daily tasks with interactive checklist, hours allocated based on student study capacity, priority badges, and active learning strategies.
- **Interactive Student Simulation Modal**:
  - Modify academic features or load presets (*Anuj Sharma - Baseline*, *Simulate "At Risk" Student*, *Simulate "High Achiever"*) to observe immediate ML re-classification in real time.
- **Formal Academic Performance Report**:
  - Printable official student transcript with institutional styling, signature blocks, and `@media print` layout.
- **Intelligent Demo / Offline Fallback Engine**:
  - The application functions seamlessly without an active internet connection or without a Gemini API key configured.

---

## 3. Strict Architecture Rule: Separation of Concerns

One of the most critical software engineering and AI design choices in this project is the **absolute separation of Machine Learning and Generative AI responsibilities**:

| Domain | Module | Technical Responsibility | Why This Separation Matters |
| :--- | :--- | :--- | :--- |
| **Quantitative Inference** | **Random Forest Classifier** (`scikit-learn`) | • Risk classification (`High`, `Average`, `At Risk`)<br>• Confidence scoring & probability distribution<br>• Feature importance analysis | Deterministic, reproducible, audited on test data, zero hallucination risk on numerical grading. |
| **Qualitative Synthesis** | **Google Gemini 1.5 Flash** (`google-genai`) | • Empathetic pedagogical feedback<br>• 7-day adaptive timetable construction<br>• Study strategy recommendations | Exceptional natural language generation, contextual personalization, reasoning over schedule constraints. |

> **Crucial Rule:** The Generative AI model is **never** permitted to classify whether a student is "At Risk" or "High Performance". That decision is computed strictly by the scikit-learn ML model and passed to Gemini as immutable ground truth.

---

## 4. Tech Stack

- **Frontend**:
  - **React 18** with **Vite**: Ultra-fast build and reactive state management.
  - **Tailwind CSS**: Custom academic/productivity palette (deep navy text `#0f172a`, slate `#f8fafc`, teal accent `#0d9488`).
  - **Recharts**: Responsive SVG charts (BarChart, RadarChart, ReferenceLine).
  - **Lucide React**: Clean, lightweight iconography.
  - **Axios**: REST API integration with fallback resilience.
- **Backend**:
  - **Python 3.9+ & Flask 3.1**: REST API with CORS support.
  - **Scikit-Learn 1.6**: Random Forest training, evaluation, and inference.
  - **Pandas & NumPy**: Data processing and statistical synthesis.
  - **Joblib**: Model serialization and low-latency disk loading.
  - **Google Gemini API** (`google-genai` / REST): State-of-the-art LLM inference with prompt grounding.
  - **Python-Dotenv**: Safe environment variable management.

---

## 5. Machine Learning Pipeline & Real Evaluation Metrics

The classification model was trained using `backend/train_model.py` on a dataset of 500 engineering student records using an 80/20 stratified split (400 train, 100 holdout test).

### Model Hyperparameters:
- **Algorithm**: `RandomForestClassifier`
- **Estimators (`n_estimators`)**: 100 trees
- **Max Tree Depth (`max_depth`)**: 6 (prevents overfitting and ensures explainability)
- **Min Samples Split**: 4
- **Min Samples Leaf**: 2
- **Stratified Split**: Preserves class ratios across train/test sets

### Genuine Holdout Test Evaluation Results:
*These are actual calculated metrics from our test set, not exaggerated claims:*
- **Accuracy**: `83.00%`
- **Weighted Precision**: `82.99%`
- **Weighted Recall**: `83.00%`
- **Weighted F1-Score**: `82.89%`

### Confusion Matrix (Test Set: 100 Samples):
```
Actual \ Predicted       High Performance    Average Performance    At Risk
High Performance               26                    6                 0
Average Performance             5                   48                 2
At Risk                         0                    4                 9
```

### Gini Feature Importances:
```
1. Internal Marks         : 28.11%  (Strongest indicator of conceptual mastery)
2. Assignment Score       : 23.34%  (Reflects coursework consistency)
3. Previous Percentage    : 15.08%  (Historical academic baseline)
4. Quiz Score             : 14.52%  (Continuous retention signal)
5. Study Hours / Week     :  8.03%  (Self-study commitment)
6. Attendance             :  6.60%  (Class engagement threshold)
7. Completed Assignments  :  2.57%  (Submission completion rate)
8. Completed Quizzes      :  1.76%  (Continuous evaluation completion)
```

---

## 6. Generative AI Module & Prompt Grounding

The Generative AI module integrates **Google Gemini 1.5 Flash**. 

### Prompt Grounding Strategy
To eliminate hallucinations, the backend constructs a structured prompt injecting:
1. Student name & ID.
2. The ML model's prediction and exact confidence percentage.
3. Quantified metrics (attendance, assignment scores, quiz scores, weekly study hours).
4. Subject diagnostic (strongest subject, weakest subject, and subjects below 60%).

### Temperature & Generation Parameters:
- `temperature`: `0.3` (Low temperature ensures factual consistency and curriculum adherence).
- `topP`: `0.85`.
- `response_schema`: Instructs the model to output strict JSON for study plan generation, parsed directly into the frontend calendar.

### Offline & Demo Mode Resiliency:
If `GEMINI_API_KEY` is not configured in `.env`, or if internet access is interrupted, the backend's `gemini_service.py` automatically activates an **Intelligent Pedagogical Fallback Engine**. This engine uses a domain-calibrated rule synthesizer to generate customized, structured 7-day schedules and feedback based on the student's actual weak subjects and study hours, ensuring the application **never crashes or displays raw errors**.

---

## 7. Project Structure

```
Student Performance system/
├── run.sh                          # One-click startup script (Backend + Frontend)
├── README.md                       # Complete documentation & interview guide
├── backend/
│   ├── app.py                      # Flask REST API endpoints & CORS
│   ├── train_model.py              # Synthetic dataset generator & RF training pipeline
│   ├── requirements.txt            # Python dependencies
│   ├── .env.example                # Template for GEMINI_API_KEY and PORT
│   ├── .env                        # Active environment configuration
│   ├── data/
│   │   └── students.csv            # 500-sample student dataset
│   ├── model/
│   │   ├── performance_model.pkl   # Serialized Random Forest model
│   │   └── model_metadata.json     # Saved metrics, confusion matrix & feature importances
│   └── services/
│       ├── ml_service.py           # Model loading, inference & factor breakdown
│       └── gemini_service.py       # Gemini API client & intelligent demo fallback
└── frontend/
    ├── package.json                # React, Vite, Tailwind & Recharts dependencies
    ├── vite.config.js              # Vite server & API reverse-proxy setup
    ├── tailwind.config.js          # Academic UI palette configuration
    ├── postcss.config.js
    ├── index.html                  # HTML entry point
    └── src/
        ├── main.jsx                # React DOM mount
        ├── App.jsx                 # Routing, layout & global state
        ├── index.css               # Tailwind directives & print styling
        ├── data/
        │   └── defaultData.js      # Baseline student profile & fallbacks
        ├── services/
        │   └── api.js              # Axios service with client resilience
        ├── components/
        │   ├── Navbar.jsx          # Top navigation & system status
        │   ├── Sidebar.jsx         # Academic portal sidebar
        │   ├── MetricCard.jsx      # Reusable KPI stats cards
        │   ├── StatusBadge.jsx     # Color-coded performance pills
        │   └── StudentFormModal.jsx# Interactive form with live demo presets
        └── pages/
            ├── Dashboard.jsx       # Academic summary & charts
            ├── Performance.jsx     # ML probability bars, explainability & metrics
            ├── Subjects.jsx        # Subject cards & benchmark chart
            ├── AIStudyPlan.jsx     # 7-day interactive timetable & advisor feedback
            ├── Reports.jsx         # Printable official academic report
            └── Login.jsx           # Portal welcome & quick demo entry
```

---

## 8. Installation & Setup

### Prerequisites
- **Python 3.9+**
- **Node.js v18+** & **npm**

### Step 1: Backend Setup
```bash
cd backend

# 1. Create and activate a Python virtual environment
python3 -m venv venv
source venv/bin/activate    # On Windows: venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. (Optional) Set up Gemini API key in .env
cp .env.example .env
# Edit .env and paste your GEMINI_API_KEY if desired:
# GEMINI_API_KEY=your_gemini_api_key_here
# If omitted, the application runs in Demo Fallback Mode.

# 4. Train the Random Forest model and generate the dataset
python train_model.py

# 5. Start the Flask server
python app.py
```
*Backend runs on `http://localhost:5001`.*

### Step 2: Frontend Setup
Open a new terminal:
```bash
cd frontend

# 1. Install dependencies
npm install

# 2. Start Vite development server
npm run dev
```
*Frontend runs on `http://localhost:3000`.*

### Shortcut: One-Click Launch
From the project root, run:
```bash
./run.sh
```

---

## 9. API Reference

### 1. Health & Configuration Status
`GET /api/health`
```json
{
  "status": "online",
  "model_loaded": true,
  "gemini_api_configured": false,
  "mode": "Demo Fallback Mode"
}
```

### 2. Model Metrics & Evaluation
`GET /api/model-metrics`
Returns model accuracy, precision, recall, F1, confusion matrix, and feature importances.

### 3. Machine Learning Prediction
`POST /api/predict`
```bash
curl -X POST http://localhost:5001/api/predict \
  -H "Content-Type: application/json" \
  -d '{
    "student_name": "Anuj Sharma",
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
      "Data Structures": {"marks": 68, "attendance": 82},
      "DBMS": {"marks": 76, "attendance": 85},
      "Artificial Intelligence": {"marks": 84, "attendance": 88},
      "Computer Networks": {"marks": 56, "attendance": 78},
      "Operating Systems": {"marks": 72, "attendance": 84}
    }
  }'
```

### 4. Generate Personalized Feedback
`POST /api/generate-feedback`

### 5. Generate 7-Day Study Plan
`POST /api/generate-study-plan`

---

## 10. Architectural Rationale (Why These Decisions?)

### Why Random Forest?
1. **Explainability**: Decision trees allow inspection of feature importances (Gini impurity decrease), making predictions defensible in academic settings.
2. **Robustness against Overfitting**: By ensembling 100 decorrelated trees with bootstrap sampling, Random Forest dampens variance common in small-to-medium educational datasets.
3. **No Mandatory Feature Scaling**: Decision splits are invariant to monotonic feature scaling, handling mixed units (percentages, hour counts, quiz counts) naturally.

### Why Generative AI?
1. **Contextual Natural Language**: While ML outputs numbers and categories, GenAI crafts empathetic, student-friendly explanations.
2. **Adaptive Timetable Construction**: Gemini can take arbitrary study hour budgets (e.g., 14.5 hours) and construct realistic, day-by-day revisions balanced across weak and strong subjects.

### Why Separate ML and GenAI?
1. **Determinism vs. Creativity**: High-stakes decisions (such as academic risk classification) must be deterministic and verifiable. LLMs can suffer from prompt injection, temperature drift, and hallucinations.
2. **Cost & Latency Efficiency**: ML classification takes ~5ms locally on CPU without API tokens. GenAI is called only for the downstream qualitative task.

---

## 11. How I Explain This Project in an Interview

*(A natural, 60–90 second spoken elevator pitch for your technical interview)*

> "In this project, I built an end-to-end academic analytics and personalized learning platform called **EduAnalytics AI**. 
> 
> The core problem it addresses is that traditional university portals are passive—they show test scores only after students have already fallen behind, and generic LLM chatbots lack grounded context.
> 
> My architecture strictly separates quantitative inference from qualitative synthesis. On the backend, I built and trained a **Random Forest Classifier** in Scikit-Learn using 8 continuous features including attendance, continuous quiz marks, and internal exams. The model achieves **83% accuracy** and classifies students into *High Performance*, *Average Performance*, or *At Risk*, while providing the exact probability distribution and key risk factors.
> 
> Then, instead of having an LLM guess student standing, I feed the verified ML prediction, confidence score, and subject-level weak areas into **Google Gemini 1.5 Flash**. Gemini generates grounded, empathetic feedback and a structured 7-day adaptive study plan that allocates realistic study hours prioritizing the student's weakest subjects.
> 
> The frontend is built in **React, Vite, and Tailwind CSS**, featuring an academic productivity dashboard with Recharts, model explainability panels with real confusion matrices, and printable academic transcripts. I also engineered an intelligent local fallback engine so the application works seamlessly even offline without an API key."

---

## 12. 15 Technical Interview Questions & Answers

### 1. What core problem does your project solve?
**Answer:** It solves late academic intervention and impersonal student feedback. Traditional learning management systems record marks but fail to predict risk early enough for remedial action. Generic chatbots lack access to the student's true academic standing. Our system bridges this gap by combining classical predictive ML with contextual GenAI planning.

### 2. Why did you choose Random Forest instead of Logistic Regression or a Neural Network?
**Answer:** 
- Compared to Logistic Regression, Random Forest captures non-linear interactions between features (e.g., high attendance combined with low internal marks signaling memorization issues) without manual polynomial feature engineering.
- Compared to Neural Networks, Random Forest is less prone to overfitting on tabular datasets of 500 records, requires no GPU infrastructure, trains in milliseconds, and provides direct Gini feature importances for explainability.

### 3. What features did you use to train the model?
**Answer:** Eight continuous and discrete features:
1. `attendance` (percentage)
2. `previous_percentage` (prior semester baseline)
3. `assignment_score` (coursework average)
4. `quiz_score` (continuous retention)
5. `internal_marks` (mid-term exam score)
6. `study_hours` (weekly self-study capacity)
7. `completed_assignments` (out of 10)
8. `completed_quizzes` (out of 5)

### 4. How did you prepare and validate the dataset?
**Answer:** I created a synthetic dataset generator using NumPy and Pandas modeling realistic engineering student variance. Latent student aptitudes were drawn from a beta distribution to model realistic academic skew, with added Gaussian noise to prevent artificial perfection. An 80/20 stratified train/test split was applied to guarantee equal representation of all three classes in the test set.

### 5. How did you evaluate the model? Did you only look at accuracy?
**Answer:** No, accuracy alone can be misleading in imbalanced datasets. I calculated Weighted Precision (82.99%), Weighted Recall (83.00%), and Weighted F1-Score (82.89%), and generated a full 3x3 Confusion Matrix. The confusion matrix verified zero confusion between 'High Performance' and 'At Risk' students, proving high reliability for early intervention.

### 6. What is the fundamental difference between ML and Generative AI in your project?
**Answer:** Machine Learning handles **structured numerical classification**—it answers *"Where does this student stand quantitatively?"* with a deterministic probability. Generative AI handles **unstructured synthesis**—it answers *"How can this student improve their study habits?"* by translating the numbers into natural language guidance and daily study schedules.

### 7. Why didn't you use Gemini to directly predict whether a student is 'At Risk'?
**Answer:** LLMs are probabilistic language models, not deterministic tabular classifiers. Prompting an LLM with numbers often results in inconsistent answers depending on phrasing or temperature. By using Scikit-Learn, the classification is mathematically verified, auditable, reproducible, and costs zero API tokens.

### 8. How does the study plan generation work?
**Answer:** When the user requests a study plan, the backend aggregates the student's available weekly study hours, their ML prediction, and their weakest subjects (e.g., marks < 60%). It prompts Gemini 1.5 Flash with a strict schema to distribute those hours across 7 days, prioritizing remedial foundational concepts in Days 1-2, practice in Days 3-4, and mock tests in Days 6-7.

### 9. How do you prevent and handle LLM hallucinations?
**Answer:** 
1. **Strict Prompt Grounding**: Every numerical fact (scores, hours, weak subjects) is injected directly into the prompt.
2. **Low Temperature**: Set to `0.3` to minimize divergent tokens.
3. **Structured Schema**: Enforcing JSON schema parsing.
4. **Fallback Validation**: If parsing fails or output contains unexpected fields, the system safely falls back to verified templates.

### 10. How is the Gemini API key secured?
**Answer:** The key is never exposed to the frontend. It is stored exclusively on the backend in an environment file (`.env`), loaded via `python-dotenv`, and accessed only through server-side REST requests. Git ignores `.env` via `.gitignore`.

### 11. What happens if the Gemini API is offline, rate-limited, or the key is invalid?
**Answer:** The backend implements an **Intelligent Pedagogical Fallback Engine**. If the API call times out or throws an error, the system catches the exception and dynamically synthesizes personalized feedback and a structured 7-day schedule locally using rule-based educational heuristics. The UI marks this cleanly as "Demo Fallback Mode" without breaking.

### 12. How does the system handle subject-wise performance?
**Answer:** The system tracks 5 core subjects: Data Structures, DBMS, AI, Computer Networks, and Operating Systems. It calculates individual mastery, flags any subject scoring below 60% as "Critical Attention", and passes these specific names to the GenAI prompt to receive priority time slots in the timetable.

### 13. What were the biggest technical challenges you faced during implementation?
**Answer:** 
1. Structuring the GenAI output into reliable, parseable JSON for a responsive 7-day calendar UI.
2. Designing a realistic synthetic data generator that preserved authentic correlations without making the classification trivially separable.
3. Ensuring seamless offline resilience so the application remains 100% demonstrable even in interview rooms without internet access.

### 14. What was your individual contribution to the project?
**Answer:** I designed the full-stack architecture, built the ML data generation and training pipeline in Scikit-Learn, engineered the Flask REST API with graceful Gemini fallback mechanisms, and developed the responsive React/Tailwind frontend including custom Recharts visualizations and printable academic reports.

### 15. How would you scale this system if the dataset had 1,000,000 students?
**Answer:**
- **Data & Model**: Store student records in PostgreSQL or Snowflake. Train the model using distributed frameworks like LightGBM or XGBoost on Apache Spark.
- **Serving**: Serialize the model into ONNX format for microsecond inference using an ONNX Runtime microservice.
- **GenAI Caching**: Cache study plan templates in Redis keyed by `(risk_category, weakest_subject, study_hour_bucket)` to minimize external API costs.
- **Async Processing**: Use Celery / Redis Queue for background study plan generation with WebSockets for real-time delivery.

---

## 13. Resume Description

Add these bullet points to your resume:

- **AI-Driven Student Performance & Personalized Learning System** *(Python, Flask, Scikit-Learn, React, Vite, Google Gemini API, Tailwind CSS)*
  - Engineered an end-to-end academic analytics platform that classifies student risk trajectory using a Random Forest Classifier trained on 8 academic features, achieving **83.0% accuracy** and **82.9% F1-score**.
  - Architected a strict separation of concerns between predictive ML (quantitative risk modeling) and Generative AI (qualitative synthesis), integrating **Google Gemini 1.5 Flash** to generate adaptive 7-day study timetables.
  - Implemented an intelligent domain-rule fallback engine for offline execution and developed a responsive React/Tailwind dashboard featuring Recharts visualizers, model explainability panels, and printable transcripts.

---

## 14. License

This project is licensed under the MIT License — developed for academic coursework and technical demonstration purposes.
