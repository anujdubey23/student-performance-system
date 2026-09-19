import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Activity, 
  BookOpen, 
  CalendarDays, 
  FileSpreadsheet, 
  GraduationCap,
  Cpu,
  Sparkles
} from 'lucide-react';

export const Sidebar = () => {
  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/performance', label: 'Performance', icon: Activity },
    { to: '/subjects', label: 'Subjects', icon: BookOpen },
    { to: '/study-plan', label: 'AI Study Plan', icon: CalendarDays },
    { to: '/reports', label: 'Reports', icon: FileSpreadsheet },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-200 flex flex-col min-h-screen border-r border-slate-800 shrink-0 no-print">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 gap-3 border-b border-slate-800">
        <div className="p-2 bg-teal-600 rounded-lg text-white">
          <GraduationCap className="w-5 h-5" />
        </div>
        <div>
          <span className="font-semibold text-sm tracking-tight text-white block">EduAnalytics AI</span>
          <span className="text-[10px] text-slate-400 block font-mono">RandomForest + Gemini</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-6 px-3 space-y-1">
        <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Student Portal
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Architecture Indicator Box */}
      <div className="p-4 m-3 bg-slate-800/80 rounded-xl border border-slate-700/60 text-xs">
        <div className="flex items-center gap-2 text-teal-400 font-semibold mb-1.5">
          <Cpu className="w-3.5 h-3.5" />
          <span>System Pipeline</span>
        </div>
        <p className="text-slate-400 text-[11px] leading-relaxed">
          <strong className="text-slate-200">ML:</strong> Random Forest Classifier (83% acc)
          <br />
          <strong className="text-slate-200">GenAI:</strong> Gemini 1.5 Flash (Feedback & Timetable)
        </p>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
        <span>B.Tech GenAI Capstone</span>
        <span className="font-mono text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">v1.0</span>
      </div>
    </aside>
  );
};
