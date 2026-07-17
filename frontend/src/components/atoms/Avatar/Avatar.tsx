import React from 'react';
import styles from './Avatar.module.css';

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
        return styles['avatar-sm'];
      case 'md':
        return styles['avatar-md'];
      case 'lg':
        return styles['avatar-lg'];
      default:
        return styles['avatar-md'];
    }
  };

  return (
    <div className={`${styles['avatar-container']} ${getSizeClass()}`}>
      {src ? (
        <img src={src} alt={name} className={styles['avatar-img']} />
      ) : (
        <span className={styles['avatar-initials']}>{getInitials(name)}</span>
      )}
    </div>
  );
};
