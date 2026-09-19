import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { 
  GraduationCap, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  ArrowRight,
  BookOpen,
  Award
} from 'lucide-react';
import { MetricCard } from '../components/MetricCard';
import { StatusBadge } from '../components/StatusBadge';

export const Dashboard = ({ student, prediction, subjectAnalysis, onGenerateStudyPlan }) => {
  const navigate = useNavigate();

  const chartData = (subjectAnalysis?.subjects_list || []).map(s => ({
    subject: s.name.replace('Artificial Intelligence', 'AI').replace('Operating Systems', 'OS').replace('Data Structures', 'DSA'),
    fullName: s.name,
    marks: s.marks,
    attendance: s.attendance
  }));

  const assessmentData = [
    { metric: 'Internal Marks', value: student?.internal_marks || 0, benchmark: 75 },
    { metric: 'Assignments', value: student?.assignment_score || 0, benchmark: 80 },
    { metric: 'Quizzes', value: student?.quiz_score || 0, benchmark: 75 },
    { metric: 'Attendance', value: student?.attendance || 0, benchmark: 75 },
    { metric: 'Prev Sem', value: student?.previous_percentage || 0, benchmark: 70 },
  ];

  const predictedCategory = prediction?.predicted_category || 'Average Performance';
  const confidence = prediction?.confidence || 75.0;

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Welcome & ML Prediction Banner */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Academic Dashboard: {student?.student_name}
            </h2>
            <StatusBadge status={predictedCategory} size="large" />
          </div>
          <p className="text-xs text-slate-500">
            Student ID: <span className="font-mono font-medium text-slate-700">{student?.student_id}</span> • Computer Science Engineering • Semester VI
          </p>
        </div>

        {/* Prediction summary pill */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-right shrink-0">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Random Forest Prediction
          </div>
          <div className="text-sm font-bold text-slate-900 mt-0.5">
            {predictedCategory}
            <span className="text-xs font-normal text-slate-500 ml-1.5">({confidence}% confidence)</span>
          </div>
        </div>
      </div>

      {/* Primary KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Overall Attendance"
          value={`${student?.attendance || 0}%`}
          subtitle="University minimum: 75%"
          icon={CheckCircle2}
          accent={student?.attendance >= 75 ? "teal" : "rose"}
          progress={student?.attendance || 0}
        />
        <MetricCard
          title="Average Subject Marks"
          value={`${subjectAnalysis?.average_marks || 0}%`}
          subtitle={`Top: ${subjectAnalysis?.strongest_subject?.name || 'N/A'}`}
          icon={Award}
          accent="indigo"
          progress={subjectAnalysis?.average_marks || 0}
        />
        <MetricCard
          title="Weekly Study Hours"
          value={`${student?.study_hours || 0} hrs`}
          subtitle="Target: 18 hours/week"
          icon={Clock}
          accent={student?.study_hours >= 14 ? "teal" : "amber"}
          progress={((student?.study_hours || 0) / 25) * 100}
        />
        <MetricCard
          title="Assignment Submissions"
          value={`${student?.completed_assignments || 0} / 10`}
          subtitle={`Quizzes: ${student?.completed_quizzes || 0} / 5 completed`}
          icon={BookOpen}
          accent="slate"
          progress={((student?.completed_assignments || 0) / 10) * 100}
        />
      </div>

      {/* Middle Row: Visual Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Subject Marks Bar Chart */}
        <div className="lg:col-span-7 bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Subject-Wise Performance</h3>
              <p className="text-xs text-slate-500">Marks vs Attendance comparison across curriculum</p>
            </div>
            <span className="text-xs font-medium text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
              5 Core Subjects
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="subject" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} />
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
                <Bar dataKey="marks" fill="#0d9488" radius={[4, 4, 0, 0]} name="Marks (%)" />
                <Bar dataKey="attendance" fill="#94a3b8" radius={[4, 4, 0, 0]} name="Attendance (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex items-center justify-center gap-6 text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-teal-600 inline-block" />
              <span>Marks (%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-slate-400 inline-block" />
              <span>Attendance (%)</span>
            </div>
          </div>
        </div>

        {/* Academic Competency Benchmark */}
        <div className="lg:col-span-5 bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Evaluation Components</h3>
            <p className="text-xs text-slate-500">Individual continuous evaluation vs department benchmarks</p>
          </div>

          <div className="h-60 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={assessmentData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: '#475569' }} />
                <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 9, fill: '#94a3b8' }} />
                <Radar name="Student Score" dataKey="value" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.4} />
                <Radar name="Benchmark" dataKey="benchmark" stroke="#cbd5e1" fill="#cbd5e1" fillOpacity={0.15} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 text-slate-500">
            <span>Critical Area: <strong className="text-rose-600">{subjectAnalysis?.weakest_subject?.name || 'None'}</strong></span>
            <span>Strength: <strong className="text-teal-700">{subjectAnalysis?.strongest_subject?.name || 'None'}</strong></span>
          </div>
        </div>

      </div>

      {/* Bottom Row: Quick Insights & AI Trigger */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ML Strengths & Factors */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Machine Learning Observations
          </h3>
          <div className="space-y-2 text-xs">
            {(prediction?.strengths || []).slice(0, 2).map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 text-emerald-800 bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
            {(prediction?.risk_factors || []).slice(0, 2).map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 text-amber-800 bg-amber-50/70 p-2.5 rounded-lg border border-amber-100">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick GenAI Study Recommendation Box */}
        <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Generative AI Study Advisor</span>
            </div>
            <h4 className="text-base font-semibold text-white">
              Tailored 7-Day Curriculum Ready for Generation
            </h4>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Synthesizes your Random Forest prediction ({predictedCategory}) with subject-level weak areas in {subjectAnalysis?.weakest_subject?.name || 'core areas'} to construct a realistic, day-by-day revision schedule with tasks and time allocations.
            </p>
          </div>

          <div className="mt-5 flex items-center justify-between pt-4 border-t border-slate-700/60 flex-wrap gap-3">
            <span className="text-[11px] text-slate-400">
              Strict Separation: ML classifies risk • Gemini designs the curriculum
            </span>
            <button
              onClick={() => navigate('/study-plan')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
            >
              <span>View AI Study Plan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
