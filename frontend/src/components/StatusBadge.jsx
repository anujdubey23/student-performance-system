import React from 'react';

export const StatusBadge = ({ status, size = 'normal', showDot = true }) => {
  const normalized = (status || '').toLowerCase().trim();

  let colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';
  let dotColor = 'bg-slate-400';

  if (normalized.includes('high') || normalized === 'strong' || normalized === 'good') {
    colorClasses = 'bg-emerald-50 text-emerald-800 border-emerald-200';
    dotColor = 'bg-emerald-500';
  } else if (normalized.includes('average') || normalized === 'moderate') {
    colorClasses = 'bg-blue-50 text-blue-800 border-blue-200';
    dotColor = 'bg-blue-500';
  } else if (normalized.includes('risk') || normalized.includes('critical') || normalized.includes('attention')) {
    colorClasses = 'bg-rose-50 text-rose-800 border-rose-200';
    dotColor = 'bg-rose-500';
  }

  const sizeClasses = size === 'small' 
    ? 'text-xs px-2 py-0.5' 
    : size === 'large' 
      ? 'text-sm font-semibold px-3.5 py-1.5' 
      : 'text-xs font-medium px-2.5 py-1';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${colorClasses} ${sizeClasses}`}>
      {showDot && <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />}
      <span>{status || 'Unknown'}</span>
    </span>
  );
};
