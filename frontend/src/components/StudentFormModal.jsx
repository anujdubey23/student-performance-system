import React, { useState } from 'react';
import { X, RefreshCw, Sparkles, Check, AlertCircle } from 'lucide-react';
import { DEFAULT_STUDENT_DATA } from '../data/defaultData';

export const StudentFormModal = ({ isOpen, onClose, currentData, onSubmit }) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    student_name: currentData?.student_name || 'Anuj Dubey',
    student_id: currentData?.student_id || 'STU1024',
    attendance: currentData?.attendance || 84.5,
    previous_percentage: currentData?.previous_percentage || 78.0,
    assignment_score: currentData?.assignment_score || 76.5,
    quiz_score: currentData?.quiz_score || 72.0,
    internal_marks: currentData?.internal_marks || 74.0,
    study_hours: currentData?.study_hours || 14.5,
    completed_assignments: currentData?.completed_assignments || 8,
    completed_quizzes: currentData?.completed_quizzes || 4,
    subjects: {
      "Data Structures": { 
        marks: currentData?.subjects?.["Data Structures"]?.marks ?? 68, 
        attendance: currentData?.subjects?.["Data Structures"]?.attendance ?? 82 
      },
      "DBMS": { 
        marks: currentData?.subjects?.["DBMS"]?.marks ?? 76, 
        attendance: currentData?.subjects?.["DBMS"]?.attendance ?? 85 
      },
      "Artificial Intelligence": { 
        marks: currentData?.subjects?.["Artificial Intelligence"]?.marks ?? 84, 
        attendance: currentData?.subjects?.["Artificial Intelligence"]?.attendance ?? 88 
      },
      "Computer Networks": { 
        marks: currentData?.subjects?.["Computer Networks"]?.marks ?? 56, 
        attendance: currentData?.subjects?.["Computer Networks"]?.attendance ?? 78 
      },
      "Operating Systems": { 
        marks: currentData?.subjects?.["Operating Systems"]?.marks ?? 72, 
        attendance: currentData?.subjects?.["Operating Systems"]?.attendance ?? 84 
      }
    }
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.student_name.trim()) errs.student_name = 'Name is required';
    if (!formData.student_id.trim()) errs.student_id = 'Student ID is required';

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

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubjectChange = (subject, field, value) => {
    setFormData(prev => ({
      ...prev,
      subjects: {
        ...prev.subjects,
        [subject]: {
          ...prev.subjects[subject],
          [field]: parseFloat(value) || 0
        }
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
      onClose();
    }
  };

  // Quick preset loader for interview live demonstrations
  const loadPreset = (type) => {
    if (type === 'default') {
      setFormData(DEFAULT_STUDENT_DATA);
    } else if (type === 'at_risk') {
      setFormData({
        student_name: "Rahul Verma (Demo)",
        student_id: "STU2041",
        attendance: 56.0,
        previous_percentage: 51.5,
        assignment_score: 48.0,
        quiz_score: 42.0,
        internal_marks: 45.0,
        study_hours: 5.5,
        completed_assignments: 4,
        completed_quizzes: 2,
        subjects: {
          "Data Structures": { marks: 44.0, attendance: 58.0 },
          "DBMS": { marks: 52.0, attendance: 62.0 },
          "Artificial Intelligence": { marks: 48.0, attendance: 55.0 },
          "Computer Networks": { marks: 40.0, attendance: 50.0 },
          "Operating Systems": { marks: 51.0, attendance: 60.0 }
        }
      });
    } else if (type === 'high') {
      setFormData({
        student_name: "Priya Patel (Demo)",
        student_id: "STU1088",
        attendance: 94.0,
        previous_percentage: 89.5,
        assignment_score: 92.0,
        quiz_score: 88.0,
        internal_marks: 91.0,
        study_hours: 24.0,
        completed_assignments: 10,
        completed_quizzes: 5,
        subjects: {
          "Data Structures": { marks: 92.0, attendance: 95.0 },
          "DBMS": { marks: 88.0, attendance: 92.0 },
          "Artificial Intelligence": { marks: 96.0, attendance: 98.0 },
          "Computer Networks": { marks: 84.0, attendance: 90.0 },
          "Operating Systems": { marks: 90.0, attendance: 94.0 }
        }
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Student Academic Data & ML Parameters</h2>
            <p className="text-xs text-slate-500">Update academic metrics to trigger live Random Forest re-classification</p>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preset quick buttons for interview live demos */}
        <div className="px-6 py-2.5 bg-teal-50/70 border-b border-teal-100 flex items-center justify-between flex-wrap gap-2 text-xs">
          <span className="text-teal-900 font-medium flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-teal-700" />
            Interview Demo Presets:
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => loadPreset('default')}
              className="px-2.5 py-1 bg-white border border-teal-200 hover:border-teal-300 text-teal-800 rounded font-medium shadow-xs"
            >
              Anuj Dubey (Baseline)
            </button>
            <button
              type="button"
              onClick={() => loadPreset('at_risk')}
              className="px-2.5 py-1 bg-white border border-rose-200 hover:border-rose-300 text-rose-800 rounded font-medium shadow-xs"
            >
              Simulate "At Risk" Student
            </button>
            <button
              type="button"
              onClick={() => loadPreset('high')}
              className="px-2.5 py-1 bg-white border border-emerald-200 hover:border-emerald-300 text-emerald-800 rounded font-medium shadow-xs"
            >
              Simulate "High Performance"
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
          
          {/* Identity Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Student Full Name</label>
              <input
                type="text"
                value={formData.student_name}
                onChange={(e) => handleInputChange('student_name', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
              />
              {errors.student_name && <p className="text-rose-600 text-xs mt-1">{errors.student_name}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Student Roll / ID</label>
              <input
                type="text"
                value={formData.student_id}
                onChange={(e) => handleInputChange('student_id', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
              />
              {errors.student_id && <p className="text-rose-600 text-xs mt-1">{errors.student_id}</p>}
            </div>
          </div>

          {/* Academic Features (ML Inputs) */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
              Machine Learning Input Features
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs text-slate-700 mb-1 font-medium">Attendance (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.attendance}
                  onChange={(e) => handleInputChange('attendance', e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                />
                {errors.attendance && <p className="text-rose-600 text-[11px] mt-1">{errors.attendance}</p>}
              </div>

              <div>
                <label className="block text-xs text-slate-700 mb-1 font-medium">Prev Sem (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.previous_percentage}
                  onChange={(e) => handleInputChange('previous_percentage', e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                />
                {errors.previous_percentage && <p className="text-rose-600 text-[11px] mt-1">{errors.previous_percentage}</p>}
              </div>

              <div>
                <label className="block text-xs text-slate-700 mb-1 font-medium">Assignments Avg (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.assignment_score}
                  onChange={(e) => handleInputChange('assignment_score', e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                />
                {errors.assignment_score && <p className="text-rose-600 text-[11px] mt-1">{errors.assignment_score}</p>}
              </div>

              <div>
                <label className="block text-xs text-slate-700 mb-1 font-medium">Quiz Avg (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.quiz_score}
                  onChange={(e) => handleInputChange('quiz_score', e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                />
                {errors.quiz_score && <p className="text-rose-600 text-[11px] mt-1">{errors.quiz_score}</p>}
              </div>

              <div>
                <label className="block text-xs text-slate-700 mb-1 font-medium">Internal Marks (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.internal_marks}
                  onChange={(e) => handleInputChange('internal_marks', e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                />
                {errors.internal_marks && <p className="text-rose-600 text-[11px] mt-1">{errors.internal_marks}</p>}
              </div>

              <div>
                <label className="block text-xs text-slate-700 mb-1 font-medium">Study Hours/wk</label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.study_hours}
                  onChange={(e) => handleInputChange('study_hours', e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                />
                {errors.study_hours && <p className="text-rose-600 text-[11px] mt-1">{errors.study_hours}</p>}
              </div>

              <div>
                <label className="block text-xs text-slate-700 mb-1 font-medium">Assignments Done (out of 10)</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={formData.completed_assignments}
                  onChange={(e) => handleInputChange('completed_assignments', e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                />
                {errors.completed_assignments && <p className="text-rose-600 text-[11px] mt-1">{errors.completed_assignments}</p>}
              </div>

              <div>
                <label className="block text-xs text-slate-700 mb-1 font-medium">Quizzes Done (out of 5)</label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  value={formData.completed_quizzes}
                  onChange={(e) => handleInputChange('completed_quizzes', e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                />
                {errors.completed_quizzes && <p className="text-rose-600 text-[11px] mt-1">{errors.completed_quizzes}</p>}
              </div>
            </div>
          </div>

          {/* Subject Wise Performance */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
              Subject-Wise Breakdown (5 Core Engineering Subjects)
            </h3>
            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              {Object.keys(formData.subjects).map((subj) => (
                <div key={subj} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center text-xs">
                  <div className="sm:col-span-6 font-medium text-slate-800">
                    {subj}
                  </div>
                  <div className="sm:col-span-3 flex items-center gap-2">
                    <span className="text-slate-500 shrink-0">Marks:</span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.subjects[subj].marks}
                      onChange={(e) => handleSubjectChange(subj, 'marks', e.target.value)}
                      className="w-full px-2.5 py-1 text-sm bg-white border border-slate-300 rounded focus:border-teal-600 focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-3 flex items-center gap-2">
                    <span className="text-slate-500 shrink-0">Att (%):</span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.subjects[subj].attendance}
                      onChange={(e) => handleSubjectChange(subj, 'attendance', e.target.value)}
                      className="w-full px-2.5 py-1 text-sm bg-white border border-slate-300 rounded focus:border-teal-600 focus:outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm transition-colors flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Apply & Run ML Prediction</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
