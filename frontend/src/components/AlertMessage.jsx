import React from 'react';

const AlertMessage = ({ message, type = 'error' }) => {
  if (!message) return null;

  let containerClass = "p-4 rounded-lg flex items-center gap-3 text-sm font-medium tracking-wide ";
  let icon = null;

  switch (type) {
    case 'error':
      containerClass += "bg-red-950/30 border border-red-900/50 text-red-200";
      icon = (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      );
      break;
    case 'success':
      containerClass += "bg-emerald-950/30 border border-emerald-900/50 text-emerald-200";
      icon = (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
        </svg>
      );
      break;
    case 'info':
    default:
      containerClass += "bg-[#1A1A1A] border border-neutral-800 text-neutral-300";
      icon = (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
      break;
  }

  return (
    <div className={containerClass}>
      {icon}
      <span>{message}</span>
    </div>
  );
};

export default AlertMessage;
