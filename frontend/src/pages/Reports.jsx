import React from 'react';
import { 
  Printer, 
  Download, 
  GraduationCap, 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles,
  Calendar
} from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';

export const Reports = ({ student, prediction, subjectAnalysis }) => {
  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Action Bar (hidden when printing) */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Comprehensive Academic Performance Report</h2>
          <p className="text-xs text-slate-500">Official student assessment evaluation and predictive advisory transcript</p>
        </div>

        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors self-start sm:self-auto"
        >
          <Printer className="w-4 h-4" />
          <span>Download / Print Official Report</span>
        </button>
      </div>

      {/* Formal Printable Document Sheet */}
      <div className="bg-white rounded-xl p-8 sm:p-12 border border-slate-200 shadow-sm max-w-4xl mx-auto space-y-8 print:border-none print:shadow-none print:p-0">
        
        {/* Academic Header */}
        <div className="border-b-2 border-slate-900 pb-6 flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-teal-600 text-white rounded-lg">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 uppercase tracking-tight">
                  University Institute of Technology
                </h1>
                <p className="text-xs text-slate-500 font-medium">Department of Computer Science & Engineering</p>
              </div>
            </div>
            <div className="text-xs text-slate-500 pt-2 font-mono">
              AI-Driven Academic Performance Assessment Transcript
            </div>
          </div>

          <div className="text-right text-xs text-slate-500 space-y-1">
            <div className="flex items-center justify-end gap-1.5 font-mono">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{currentDate}</span>
            </div>
            <div className="font-mono text-slate-600">Report Ref: RPT-{student?.student_id || '1024'}-S6</div>
            <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold uppercase">
              Official Assessment
            </span>
          </div>
        </div>

        {/* Student Metadata Table */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
          <div>
            <span className="text-slate-500 block text-[11px] font-medium">Student Full Name</span>
            <span className="text-sm font-bold text-slate-900">{student?.student_name || 'Anuj Dubey'}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px] font-medium">Student Registration ID</span>
            <span className="text-sm font-bold text-slate-900 font-mono">{student?.student_id || 'STU1024'}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px] font-medium">Academic Program</span>
            <span className="text-sm font-semibold text-slate-800">B.Tech (CSE)</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px] font-medium">Current Semester</span>
            <span className="text-sm font-semibold text-slate-800">Semester VI (Final Year)</span>
          </div>
        </div>

        {/* Section 1: ML Performance Prediction */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              1. Machine Learning Performance Evaluation
            </h3>
            <span className="text-[11px] text-slate-500 font-mono">Random Forest Classifier (100 Trees)</span>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-500">Predicted Academic Standing:</span>
              <div className="text-lg font-bold text-slate-900 mt-0.5 flex items-center gap-2">
                <span>{prediction?.predicted_category || 'Average Performance'}</span>
                <StatusBadge status={prediction?.predicted_category} size="small" />
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Classification confidence: <strong className="text-slate-800 font-mono">{prediction?.confidence || 75}%</strong> based on continuous evaluation features.
              </p>
            </div>

            <div className="text-xs font-mono bg-white p-3 rounded-lg border border-slate-200 text-slate-600 space-y-1">
              <div>High Performance: {((prediction?.probabilities?.['High Performance'] || 0) * 100).toFixed(1)}%</div>
              <div>Average Performance: {((prediction?.probabilities?.['Average Performance'] || 0) * 100).toFixed(1)}%</div>
              <div>At Risk: {((prediction?.probabilities?.['At Risk'] || 0) * 100).toFixed(1)}%</div>
            </div>
          </div>
        </div>

        {/* Section 2: Core Subject Breakdown Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <Award className="w-4 h-4 text-teal-600" />
              2. Curriculum Coursework Performance
            </h3>
            <span className="text-xs text-slate-500">Average: <strong className="text-slate-900">{subjectAnalysis?.average_marks || 0}%</strong></span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs border border-slate-200 rounded-lg overflow-hidden">
              <thead className="bg-slate-100 text-slate-700 font-semibold">
                <tr>
                  <th className="p-3 text-left">Subject / Course Code</th>
                  <th className="p-3 text-center">Marks Scored (%)</th>
                  <th className="p-3 text-center">Attendance (%)</th>
                  <th className="p-3 text-center">Evaluation Standing</th>
                  <th className="p-3 text-center">Action Required</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {(subjectAnalysis?.subjects_list || []).map((subj) => (
                  <tr key={subj.name} className="hover:bg-slate-50">
                    <td className="p-3 font-medium text-slate-900">{subj.name}</td>
                    <td className="p-3 text-center font-mono font-bold text-slate-800">{subj.marks}%</td>
                    <td className="p-3 text-center font-mono text-slate-600">{subj.attendance}%</td>
                    <td className="p-3 text-center">
                      <StatusBadge status={subj.status} size="small" />
                    </td>
                    <td className="p-3 text-center font-medium">
                      {subj.improvement_required ? (
                        <span className="text-rose-700 font-semibold">Remedial Focus</span>
                      ) : (
                        <span className="text-emerald-700 font-medium">Standard</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Strengths & Vulnerabilities */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              Verified Academic Strengths
            </span>
            <ul className="space-y-1.5 text-xs text-emerald-900">
              {(prediction?.strengths || []).map((str, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-emerald-700 font-bold">•</span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/50 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-900 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-700" />
              Areas Requiring Intervention
            </span>
            <ul className="space-y-1.5 text-xs text-rose-900">
              {(prediction?.risk_factors || []).map((rf, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-rose-700 font-bold">•</span>
                  <span>{rf}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Section 4: Advisor Comments & Next Steps */}
        <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 space-y-2 text-xs text-slate-700">
          <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px] block">
            Academic Advisory Recommendation
          </span>
          <p className="leading-relaxed">
            The student is advised to adhere to the customized 7-day adaptive curriculum. Special focus should be granted to <strong>{subjectAnalysis?.weakest_subject?.name || 'remedial areas'}</strong> with an allocation of at least 15 hours of self-study per week. Continued monitoring will be conducted during the upcoming continuous evaluation cycle.
          </p>
        </div>

        {/* Signatures & Certification */}
        <div className="pt-8 border-t border-slate-200 flex items-end justify-between text-xs text-slate-500">
          <div className="space-y-1">
            <div className="font-serif italic text-slate-800 text-sm font-bold">Academic Assessment Board</div>
            <div>Computer Science & Engineering Division</div>
          </div>
          <div className="text-right space-y-1">
            <div className="h-8 border-b border-slate-400 w-40 ml-auto" />
            <div className="text-[11px]">Faculty Advisor Signature</div>
          </div>
        </div>

      </div>

    </div>
  );
};
