import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  ArrowRight, 
  ShieldCheck, 
  Cpu, 
  Sparkles, 
  UserCheck, 
  AlertCircle,
  FileEdit,
  KeyRound
} from 'lucide-react';

export const Login = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e?.preventDefault();
    setError('');

    const cleanId = studentId.trim().toUpperCase();
    const cleanPass = password.trim();

    if (!cleanId || !cleanPass) {
      setError('Please enter both Student ID and Password.');
      return;
    }

    // Authenticate demo accounts
    if ((cleanId === 'STU1024' || cleanId === 'ANUJ') && (cleanPass === 'password123' || cleanPass === 'demo123')) {
      if (onLoginSuccess) {
        onLoginSuccess();
      }
      navigate('/');
    } else {
      setError("Invalid Student ID or Password. Use registered Demo Account (STU1024 / password123) or click 'Enter Fresh Student Data' below.");
    }
  };

  const handleInstantDemo = () => {
    setStudentId('STU1024');
    setPassword('password123');
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

      {/* Main Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-800/90 py-8 px-6 shadow-xl border border-slate-700/80 sm:rounded-2xl sm:px-10 space-y-6">
          
          <div className="space-y-1">
            <h2 className="text-base font-semibold text-white">Student Portal Access</h2>
            <p className="text-xs text-slate-400">
              Sign in with your student credentials or enter fresh academic data.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-rose-500/15 border border-rose-500/30 rounded-lg text-xs text-rose-300 flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Student ID / Roll Number
              </label>
              <input
                type="text"
                placeholder="e.g. STU1024"
                value={studentId}
                onChange={(e) => {
                  setStudentId(e.target.value);
                  setError('');
                }}
                className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="e.g. password123"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
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

          {/* Prominent Fresh Data Entry Option */}
          <div className="pt-4 border-t border-slate-700/60 space-y-3">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-center">
              Or Choose An Option Below
            </div>

            {/* Option 1: Enter Fresh Student Data */}
            <button
              type="button"
              onClick={() => navigate('/data-entry')}
              className="w-full py-2.5 px-4 bg-teal-900/40 hover:bg-teal-900/60 border border-teal-500/40 rounded-lg text-xs font-bold text-teal-300 flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <FileEdit className="w-4 h-4 text-teal-400" />
              <span>Enter Fresh Student Data & Subject Marks</span>
            </button>

            {/* Option 2: Instant Demo */}
            <button
              type="button"
              onClick={handleInstantDemo}
              className="w-full py-2 px-4 bg-slate-700/60 hover:bg-slate-700 border border-slate-600/50 rounded-lg text-xs font-medium text-slate-300 flex items-center justify-center gap-2 transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5 text-slate-400" />
              <span>Explore Demo Profile (Anuj Dubey - STU1024)</span>
            </button>
          </div>

          {/* Credentials Helper Box */}
          <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-700/50 text-[11px] text-slate-400 space-y-1">
            <div className="text-slate-300 font-semibold flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-teal-400" />
              <span>Registered Demo Credentials:</span>
            </div>
            <div>Student ID: <code className="text-teal-300 font-mono">STU1024</code> | Password: <code className="text-teal-300 font-mono">password123</code></div>
          </div>

        </div>
      </div>

    </div>
  );
};
