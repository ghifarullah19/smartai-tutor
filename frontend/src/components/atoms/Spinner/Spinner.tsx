import React from 'react';

export interface ISpinnerProps {
  size?: 'sm' | 'md';
}

export const Spinner: React.FC<ISpinnerProps> = ({ size = 'md' }) => {
  const getSizeClass = () => {
    return size === 'sm' ? "w-4 h-4" : "w-6 h-6";
  };

  return (
    <div className={"flex items-center justify-center"}>
      <div className={`${"rounded-full border-2 border-slate-200 dark:border-slate-700 border-t-emerald-500 animate-spin"} ${getSizeClass()}`}></div>
    </div>
  );
};
