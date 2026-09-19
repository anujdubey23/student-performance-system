import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Clock, 
  CalendarCheck, 
  CheckCircle, 
  AlertCircle, 
  BookOpen, 
  RefreshCw, 
  ListChecks, 
  Info,
  Lightbulb,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { apiService } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';

export const AIStudyPlan = ({ student, prediction, subjectAnalysis, healthStatus }) => {
  const [studyPlan, setStudyPlan] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [completedTasks, setCompletedTasks] = useState({});

  const isGeminiLive = healthStatus?.gemini_api_configured;

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);

    const payload = {
      student_name: student.student_name,
      student_data: student,
      prediction: prediction,
      subject_analysis: subjectAnalysis
    };

    try {
      // Parallel generation of feedback and 7-day schedule
      const [planRes, fbRes] = await Promise.all([
        apiService.generateStudyPlan(payload),
        apiService.generateFeedback(payload)
      ]);

      setStudyPlan(planRes);
      setFeedback(fbRes);
    } catch (err) {
      console.error('Error generating AI study plan:', err);
      setError('Unable to generate the study plan right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Auto-generate on first mount if empty
  useEffect(() => {
    if (!studyPlan && !loading) {
      handleGenerate();
    }
  }, [student?.student_id]);

  const toggleTask = (dayIdx, taskIdx) => {
    const key = `${dayIdx}-${taskIdx}`;
    setCompletedTasks(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const getPriorityBadge = (priority) => {
    const p = (priority || '').toLowerCase();
    if (p.includes('high')) {
      return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200">High Priority</span>;
    } else if (p.includes('medium')) {
      return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">Medium</span>;
    }
    return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-100 text-teal-800 border border-teal-200">Review & Planning</span>;
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner & Generation Trigger */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              Generative AI Module
            </span>
            <span className="text-xs text-slate-500 font-mono">
              {studyPlan?.source || (isGeminiLive ? 'Google Gemini 1.5 Flash' : 'Demo Fallback Engine')}
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Personalized Feedback & 7-Day Adaptive Study Plan
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Synthesizes Random Forest predictions with subject performance to create a realistic revision timetable
          </p>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors self-start md:self-auto shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Synthesizing with AI...' : 'Regenerate Study Plan'}</span>
        </button>
      </div>

      {/* AI Mode Banner */}
      <div className={`rounded-xl p-4 border flex items-start gap-3 ${
        studyPlan?.is_demo_mode 
          ? 'bg-amber-50/70 border-amber-200 text-amber-900' 
          : 'bg-teal-50/70 border-teal-200 text-teal-900'
      }`}>
        <Info className="w-5 h-5 shrink-0 mt-0.5" />
        <div className="text-xs space-y-0.5">
          <div className="font-semibold">
            {studyPlan?.is_demo_mode ? 'Running in Intelligent Demo Fallback Mode' : 'Connected to Live Google Gemini API'}
          </div>
          <p className="opacity-90 leading-relaxed">
            {studyPlan?.is_demo_mode 
              ? 'Gemini API key is not configured in .env or system is offline. The application has generated a fully personalized study curriculum using its built-in pedagogical rule engine.'
              : 'Prompt crafted with student performance parameters, ML classification ground-truth, and subject error profiles to ensure pedagogically grounded output.'}
          </p>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="bg-white rounded-xl p-12 border border-slate-200 shadow-sm text-center space-y-4">
          <div className="inline-block p-4 rounded-full bg-teal-50 text-teal-600 animate-pulse">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="text-sm font-semibold text-slate-800">Generating Personalized Curriculum...</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Analyzing ML probability distributions, prioritizing weak subjects ({subjectAnalysis?.weakest_subject?.name}), and allocating study hours...
          </p>
        </div>
      )}

      {/* Content Area */}
      {!loading && (
        <div className="space-y-6">
          
          {/* Personalized Pedagogical Feedback Card */}
          {feedback && (
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-teal-600" />
                  <h3 className="text-sm font-bold text-slate-900">Personalized Advisor Feedback</h3>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">{student?.student_name}</span>
              </div>
              <div className="prose prose-sm max-w-none text-slate-700 text-xs leading-relaxed space-y-2">
                {feedback.feedback.split('\n\n').map((paragraph, pIdx) => {
                  if (paragraph.startsWith('###') || paragraph.startsWith('####')) {
                    return <h4 key={pIdx} className="text-xs font-bold text-slate-900 mt-2">{paragraph.replace(/^#+\s*/, '')}</h4>;
                  }
                  if (paragraph.startsWith('-')) {
                    return (
                      <ul key={pIdx} className="list-disc pl-5 space-y-1">
                        {paragraph.split('\n').map((item, iIdx) => (
                          <li key={iIdx} dangerouslySetInnerHTML={{ __html: item.replace(/^-\s*/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                        ))}
                      </ul>
                    );
                  }
                  return (
                    <p key={pIdx} dangerouslySetInnerHTML={{ __html: paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                  );
                })}
              </div>
            </div>
          )}

          {/* 7-Day Study Schedule */}
          {studyPlan?.daily_schedule && (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="text-base font-bold text-slate-900">7-Day Structured Schedule</h3>
                  <p className="text-xs text-slate-500">
                    {studyPlan.summary || 'Adaptive daily roadmap calibrated to your weekly self-study capacity'}
                  </p>
                </div>
                <div className="text-xs font-mono text-slate-600 bg-slate-100 px-3 py-1 rounded-md border border-slate-200">
                  Total Allocated: {studyPlan.daily_schedule.reduce((acc, d) => acc + (d.study_hours || 0), 0).toFixed(1)} hrs
                </div>
              </div>

              {/* Day Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {studyPlan.daily_schedule.map((day, dIdx) => (
                  <div 
                    key={day.day || dIdx} 
                    className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all"
                  >
                    <div>
                      {/* Day Header */}
                      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                            {day.day}
                          </span>
                          <span className="text-xs font-bold text-slate-800">Day {day.day}</span>
                        </div>
                        {getPriorityBadge(day.priority)}
                      </div>

                      {/* Title & Topic */}
                      <div className="mt-3">
                        <h4 className="text-xs font-bold text-slate-900 leading-tight">
                          {day.title}
                        </h4>
                        <div className="mt-1 text-[11px] text-teal-700 font-medium">
                          Focus: {day.topic || day.subject}
                        </div>
                      </div>

                      {/* Task Checklist */}
                      <div className="mt-3 space-y-1.5 pt-2 border-t border-slate-100">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                          Daily Action Tasks:
                        </span>
                        {(day.tasks || []).map((task, tIdx) => {
                          const isDone = !!completedTasks[`${dIdx}-${tIdx}`];
                          return (
                            <div 
                              key={tIdx}
                              onClick={() => toggleTask(dIdx, tIdx)}
                              className={`flex items-start gap-2 p-2 rounded-lg text-xs cursor-pointer select-none transition-colors ${
                                isDone ? 'bg-slate-50 text-slate-400 line-through' : 'hover:bg-slate-50 text-slate-700'
                              }`}
                            >
                              <div className={`mt-0.5 w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${
                                isDone ? 'bg-teal-600 border-teal-600 text-white' : 'border-slate-300 bg-white'
                              }`}>
                                {isDone && <CheckCircle className="w-3 h-3" />}
                              </div>
                              <span className="text-[11px] leading-snug">{task}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Day Footer */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{day.study_hours} hrs</span>
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {day.subject || 'Engineering'}
                      </span>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Recommended Study Strategies & Tips */}
          {studyPlan?.tips && studyPlan.tips.length > 0 && (
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Recommended Study Strategies & Active Learning Tips
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                {studyPlan.tips.map((tip, idx) => (
                  <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-slate-700 leading-relaxed flex items-start gap-2">
                    <span className="text-teal-600 font-bold">•</span>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
