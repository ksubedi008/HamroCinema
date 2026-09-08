import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { AlertTriangle } from 'lucide-react';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="min-h-screen bg-[#07040a] text-white flex flex-col items-center justify-center font-sans relative overflow-hidden p-6">
      {/* Anti-Gravity Background FX */}
      <div className="bg-noise"></div>
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-red-900/20 blur-[120px] animate-ambient-glow"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-orange-900/10 blur-[120px] animate-ambient-glow" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 max-w-lg w-full bg-[#0d0914]/80 backdrop-blur-2xl border border-red-500/30 rounded-3xl p-10 shadow-[0_0_50px_rgba(239,68,68,0.15)] flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(239,68,68,0.3)]">
          <AlertTriangle className="w-10 h-10 text-red-500" />
        </div>
        
        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400 mb-2">System Malfunction</h1>
        <p className="text-gray-400 mb-8 font-medium">A critical error has occurred in the interface. Our sensors have logged the issue.</p>
        
        <div className="bg-black/50 border border-red-900/50 rounded-xl p-4 w-full text-left mb-8 overflow-x-auto max-h-32 scrollbar-thin scrollbar-thumb-red-900">
          <pre className="text-red-300 text-xs font-mono">{error.message}</pre>
        </div>

        <button 
          onClick={resetErrorBoundary}
          className="w-full relative group overflow-hidden px-8 py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold tracking-wider shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:shadow-[0_0_25px_rgba(239,68,68,0.6)] transition-all duration-300"
        >
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
          <span className="relative z-10">
            {window.location.pathname.startsWith('/admin') ? 'Return to Command Center' : 'Return to Home'}
          </span>
        </button>
      </div>
    </div>
  );
}

const GlobalErrorBoundary = ({ children }) => {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        if (window.location.pathname.startsWith('/admin')) {
          window.location.href = '/admin/dashboard';
        } else {
          window.location.href = '/';
        }
      }}
    >
      {children}
    </ErrorBoundary>
  );
};

export default GlobalErrorBoundary;
