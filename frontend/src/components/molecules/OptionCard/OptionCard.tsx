import React from 'react';

export interface IOptionCardProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

export const OptionCard: React.FC<IOptionCardProps> = ({
  label,
  selected,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${"w-full flex items-center justify-center p-4 rounded-xl border border-white/40 dark:border-slate-700/40 bg-white/30 dark:bg-slate-900/40 hover:bg-white/50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 backdrop-blur-xl shadow-sm transition-all duration-200 text-center select-none active:scale-[0.98] cursor-pointer"} ${selected ? "border-emerald-500 dark:border-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold shadow-md shadow-emerald-500/5 ring-1 ring-emerald-500" : ''}`}
    >
      <span className={"text-sm md:text-base"}>{label}</span>
    </button>
  );
};
