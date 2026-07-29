import React from 'react';

export interface ISkeletonProps {
  className?: string;
  width?: string;
  height?: string;
  circle?: boolean;
}

export const Skeleton: React.FC<ISkeletonProps> = ({
  className = '',
  width,
  height,
  circle = false,
}) => {
  const style: React.CSSProperties = {};
  if (width) style.width = width;
  if (height) style.height = height;

  return (
    <div
      style={style}
      className={`${"animate-pulse bg-slate-200 dark:bg-slate-800 rounded-lg h-4 w-full"} ${circle ? "rounded-full" : ''} ${className}`}
    />
  );
};
