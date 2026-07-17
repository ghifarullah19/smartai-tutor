import React from 'react';
import styles from './Skeleton.module.css';

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
      className={`${styles['skeleton']} ${circle ? styles['skeleton-circle'] : ''} ${className}`}
    />
  );
};
