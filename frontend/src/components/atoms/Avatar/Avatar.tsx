import React from 'react';

export interface IAvatarProps {
  name?: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Avatar: React.FC<IAvatarProps> = ({
  name = 'Siswa',
  src,
  size = 'md',
}) => {
  const getInitials = (n: string) => {
    return n.trim().substring(0, 1).toUpperCase() || '?';
  };

  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return "w-8 h-8";
      case 'md':
        return "w-10 h-10";
      case 'lg':
        return "w-16 h-16";
      default:
        return "w-10 h-10";
    }
  };

  return (
    <div className={`${"flex items-center justify-center rounded-full bg-emerald-600 border border-slate-200/50 dark:border-slate-700/50 overflow-hidden select-none shrink-0 shadow-sm backdrop-blur-xl"} ${getSizeClass()}`}>
      {src ? (
        <img src={src} alt={name} className={"w-full h-full object-cover"} />
      ) : (
        <span className={"text-white font-bold tracking-wider text-xs text-sm text-xl"}>{getInitials(name)}</span>
      )}
    </div>
  );
};
