export const DEFAULT_STUDENT_DATA = {
  student_name: "Anuj Sharma",
  student_id: "STU1024",
  attendance: 84.5,
  previous_percentage: 78.0,
  assignment_score: 76.5,
  quiz_score: 72.0,
  internal_marks: 74.0,
  study_hours: 14.5,
  completed_assignments: 8,
  completed_quizzes: 4,
  subjects: {
    "Data Structures": { marks: 68.0, attendance: 82.0 },
    "DBMS": { marks: 76.0, attendance: 85.0 },
    "Artificial Intelligence": { marks: 84.0, attendance: 88.0 },
    "Computer Networks": { marks: 56.0, attendance: 78.0 },
    "Operating Systems": { marks: 72.0, attendance: 84.0 }
  }
};

export const DEFAULT_PREDICTION = {
  predicted_category: "Average Performance",
  confidence: 74.7,
  confidence_decimal: 0.7469,
  probabilities: {
    "High Performance": 0.2486,
    "Average Performance": 0.7469,
    "At Risk": 0.0045
  },
  strengths: [
    "Consistent class attendance record (84.5%)",
    "Solid assignment submission track record (8/10 completed)",
    "Consistent engagement across multiple continuous assessments"
  ],
  risk_factors: [
    "Computer Networks performance (56%) is below target baseline",
    "Weekly self-study hours (14.5 hrs) could be scaled to 18 hrs for distinction"
  ]
};

export const DEFAULT_SUBJECT_ANALYSIS = {
  average_marks: 71.2,
  strongest_subject: { name: "Artificial Intelligence", marks: 84.0 },
  weakest_subject: { name: "Computer Networks", marks: 56.0 },
  attention_needed: ["Computer Networks"],
  subjects_list: [
    { name: "Data Structures", marks: 68.0, attendance: 82.0, status: "Average", improvement_required: false },
    { name: "DBMS", marks: 76.0, attendance: 85.0, status: "Strong", improvement_required: false },
    { name: "Artificial Intelligence", marks: 84.0, attendance: 88.0, status: "Strong", improvement_required: false },
    { name: "Computer Networks", marks: 56.0, attendance: 78.0, status: "Critical Attention", improvement_required: true },
    { name: "Operating Systems", marks: 72.0, attendance: 84.0, status: "Average", improvement_required: false }
  ]
};
