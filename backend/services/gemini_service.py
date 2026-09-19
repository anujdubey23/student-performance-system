"""
Gemini Service: Handles interaction with Google Gemini API for personalized feedback
and structured 7-day study plans, with an intelligent offline/demo fallback engine.
"""

import os
import json
import re
import requests
from dotenv import load_dotenv

load_dotenv()

class GeminiService:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY", "").strip()
        # Clean dummy strings
        if self.api_key in ["your_api_key_here", "your_gemini_api_key", ""]:
            self.api_key = None

    def is_api_configured(self):
        return bool(self.api_key)

    def generate_feedback(self, student_name, student_data, ml_prediction, subject_analysis):
        """
        Generates personalized pedagogical feedback.
        Uses Gemini API if available, else utilizes the rule-based pedagogical fallback engine.
        """
        if self.is_api_configured():
            try:
                return self._call_gemini_feedback(student_name, student_data, ml_prediction, subject_analysis)
            except Exception as e:
                print(f"[GeminiService] Live API call failed ({str(e)}). Utilizing intelligent demo fallback.")
                return self._generate_fallback_feedback(student_name, student_data, ml_prediction, subject_analysis)
        else:
            return self._generate_fallback_feedback(student_name, student_data, ml_prediction, subject_analysis)

    def generate_study_plan(self, student_name, student_data, ml_prediction, subject_analysis):
        """
        Generates a tailored 7-day study plan based on weak subjects, study hours, and ML classification.
        Uses Gemini API if available, else utilizes the rule-based pedagogical fallback engine.
        """
        if self.is_api_configured():
            try:
                return self._call_gemini_study_plan(student_name, student_data, ml_prediction, subject_analysis)
            except Exception as e:
                print(f"[GeminiService] Live API call failed ({str(e)}). Utilizing intelligent demo fallback.")
                return self._generate_fallback_study_plan(student_name, student_data, ml_prediction, subject_analysis)
        else:
            return self._generate_fallback_study_plan(student_name, student_data, ml_prediction, subject_analysis)

    # -------------------------------------------------------------------------
    # Live Gemini API Integrations
    # -------------------------------------------------------------------------
    def _call_gemini_api(self, prompt, system_instruction=""):
        """Direct REST invocation to Gemini 1.5 Flash / 2.5 Flash endpoint."""
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={self.api_key}"
        
        payload = {
            "contents": [{
                "parts": [{"text": prompt}]
            }],
            "generationConfig": {
                "temperature": 0.3,
                "topP": 0.85,
                "maxOutputTokens": 2048
            }
        }
        if system_instruction:
            payload["systemInstruction"] = {
                "parts": [{"text": system_instruction}]
            }

        response = requests.post(url, json=payload, timeout=12)
        response.raise_for_status()
        data = response.json()
        
        candidates = data.get("candidates", [])
        if not candidates:
            raise RuntimeError("Gemini API returned no candidates.")
        
        text = candidates[0]["content"]["parts"][0]["text"]
        return text

    def _call_gemini_feedback(self, student_name, student_data, ml_prediction, subject_analysis):
        system_instruction = (
            "You are an empathetic, encouraging university academic advisor and learning strategist. "
            "Your task is to analyze student academic performance metrics and ML classification results, "
            "providing constructive, personalized, and actionable feedback. Do NOT classify the student yourself; "
            "the Random Forest ML model has already determined the performance category."
        )

        prompt = f"""
Student Name: {student_name}
ML Performance Classification: {ml_prediction.get('predicted_category')} ({ml_prediction.get('confidence')}% confidence)
Attendance: {student_data.get('attendance')}%
Previous Semester: {student_data.get('previous_percentage')}%
Assignment Average: {student_data.get('assignment_score')}% ({student_data.get('completed_assignments')}/10 submitted)
Quiz Average: {student_data.get('quiz_score')}% ({student_data.get('completed_quizzes')}/5 submitted)
Internal Exam Marks: {student_data.get('internal_marks')}%
Weekly Study Hours: {student_data.get('study_hours')} hours/week

Subject Highlights:
Strongest Subject: {subject_analysis.get('strongest_subject', {}).get('name')} ({subject_analysis.get('strongest_subject', {}).get('marks')} marks)
Weakest Subject: {subject_analysis.get('weakest_subject', {}).get('name')} ({subject_analysis.get('weakest_subject', {}).get('marks')} marks)
Subjects Requiring Immediate Attention: {', '.join(subject_analysis.get('attention_needed', [])) or 'None'}

Please generate a concise, professional academic feedback report formatted with markdown.
Include:
1. Executive Assessment (2-3 sentences acknowledging the student's status and ML classification)
2. Commendable Strengths (2 bullet points)
3. Priority Improvement Areas (2 bullet points)
4. Strategic Next Step (1 actionable advice sentence)
"""
        raw_text = self._call_gemini_api(prompt, system_instruction)
        return {
            "feedback": raw_text,
            "is_demo_mode": False,
            "source": "Google Gemini 1.5 Flash (Live API)"
        }

    def _call_gemini_study_plan(self, student_name, student_data, ml_prediction, subject_analysis):
        system_instruction = (
            "You are a specialized curriculum planner. Create a realistic, highly structured 7-day study plan. "
            "Format the response strictly as valid JSON matching this schema: "
            "{\"summary\": \"...\", \"daily_schedule\": [{\"day\": 1, \"title\": \"...\", \"subject\": \"...\", \"topic\": \"...\", \"tasks\": [\"...\", \"...\"], \"study_hours\": 2.5, \"priority\": \"High\"}], \"tips\": [\"...\", \"...\"]}. "
            "Return ONLY raw JSON, without markdown code fences or conversational text."
        )

        prompt = f"""
Student Name: {student_name}
Classification: {ml_prediction.get('predicted_category')}
Weekly Study Hours Available: {student_data.get('study_hours')} hours total (distribute realistically across 7 days)
Weakest Subject: {subject_analysis.get('weakest_subject', {}).get('name')}
Attention Needed Subjects: {', '.join(subject_analysis.get('attention_needed', [])) or 'None'}
Strongest Subject: {subject_analysis.get('strongest_subject', {}).get('name')}

Generate a rigorous 7-day adaptive timetable in JSON format prioritizing the weakest subjects while maintaining strengths.
"""
        raw_text = self._call_gemini_api(prompt, system_instruction)
        # Parse JSON
        cleaned = re.sub(r"^```json\s*", "", raw_text.strip())
        cleaned = re.sub(r"\s*```$", "", cleaned)
        parsed = json.loads(cleaned)
        parsed["is_demo_mode"] = False
        parsed["source"] = "Google Gemini 1.5 Flash (Live API)"
        return parsed

    # -------------------------------------------------------------------------
    # Pedagogical Fallback / Demo Engine (Guarantees seamless offline execution)
    # -------------------------------------------------------------------------
    def _generate_fallback_feedback(self, student_name, student_data, ml_prediction, subject_analysis):
        category = ml_prediction.get("predicted_category", "Average Performance")
        confidence = ml_prediction.get("confidence", 85.0)
        attendance = float(student_data.get("attendance", 75))
        assignments = float(student_data.get("assignment_score", 70))
        quizzes = float(student_data.get("quiz_score", 70))
        study_hours = float(student_data.get("study_hours", 12))
        
        weakest = subject_analysis.get("weakest_subject", {}).get("name", "Core Subjects")
        strongest = subject_analysis.get("strongest_subject", {}).get("name", "Foundational Concepts")
        attention = subject_analysis.get("attention_needed", [])
        
        # Tone adapted to ML classification
        if category == "High Performance":
            tone_msg = f"You are demonstrating exceptional academic mastery with our Random Forest model predicting **High Performance** at **{confidence}% confidence**. Your consistent study habits ({study_hours} hrs/week) provide a strong competitive edge."
        elif category == "At Risk":
            tone_msg = f"Our Random Forest predictive model has identified critical warning indicators, placing your current semester trajectory in the **At Risk** category ({confidence}% model confidence). With proactive intervention on weak areas, this trajectory can be reversed."
        else:
            tone_msg = f"Our Random Forest classifier predicts **Average Performance** ({confidence}% confidence). You possess a reliable baseline, but targeted revisions in key subjects will elevate you into the top performance tier."

        # Feedback paragraphs
        feedback_text = (
            f"### Academic Advisory Summary for {student_name}\n\n"
            f"{tone_msg}\n\n"
            f"#### Key Observations\n"
            f"- **Attendance & Engagement:** Your lecture attendance stands at **{attendance}%**. "
            f"{'You are well above the mandatory university 75% attendance threshold.' if attendance >= 75 else 'Warning: Attendance is below 75%, risking examination eligibility.'}\n"
            f"- **Continuous Evaluation:** Assignment scores average **{assignments}%**, and continuous quiz marks are at **{quizzes}%**. "
            f"{'Consistent submissions reflect disciplined coursework.' if assignments >= 75 and quizzes >= 70 else 'Submissions indicate inconsistent completion of internal deliverables.'}\n"
            f"- **Subject Profile:** Strongest command demonstrated in **{strongest}**; primary remediation required in **{weakest}**"
            f"{' along with ' + ', '.join(attention) if attention else ''}.\n\n"
            f"#### Recommended Immediate Action\n"
            f"Dedicate the first 45 minutes of each study block to active recall and problem-solving in **{weakest}**, prioritizing pending lab reports and practice quiz questions."
        )

        return {
            "feedback": feedback_text,
            "is_demo_mode": True,
            "source": "Intelligent Pedagogical Fallback Engine (Demo Mode)"
        }

    def _generate_fallback_study_plan(self, student_name, student_data, ml_prediction, subject_analysis):
        total_hours = float(student_data.get("study_hours", 14))
        daily_hours = round(max(total_hours / 7.0, 1.5), 1)
        category = ml_prediction.get("predicted_category", "Average Performance")

        weakest = subject_analysis.get("weakest_subject", {}).get("name", "Data Structures")
        strongest = subject_analysis.get("strongest_subject", {}).get("name", "Computer Networks")
        attention = subject_analysis.get("attention_needed", [])
        second_weakest = attention[1] if len(attention) > 1 else ("DBMS" if weakest != "DBMS" else "Operating Systems")

        schedule = [
            {
                "day": 1,
                "title": f"Foundation & Concept Clarification: {weakest}",
                "subject": weakest,
                "topic": "Core Fundamentals & Theoretical Primitives",
                "tasks": [
                    f"Review lecture slides and textbook notes for Module 1 & 2 of {weakest}",
                    "Identify and write down top 5 recurring confusing concepts or definitions",
                    "Solve 3 introductory textbook exercises without referencing solutions"
                ],
                "study_hours": round(daily_hours * 1.2, 1),
                "priority": "High"
            },
            {
                "day": 2,
                "title": f"Targeted Problem Solving: {second_weakest}",
                "subject": second_weakest,
                "topic": "Key Algorithms / Syntax / Query Formulations",
                "tasks": [
                    f"Work through previous mid-term test questions in {second_weakest}",
                    "Construct handwritten cheat-sheet summary of essential equations or schema patterns",
                    "Complete 2 practical coding/analytical problem sets"
                ],
                "study_hours": daily_hours,
                "priority": "High"
            },
            {
                "day": 3,
                "title": "Continuous Assessment & Assignment Catch-up",
                "subject": "Assignments & Quizzes",
                "topic": "Deliverable Completion & Lab Reports",
                "tasks": [
                    "Complete any pending or upcoming assignment questions ahead of deadlines",
                    "Review past graded quizzes to catalog mistakes and erroneous assumptions",
                    "Verify solutions with standard reference textbooks"
                ],
                "study_hours": daily_hours,
                "priority": "Medium"
            },
            {
                "day": 4,
                "title": f"Mid-Week Reinforcement & Practice: {weakest}",
                "subject": weakest,
                "topic": "Mid-Level Problem Sets & Debugging / Proofs",
                "tasks": [
                    f"Implement 2 core algorithms or scenarios in {weakest} from scratch",
                    "Perform timed 30-minute self-test on Module 3 topics",
                    "Clarify any roadblocks with peer study group or faculty office hours"
                ],
                "study_hours": round(daily_hours * 1.1, 1),
                "priority": "High"
            },
            {
                "day": 5,
                "title": f"Strength Maintenance: {strongest}",
                "subject": strongest,
                "topic": "Advanced Topics & High-Scoring Potential",
                "tasks": [
                    f"Speed-revision of major chapters in {strongest} using active recall",
                    "Tackle 2 advanced or competitive exam-style challenge questions",
                    "Draft brief concept maps linking multiple modules together"
                ],
                "study_hours": round(daily_hours * 0.8, 1),
                "priority": "Medium"
            },
            {
                "day": 6,
                "title": "Comprehensive Mock Test & Timed Assessment",
                "subject": "Multi-Subject Review",
                "topic": "Simulated Examination Practice",
                "tasks": [
                    "Conduct a 90-minute timed mock quiz covering all 5 core subjects",
                    "Score and grade test strictly against university marking schemes",
                    "Document high-frequency error patterns in error log"
                ],
                "study_hours": round(daily_hours * 1.3, 1),
                "priority": "High"
            },
            {
                "day": 7,
                "title": "Synthesis, Spaced Repetition & Week 2 Planning",
                "subject": "All Subjects",
                "topic": "Consolidation, Flashcards & Habit Calibration",
                "tasks": [
                    "Perform flashcard / spaced repetition review of all formula sheets created this week",
                    "Review progress against the ML risk factors and update self-study metrics",
                    "Draft priority goals and topic roadmap for the upcoming academic week"
                ],
                "study_hours": round(daily_hours * 0.7, 1),
                "priority": "Review"
            }
        ]

        return {
            "summary": f"Personalized 7-day study regime calibrated for {student_name} ({category} profile). Total planned allocation: {round(sum(d['study_hours'] for d in schedule), 1)} hours with heavy weighting toward {weakest}.",
            "daily_schedule": schedule,
            "tips": [
                "Utilize the Pomodoro technique (25 min study / 5 min break) to sustain concentration during high-priority blocks.",
                f"Prioritize active problem solving over passive reading, particularly for {weakest}.",
                "Keep an active 'Error Log' noting why you missed questions on quizzes or assignments."
            ],
            "is_demo_mode": True,
            "source": "Intelligent Pedagogical Fallback Engine (Demo Mode)"
        }

# Global singleton
gemini_service = GeminiService()
