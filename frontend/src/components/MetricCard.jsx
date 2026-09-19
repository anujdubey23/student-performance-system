import React from 'react';

export const MetricCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  badge, 
  trend, 
  accent = 'slate',
  progress
}) => {
  const accentBorder = {
    slate: 'border-slate-200 hover:border-slate-300',
    teal: 'border-teal-200 hover:border-teal-300',
    indigo: 'border-indigo-200 hover:border-indigo-300',
    amber: 'border-amber-200 hover:border-amber-300',
    rose: 'border-rose-200 hover:border-rose-300',
  }[accent] || 'border-slate-200 hover:border-slate-300';

  const iconBg = {
    slate: 'bg-slate-100 text-slate-700',
    teal: 'bg-teal-50 text-teal-700',
    indigo: 'bg-indigo-50 text-indigo-700',
    amber: 'bg-amber-50 text-amber-700',
    rose: 'bg-rose-50 text-rose-700',
  }[accent] || 'bg-slate-100 text-slate-700';

  return (
    <div className={`bg-white rounded-xl p-5 border ${accentBorder} shadow-sm transition-all duration-150`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900">{value}</span>
            {badge && <div>{badge}</div>}
          </div>
        </div>
        {Icon && (
          <div className={`p-2.5 rounded-lg ${iconBg}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {progress !== undefined && (
        <div className="mt-3">
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div 
              className={`h-full rounded-full ${progress >= 75 ? 'bg-teal-600' : progress >= 60 ? 'bg-indigo-600' : 'bg-rose-500'}`}
              style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
            />
          </div>
        </div>
      )}

      {(subtitle || trend) && (
        <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
          <span>{subtitle}</span>
          {trend && (
            <span className={trend.positive ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}>
              {trend.text}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
