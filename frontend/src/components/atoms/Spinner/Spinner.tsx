import React from 'react';
import styles from './Spinner.module.css';

export interface ISpinnerProps {
  size?: 'sm' | 'md';
}

export const Spinner: React.FC<ISpinnerProps> = ({ size = 'md' }) => {
  const getSizeClass = () => {
    return size === 'sm' ? styles['spinner-sm'] : styles['spinner-md'];
  };

  return (
    <div className={styles['spinner-container']}>
      <div className={`${styles['spinner-ring']} ${getSizeClass()}`}></div>
    </div>
  );
};
