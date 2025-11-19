import React from 'react';

interface SessionTimerProps {
  duration: number; // en millisecondes
  isActive: boolean;
  maxDuration?: number; // 20 minutes par défaut
}

const SessionTimer: React.FC<SessionTimerProps> = ({ 
  duration, 
  isActive,
  maxDuration = 20 * 60 * 1000 // 20 minutes
}) => {
  const minutes = Math.floor(duration / 60000);
  const seconds = Math.floor((duration % 60000) / 1000);
  
  const percentage = (duration / maxDuration) * 100;
  const isNearEnd = percentage > 75; // Plus de 15 minutes
  const isOvertime = duration > maxDuration;
  
  const getColorClass = () => {
    if (isOvertime) return 'text-red-600';
    if (isNearEnd) return 'text-orange-600';
    return 'text-orange-500';
  };
  
  const getBgClass = () => {
    if (isOvertime) return 'bg-red-100';
    if (isNearEnd) return 'bg-orange-100';
    return 'bg-orange-50';
  };

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${getBgClass()} transition-colors`}>
      <svg 
        className={`w-5 h-5 ${getColorClass()} ${isActive ? 'animate-pulse' : ''}`} 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
        />
      </svg>
      <span className={`font-mono text-sm font-semibold ${getColorClass()}`}>
        {minutes}:{seconds.toString().padStart(2, '0')}
      </span>
      {isOvertime && (
        <span className="text-xs text-red-600 font-medium">
          (dépassé)
        </span>
      )}
    </div>
  );
};

export default SessionTimer;
