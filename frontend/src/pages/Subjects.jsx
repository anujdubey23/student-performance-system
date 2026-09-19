import React from 'react';
import { 
  BookOpen, 
  Award, 
  AlertCircle, 
  CheckCircle2, 
  TrendingUp, 
  BarChart2,
  CalendarCheck
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from 'recharts';
import { StatusBadge } from '../components/StatusBadge';

export const Subjects = ({ student, subjectAnalysis, onOpenForm }) => {
  const subjectsList = subjectAnalysis?.subjects_list || [];

  const chartData = subjectsList.map(s => ({
    name: s.name.replace('Artificial Intelligence', 'AI').replace('Operating Systems', 'OS').replace('Data Structures', 'DSA'),
    fullName: s.name,
    marks: s.marks,
    attendance: s.attendance
  }));

  const strongest = subjectAnalysis?.strongest_subject;
  const weakest = subjectAnalysis?.weakest_subject;
  const attentionList = subjectAnalysis?.attention_needed || [];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Page Header */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
              Academic Curriculum Analysis
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Core Engineering Subject Breakdown
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Individual subject performance, continuous lab scores, and target remediation indicators
          </p>
        </div>

        <button
          onClick={onOpenForm}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-lg shadow-sm transition-colors self-start md:self-auto"
        >
          <span>Modify Subject Marks</span>
        </button>
      </div>

      {/* Summary Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 flex items-center gap-3.5">
          <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-lg shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider block">
              Strongest Subject
            </span>
            <span className="text-base font-bold text-emerald-950 block">
              {strongest?.name || 'N/A'}
            </span>
            <span className="text-xs text-emerald-700 font-mono">
              Score: {strongest?.marks || 0}%
            </span>
          </div>
        </div>

        <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-4 flex items-center gap-3.5">
          <div className="p-2.5 bg-rose-100 text-rose-700 rounded-lg shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-rose-800 uppercase tracking-wider block">
              Weakest Subject
            </span>
            <span className="text-base font-bold text-rose-950 block">
              {weakest?.name || 'N/A'}
            </span>
            <span className="text-xs text-rose-700 font-mono">
              Score: {weakest?.marks || 0}% (Requires Focus)
            </span>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center gap-3.5">
          <div className="p-2.5 bg-slate-200 text-slate-700 rounded-lg shrink-0">
            <BarChart2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Curriculum Average
            </span>
            <span className="text-base font-bold text-slate-900 block">
              {subjectAnalysis?.average_marks || 0}%
            </span>
            <span className="text-xs text-slate-500">
              {attentionList.length > 0 
                ? `${attentionList.length} subject(s) below benchmark` 
                : 'All subjects meeting benchmark'}
            </span>
          </div>
        </div>
      </div>

      {/* Subject Comparison Chart */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Comparative Marks vs 60% Passing Benchmark</h3>
            <p className="text-xs text-slate-500">Dotted line indicates academic threshold requiring remedial study intervention</p>
          </div>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e293b', 
                  borderRadius: '8px', 
                  border: 'none', 
                  color: '#fff', 
                  fontSize: '12px' 
                }} 
              />
              <ReferenceLine y={60} stroke="#ef4444" strokeDasharray="4 4" label={{ value: '60% Benchmark', fill: '#ef4444', fontSize: 10, position: 'top' }} />
              <Bar dataKey="marks" fill="#0d9488" radius={[4, 4, 0, 0]} name="Subject Marks (%)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Subject Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {subjectsList.map((subject) => {
          const isCritical = subject.marks < 60;
          return (
            <div 
              key={subject.name} 
              className={`bg-white rounded-xl p-5 border ${isCritical ? 'border-rose-300 ring-1 ring-rose-200' : 'border-slate-200'} shadow-sm flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-bold text-slate-900">{subject.name}</h4>
                  <StatusBadge status={subject.status} size="small" />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Marks Scored</span>
                    <span className="text-lg font-bold text-slate-900 font-mono">{subject.marks}%</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Class Attendance</span>
                    <span className="text-lg font-bold text-slate-900 font-mono">{subject.attendance}%</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                    <span>Mastery Level</span>
                    <span>{subject.marks}/100</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${subject.marks >= 75 ? 'bg-emerald-600' : subject.marks >= 60 ? 'bg-indigo-600' : 'bg-rose-500'}`}
                      style={{ width: `${subject.marks}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Footer status text */}
              <div className="mt-4 pt-3 border-t border-slate-100 text-xs">
                {isCritical ? (
                  <div className="flex items-center gap-1.5 text-rose-700 font-medium">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Requires immediate revision prior to finals</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Satisfactory standing maintain routine</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
