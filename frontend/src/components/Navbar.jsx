import React from 'react';
import { Sparkles, UserCheck, Edit3, LogOut, CheckCircle2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Navbar = ({ 
  title, 
  subtitle, 
  student, 
  healthStatus, 
  onOpenForm 
}) => {
  const navigate = useNavigate();

  const isLiveAI = healthStatus?.gemini_api_configured;

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0 no-print">
      {/* Title section */}
      <div>
        <h1 className="text-lg font-semibold text-slate-900 tracking-tight">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-4">
        {/* Backend & AI status pill */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs">
          <div className="flex items-center gap-1.5 font-medium text-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>ML Engine Active</span>
          </div>
          <span className="text-slate-300">|</span>
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span className="text-slate-600 font-medium">
              {isLiveAI ? 'Gemini Live' : 'Demo Fallback'}
            </span>
          </div>
        </div>

        {/* Update Student Data Action */}
        <button
          onClick={onOpenForm}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-colors shadow-sm"
        >
          <Edit3 className="w-3.5 h-3.5 text-teal-600" />
          <span>Edit Student Data</span>
        </button>

        {/* Student Profile Badge */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
          <div className="w-9 h-9 rounded-full bg-slate-800 text-white flex items-center justify-center font-medium text-xs">
            {student?.student_name ? student.student_name.split(' ').map(n => n[0]).join('') : 'AD'}
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-semibold text-slate-900 leading-tight">
              {student?.student_name || 'Anuj Dubey'}
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              {student?.student_id || 'STU1024'}
            </div>
          </div>
        </div>

        {/* Logout / Switch page */}
        <button
          onClick={() => navigate('/login')}
          title="Switch Student / Sign Out"
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
