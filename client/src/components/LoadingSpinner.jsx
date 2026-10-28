import React from 'react';
import { Film } from 'lucide-react';

export default function LoadingSpinner({ text = 'Loading cinema experience...' }) {
  return (
    <div className="w-full py-20 flex flex-col items-center justify-center gap-4 text-center">
      <div className="relative">
        <div className="w-14 h-14 rounded-full border-4 border-slate-800 border-t-red-600 animate-spin flex items-center justify-center" />
        <Film className="w-5 h-5 text-red-500 absolute inset-0 m-auto animate-pulse" />
      </div>
      <p className="text-xs font-semibold tracking-wide text-slate-400">{text}</p>
    </div>
  );
}
