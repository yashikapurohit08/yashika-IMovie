import React from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function AlertToast({ message, type = 'error', onClose }) {
  if (!message) return null;

  const isSuccess = type === 'success';

  return (
    <div className={`p-4 rounded-2xl border text-xs font-medium flex items-center justify-between gap-3 shadow-xl animate-in slide-in-from-top-2 duration-200 ${
      isSuccess
        ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200'
        : 'bg-rose-950/80 border-rose-500/50 text-rose-200'
    }`}>
      <div className="flex items-center gap-2.5">
        {isSuccess ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
        ) : (
          <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
        )}
        <span>{message}</span>
      </div>
      {onClose && (
        <button onClick={onClose} className="p-1 hover:opacity-80">
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
