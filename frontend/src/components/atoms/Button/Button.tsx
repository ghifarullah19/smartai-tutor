import React from 'react';

export interface IButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: 'primary' | 'secondary' | 'flat';
  type?: 'button' | 'submit';
  disabled?: boolean;
  className?: string;
}

export const Button: React.FC<IButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  type = 'button',
  disabled = false,
  className = '',
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'primary':
        return "bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-4 py-2 shadow-lg shadow-emerald-600/20 active:scale-[0.98]";
      case 'secondary':
        return "bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-200/80 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-200 rounded-lg px-4 py-2 active:scale-[0.98]";
      case 'flat':
        return "bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 rounded-lg px-3 py-1.5";
      default:
        return "bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-4 py-2 shadow-lg shadow-emerald-600/20 active:scale-[0.98]";
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${"flex items-center justify-center font-medium transition-all duration-200 outline-none select-none disabled:opacity-50 disabled:cursor-not-allowed"} ${getVariantClass()} ${className}`}
    >
      {children}
    </button>
  );
};
