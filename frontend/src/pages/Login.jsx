import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  ArrowRight, 
  Mail, 
  Lock, 
  User, 
  Sparkles, 
  UserCheck, 
  AlertCircle,
  FileEdit,
  KeyRound
} from 'lucide-react';

export const Login = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Email validation regex
  const isValidEmail = (emailStr) => {
    return /\S+@\S+\.\S+/.test(emailStr);
  };

  // Helper to extract a readable name from an email if not typed
  const deriveNameFromEmail = (emailStr) => {
    try {
      const username = emailStr.split('@')[0];
      const parts = username.replace(/[._-]+/g, ' ').trim().split(' ');
      return parts
        .map(p => p.charAt(0).toUpperCase() + p.slice(1))
        .join(' ');
    } catch {
      return 'Student';
    }
  };

  const handleLogin = (e) => {
    e?.preventDefault();
    setError('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanEmail || !cleanPass) {
      setError('Please enter both Email and Password.');
      return;
    }

    if (!isValidEmail(cleanEmail)) {
      setError('Please enter a valid email address (e.g. yourname@college.edu).');
      return;
    }

    if (cleanPass.length < 4) {
      setError("Password must be at least 4 characters long.");
      return;
    }

    // Determine student name & student id
    let finalName = fullName.trim();
    let finalId = 'STU' + Math.floor(1000 + Math.random() * 9000);

    if (cleanEmail === 'anuj.dubey@college.edu' || cleanEmail === 'anuj@gmail.com') {
      finalName = finalName || 'Anuj Dubey';
      finalId = 'STU1024';
    } else {
      finalName = finalName || deriveNameFromEmail(cleanEmail);
    }

    if (onLoginSuccess) {
      onLoginSuccess({
        student_name: finalName,
        student_id: finalId,
        email: cleanEmail
      });
    }

    navigate('/');
  };

  // Quick autofill demo credentials for Anuj Dubey
  const fillDemoCredentials = () => {
    setFullName('Anuj Dubey');
    setEmail('anuj.dubey@college.edu');
    setPassword('password123');
    setError('');
  };

  const handleInstantDemo = () => {
    if (onLoginSuccess) {
      onLoginSuccess({
        student_name: 'Anuj Dubey',
        student_id: 'STU1024',
        email: 'anuj.dubey@college.edu'
      });
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
            <h2 className="text-base font-semibold text-white">Student Portal Sign In</h2>
            <p className="text-xs text-slate-400">
              Enter your name and credentials to load your personalized academic dashboard.
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
            {/* Student Full Name */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Your Full Name <span className="text-slate-500">(e.g. Rahul Sharma)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    setError('');
                  }}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-900/80 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Student Email Address <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  placeholder="e.g. student@college.edu"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-900/80 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Password <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-900/80 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-teal-600 hover:bg-teal-500 rounded-lg text-xs font-semibold text-white shadow-sm transition-colors"
            >
              <span>Sign In to My Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Credentials Autofill Helper */}
          <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-700/60 flex items-center justify-between gap-2 text-xs">
            <div className="text-[11px] text-slate-400">
              <span className="text-slate-300 font-semibold block">Demo Account:</span>
              <code className="text-teal-300 text-[10px]">Anuj Dubey (anuj.dubey@college.edu)</code>
            </div>
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="px-2.5 py-1 bg-teal-900/40 hover:bg-teal-900/70 text-teal-300 border border-teal-600/40 rounded text-[11px] font-medium transition-colors shrink-0"
            >
              Auto-Fill
            </button>
          </div>

          {/* Alternative Quick Entry Options */}
          <div className="pt-2 border-t border-slate-700/60 space-y-2.5">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-center">
              Quick Options
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
              <span>Instant Access as Anuj Dubey</span>
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};
