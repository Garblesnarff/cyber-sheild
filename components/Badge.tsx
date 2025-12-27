import React from 'react';
import { Severity } from '../types';

interface BadgeProps {
  severity?: Severity | string | null;
  children?: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({ severity, children }) => {
  let colorClass = 'bg-slate-800 text-slate-300 border-slate-700';

  switch (severity?.toString().toLowerCase()) {
    case 'critical':
      colorClass = 'bg-red-500/10 text-red-400 border-red-500/20';
      break;
    case 'high':
      colorClass = 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      break;
    case 'medium':
      colorClass = 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      break;
    case 'low':
      colorClass = 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      break;
    case 'safe':
      colorClass = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      break;
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClass}`}>
      {children || severity?.toUpperCase() || 'UNKNOWN'}
    </span>
  );
};

export default Badge;
