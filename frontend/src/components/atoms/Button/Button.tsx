import React from 'react';
import styles from './Button.module.css';

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
        return styles['btn-primary'];
      case 'secondary':
        return styles['btn-secondary'];
      case 'flat':
        return styles['btn-flat'];
      default:
        return styles['btn-primary'];
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${styles['btn-base']} ${getVariantClass()} ${className}`}
    >
      {children}
    </button>
  );
};
