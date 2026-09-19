import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ClipboardEdit, 
  CheckCircle2, 
  Sparkles, 
  RotateCcw, 
  ArrowRight, 
  BookOpen, 
  AlertCircle 
} from 'lucide-react';
import { DEFAULT_STUDENT_DATA } from '../data/defaultData';

export const DataEntry = ({ student, onUpdateStudent }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    student_name: student?.student_name || '',
    student_id: student?.student_id || '',
    attendance: student?.attendance ?? 75.0,
    previous_percentage: student?.previous_percentage ?? 70.0,
    assignment_score: student?.assignment_score ?? 70.0,
    quiz_score: student?.quiz_score ?? 68.0,
    internal_marks: student?.internal_marks ?? 70.0,
    study_hours: student?.study_hours ?? 12.0,
    completed_assignments: student?.completed_assignments ?? 7,
    completed_quizzes: student?.completed_quizzes ?? 3,
    subjects: {
      "Data Structures": { 
        marks: student?.subjects?.["Data Structures"]?.marks ?? 65, 
        attendance: student?.subjects?.["Data Structures"]?.attendance ?? 80 
      },
      "DBMS": { 
        marks: student?.subjects?.["DBMS"]?.marks ?? 70, 
        attendance: student?.subjects?.["DBMS"]?.attendance ?? 80 
      },
      "Artificial Intelligence": { 
        marks: student?.subjects?.["Artificial Intelligence"]?.marks ?? 75, 
        attendance: student?.subjects?.["Artificial Intelligence"]?.attendance ?? 85 
      },
      "Computer Networks": { 
        marks: student?.subjects?.["Computer Networks"]?.marks ?? 58, 
        attendance: student?.subjects?.["Computer Networks"]?.attendance ?? 75 
      },
      "Operating Systems": { 
        marks: student?.subjects?.["Operating Systems"]?.marks ?? 68, 
        attendance: student?.subjects?.["Operating Systems"]?.attendance ?? 80 
      }
    }
  });

  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState('');

  const validate = () => {
    const errs = {};
    if (!formData.student_name.trim()) errs.student_name = 'Student Name is required';
    if (!formData.student_id.trim()) errs.student_id = 'Student ID / Roll No is required';

    const numCheck = (val, min, max, key, label) => {
      const num = parseFloat(val);
      if (isNaN(num) || num < min || num > max) {
        errs[key] = `${label} must be between ${min} and ${max}`;
      }
    };

    numCheck(formData.attendance, 0, 100, 'attendance', 'Attendance %');
    numCheck(formData.previous_percentage, 0, 100, 'previous_percentage', 'Previous sem %');
    numCheck(formData.assignment_score, 0, 100, 'assignment_score', 'Assignment average');
    numCheck(formData.quiz_score, 0, 100, 'quiz_score', 'Quiz average');
    numCheck(formData.internal_marks, 0, 100, 'internal_marks', 'Internal marks');
    numCheck(formData.study_hours, 0, 60, 'study_hours', 'Study hours/week');
    numCheck(formData.completed_assignments, 0, 10, 'completed_assignments', 'Completed assignments');
    numCheck(formData.completed_quizzes, 0, 5, 'completed_quizzes', 'Completed quizzes');

    // Validate subject marks
    Object.entries(formData.subjects).forEach(([subj, data]) => {
      if (data.marks < 0 || data.marks > 100 || isNaN(data.marks)) {
        errs[`subj_${subj}_marks`] = `${subj} marks must be 0-100`;
      }
      if (data.attendance < 0 || data.attendance > 100 || isNaN(data.attendance)) {
        errs[`subj_${subj}_att`] = `${subj} attendance must be 0-100`;
      }
    });

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleInputChange = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubjectChange = (subject, field, val) => {
    setFormData(prev => ({
      ...prev,
      subjects: {
        ...prev.subjects,
        [subject]: {
          ...prev.subjects[subject],
          [field]: parseFloat(val) || 0
        }
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onUpdateStudent(formData);
      setSuccessMsg('Academic data updated! Running Random Forest prediction...');
      setTimeout(() => {
        navigate('/');
      }, 700);
    }
  };

  const loadDemoData = () => {
    setFormData(DEFAULT_STUDENT_DATA);
    setErrors({});
  };

  const clearForm = () => {
    setFormData({
      student_name: '',
      student_id: '',
      attendance: '',
      previous_percentage: '',
      assignment_score: '',
      quiz_score: '',
      internal_marks: '',
      study_hours: '',
      completed_assignments: 0,
      completed_quizzes: 0,
      subjects: {
        "Data Structures": { marks: '', attendance: '' },
        "DBMS": { marks: '', attendance: '' },
        "Artificial Intelligence": { marks: '', attendance: '' },
        "Computer Networks": { marks: '', attendance: '' },
        "Operating Systems": { marks: '', attendance: '' }
      }
    });
    setErrors({});
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded flex items-center gap-1.5">
              <ClipboardEdit className="w-3.5 h-3.5 text-teal-600" />
              Student Data Entry
            </span>
            <span className="text-xs text-slate-500 font-mono">Academic Input & Evaluation</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Enter Academic & Coursework Details
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Fill in your subject-wise marks, internal assessment, and attendance to trigger real-time ML analysis
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={clearForm}
            className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg border border-slate-200"
          >
            Clear Form
          </button>
          <button
            type="button"
            onClick={loadDemoData}
            className="px-3 py-1.5 text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-200 hover:bg-teal-100 rounded-lg flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>Load Demo (Anuj Dubey)</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-medium">{successMsg}</span>
        </div>
      )}

      {/* Main Data Entry Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-8">
        
        {/* Section 1: Student Identity */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2">
            1. Student Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Student Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Anuj Dubey"
                value={formData.student_name}
                onChange={(e) => handleInputChange('student_name', e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
              />
              {errors.student_name && <p className="text-rose-600 text-xs mt-1">{errors.student_name}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Student ID / Roll Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. STU1024"
                value={formData.student_id}
                onChange={(e) => handleInputChange('student_id', e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 font-mono"
              />
              {errors.student_id && <p className="text-rose-600 text-xs mt-1">{errors.student_id}</p>}
            </div>
          </div>
        </div>

        {/* Section 2: Core Subject Marks Entry */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              2. Core Subject Coursework & Marks (Out of 100)
            </h3>
            <span className="text-[11px] text-slate-400">Enter marks & attendance for each subject</span>
          </div>

          <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            {Object.keys(formData.subjects).map((subj) => (
              <div key={subj} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center p-2.5 bg-white rounded-lg border border-slate-200/80">
                <div className="sm:col-span-6 font-semibold text-xs text-slate-800 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>{subj}</span>
                </div>

                <div className="sm:col-span-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-slate-500 font-medium">Marks:</span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      placeholder="0-100"
                      value={formData.subjects[subj].marks}
                      onChange={(e) => handleSubjectChange(subj, 'marks', e.target.value)}
                      className="w-full px-2.5 py-1 text-xs border border-slate-300 rounded font-mono focus:border-teal-600 focus:outline-none"
                    />
                  </div>
                  {errors[`subj_${subj}_marks`] && (
                    <p className="text-rose-600 text-[10px] mt-0.5">{errors[`subj_${subj}_marks`]}</p>
                  )}
                </div>

                <div className="sm:col-span-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-slate-500 font-medium">Att %:</span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      placeholder="0-100"
                      value={formData.subjects[subj].attendance}
                      onChange={(e) => handleSubjectChange(subj, 'attendance', e.target.value)}
                      className="w-full px-2.5 py-1 text-xs border border-slate-300 rounded font-mono focus:border-teal-600 focus:outline-none"
                    />
                  </div>
                  {errors[`subj_${subj}_att`] && (
                    <p className="text-rose-600 text-[10px] mt-0.5">{errors[`subj_${subj}_att`]}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Academic Aggregate & Habit Features */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2">
            3. Overall Academic Indicators & Study Habits (ML Features)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Overall Attendance (%)
              </label>
              <input
                type="number"
                step="0.1"
                placeholder="e.g. 84.5"
                value={formData.attendance}
                onChange={(e) => handleInputChange('attendance', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-teal-600 font-mono"
              />
              {errors.attendance && <p className="text-rose-600 text-[11px] mt-1">{errors.attendance}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Previous Sem (%)
              </label>
              <input
                type="number"
                step="0.1"
                placeholder="e.g. 78.0"
                value={formData.previous_percentage}
                onChange={(e) => handleInputChange('previous_percentage', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-teal-600 font-mono"
              />
              {errors.previous_percentage && <p className="text-rose-600 text-[11px] mt-1">{errors.previous_percentage}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Internal Exam Marks (%)
              </label>
              <input
                type="number"
                step="0.1"
                placeholder="e.g. 74.0"
                value={formData.internal_marks}
                onChange={(e) => handleInputChange('internal_marks', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-teal-600 font-mono"
              />
              {errors.internal_marks && <p className="text-rose-600 text-[11px] mt-1">{errors.internal_marks}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Weekly Study Hours
              </label>
              <input
                type="number"
                step="0.5"
                placeholder="e.g. 14.5"
                value={formData.study_hours}
                onChange={(e) => handleInputChange('study_hours', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-teal-600 font-mono"
              />
              {errors.study_hours && <p className="text-rose-600 text-[11px] mt-1">{errors.study_hours}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Assignments Average (%)
              </label>
              <input
                type="number"
                step="0.1"
                placeholder="e.g. 76.5"
                value={formData.assignment_score}
                onChange={(e) => handleInputChange('assignment_score', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-teal-600 font-mono"
              />
              {errors.assignment_score && <p className="text-rose-600 text-[11px] mt-1">{errors.assignment_score}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Quizzes Average (%)
              </label>
              <input
                type="number"
                step="0.1"
                placeholder="e.g. 72.0"
                value={formData.quiz_score}
                onChange={(e) => handleInputChange('quiz_score', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-teal-600 font-mono"
              />
              {errors.quiz_score && <p className="text-rose-600 text-[11px] mt-1">{errors.quiz_score}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Completed Assignments (/10)
              </label>
              <input
                type="number"
                min="0"
                max="10"
                value={formData.completed_assignments}
                onChange={(e) => handleInputChange('completed_assignments', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-teal-600 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Completed Quizzes (/5)
              </label>
              <input
                type="number"
                min="0"
                max="5"
                value={formData.completed_quizzes}
                onChange={(e) => handleInputChange('completed_quizzes', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-teal-600 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancel & Return to Dashboard
          </button>
          
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
          >
            <span>Analyze & Generate My Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </form>

    </div>
  );
};
