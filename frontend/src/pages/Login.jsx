import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  ArrowRight, 
  ShieldCheck, 
  Cpu, 
  Sparkles, 
  UserCheck 
} from 'lucide-react';

export const Login = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [studentId, setStudentId] = useState('STU1024');
  const [password, setPassword] = useState('demo123');

  const handleLogin = (e) => {
    e?.preventDefault();
    if (onLoginSuccess) {
      onLoginSuccess();
    }
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-100">
      
      {/* Brand & Intro */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="inline-flex p-3 bg-teal-600 rounded-xl text-white shadow-lg shadow-teal-500/20">
          <GraduationCap className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          EduAnalytics AI
        </h1>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          AI-Driven Student Performance Prediction & Personalized Learning System
        </p>
      </div>

      {/* Main Login Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-800/90 py-8 px-6 shadow-xl border border-slate-700/80 sm:rounded-2xl sm:px-10 space-y-6">
          
          <div className="space-y-1">
            <h2 className="text-base font-semibold text-white">Student Portal Access</h2>
            <p className="text-xs text-slate-400">
              Sign in to view predictive analytics, model explainability, and AI study schedules.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Student ID / Roll Number
              </label>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-teal-600 hover:bg-teal-500 rounded-lg text-xs font-semibold text-white shadow-sm transition-colors"
            >
              <span>Sign In to Student Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Instant Access */}
          <div className="pt-4 border-t border-slate-700/60">
            <button
              type="button"
              onClick={handleLogin}
              className="w-full py-2.5 px-4 bg-slate-700/80 hover:bg-slate-700 border border-slate-600/60 rounded-lg text-xs font-medium text-slate-200 flex items-center justify-center gap-2 transition-colors"
            >
              <UserCheck className="w-4 h-4 text-teal-400" />
              <span>Instant Demo Access (Anuj Dubey - STU1024)</span>
            </button>
          </div>

          {/* Architecture badges */}
          <div className="pt-2 text-[11px] text-slate-400 space-y-1.5 text-center">
            <div className="flex items-center justify-center gap-3 text-slate-300">
              <span className="flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-teal-400" />
                Random Forest ML
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                Google Gemini GenAI
              </span>
            </div>
            <p className="text-[10px] text-slate-500">
              Generative AI Course Project & Technical Interview Showcase
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};
