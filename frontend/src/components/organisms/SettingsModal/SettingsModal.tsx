import React from 'react';
import { X, Trash2, ShieldAlert, Sun, Moon } from 'lucide-react';
import { useChatStore } from '../../../store/chatStore';
import { Button } from '../../atoms/Button';
import styles from './SettingsModal.module.css';

export const SettingsModal: React.FC = () => {
  const { isSettingsOpen, toggleSettings, clearAllData, theme, toggleTheme } = useChatStore();

  if (!isSettingsOpen) return null;

  const handleClearData = () => {
    const confirmClear = window.confirm(
      'Apakah Anda yakin ingin menghapus semua riwayat belajar? Tindakan ini tidak dapat dibatalkan.'
    );
    if (confirmClear) {
      clearAllData();
      alert('Semua data berhasil dihapus.');
    }
  };

  return (
    <div className={styles['modal-backdrop']} onClick={toggleSettings}>
      <div className={styles['modal-container']} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles['modal-header']}>
          <h2 className={styles['modal-title']}>Pengaturan Aplikasi</h2>
          <button onClick={toggleSettings} className={styles['close-btn']} aria-label="Tutup pengaturan">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className={styles['modal-body']}>
          {/* Theme Selector */}
          <div className={styles['settings-group']}>
            <span className={styles['group-label']}>Tema Tampilan</span>
            <div className={styles['theme-settings']}>
              <button
                type="button"
                onClick={() => { if (theme === 'dark') toggleTheme(); }}
                className={`${styles['theme-option']} ${theme === 'light' ? styles['theme-option-active'] : ''}`}
              >
                <Sun size={16} className="mr-2" />
                Mode Terang
              </button>
              <button
                type="button"
                onClick={() => { if (theme === 'light') toggleTheme(); }}
                className={`${styles['theme-option']} ${theme === 'dark' ? styles['theme-option-active'] : ''}`}
              >
                <Moon size={16} className="mr-2" />
                Mode Gelap
              </button>
            </div>
          </div>

          {/* Clear Data */}
          <div className={styles['settings-group']}>
            <span className={styles['group-label']}>Manajemen Data</span>
            <div className={styles['data-settings']}>
              <div className={styles['data-info']}>
                <ShieldAlert className={styles['alert-icon']} size={24} />
                <div className={styles['info-text']}>
                  <h3 className={styles['info-title']}>Hapus Riwayat & Pengaturan</h3>
                  <p className={styles['info-desc']}>
                    Menghapus seluruh percakapan yang disimpan pada browser Anda (`localStorage`) dan mereset ID sesi.
                  </p>
                </div>
              </div>
              <Button onClick={handleClearData} variant="secondary" className={styles['clear-btn']}>
                <Trash2 size={16} className="mr-2" />
                Hapus Semua Data
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={styles['modal-footer']}>
          <Button onClick={toggleSettings} variant="primary" className={styles['save-btn']}>
            Selesai
          </Button>
        </div>
      </div>
    </div>
  );
};
