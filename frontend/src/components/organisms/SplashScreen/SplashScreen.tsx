import React from 'react';
import { Sparkles } from 'lucide-react';
import { Spinner } from '../../atoms/Spinner';

export const SplashScreen: React.FC = () => {
  return (
    <div className={"fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors duration-300"}>
      <div className={"flex flex-col items-center text-center select-none"}>
        <div className={"flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-600 shadow-xl shadow-emerald-600/25 mb-4"}>
          <Sparkles className={"text-white"} size={32} />
        </div>
        <h1 className={"text-3xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100"}>PintarAI</h1>
        <p className={"text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mt-1.5 mb-8"}>Tutor Virtual AI Anda</p>
        <div className={"flex items-center gap-3 bg-white/40 dark:bg-slate-900/40 border border-white/40 dark:border-slate-700/40 py-2.5 px-4 rounded-full backdrop-blur-xl shadow-lg"}>
          <Spinner size="md" />
          <span className={"text-xs text-slate-600 dark:text-slate-400 font-medium"}>Memuat PintarAI...</span>
        </div>
      </div>
    </div>
  );
};
