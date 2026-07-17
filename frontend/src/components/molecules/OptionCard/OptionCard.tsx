import React from 'react';
import styles from './OptionCard.module.css';

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
      className={`${styles['option-card']} ${selected ? styles['option-card-selected'] : ''}`}
    >
      <span className={styles['option-label']}>{label}</span>
    </button>
  );
};
