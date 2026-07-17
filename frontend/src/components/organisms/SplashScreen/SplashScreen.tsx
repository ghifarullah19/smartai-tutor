import React from 'react';
import { Sparkles } from 'lucide-react';
import { Spinner } from '../../atoms/Spinner';
import styles from './SplashScreen.module.css';

export const SplashScreen: React.FC = () => {
  return (
    <div className={styles['splash-container']}>
      <div className={styles['splash-content']}>
        <div className={styles['logo-wrapper']}>
          <Sparkles className={styles['logo-icon']} size={32} />
        </div>
        <h1 className={styles['app-name']}>PintarAI</h1>
        <p className={styles['app-tagline']}>Tutor Virtual AI Anda</p>
        <div className={styles['loader-wrapper']}>
          <Spinner size="md" />
          <span className={styles['loader-text']}>Memuat PintarAI...</span>
        </div>
      </div>
    </div>
  );
};
