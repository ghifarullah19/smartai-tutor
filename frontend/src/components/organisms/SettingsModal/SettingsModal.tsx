import React from 'react';
import { X, Trash2, ShieldAlert, Sun, Moon } from 'lucide-react';
import { useChatStore } from '../../../store/chatStore';
import { useAuthStore } from '../../../store/authStore';
import { Button } from '../../atoms/Button';
import styles from './SettingsModal.module.css';

export const SettingsModal: React.FC = () => {
  const { isSettingsOpen, toggleSettings, clearAllData, theme, toggleTheme } = useChatStore();
  const { token, logout } = useAuthStore();

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

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      'Apakah Anda yakin ingin menghapus akun Anda secara permanen? Semua data Anda akan hilang.'
    );
    if (confirmDelete) {
      try {
        const response = await fetch('http://localhost:5000/account', {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Gagal menghapus akun');
        }
        alert('Akun berhasil dihapus.');
        logout();
      } catch (error: any) {
        alert(error.message);
      }
    }
  };

  return (
    <div className={styles['overlay']} onClick={toggleSettings}>
      <div className={styles['modal']} onClick={(e) => e.stopPropagation()}>
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
                  <h3 className={styles['info-title']}>Hapus Riwayat</h3>
                  <p className={styles['info-desc']}>
                    Menghapus seluruh percakapan yang disimpan secara lokal di browser Anda.
                  </p>
                </div>
              </div>
              <Button onClick={handleClearData} variant="secondary" className={styles['clear-btn']}>
                <Trash2 size={16} className="mr-2" />
                Hapus Semua Data
              </Button>
            </div>
          </div>

          {/* Delete Account */}
          <div className={styles['settings-group']}>
            <span className={styles['group-label']}>Akun Pengguna</span>
            <div className={styles['data-settings']}>
              <div className={styles['data-info']}>
                <ShieldAlert className={styles['alert-icon']} size={24} style={{ color: '#ef4444' }} />
                <div className={styles['info-text']}>
                  <h3 className={styles['info-title']}>Hapus Akun Permanen</h3>
                  <p className={styles['info-desc']}>
                    Semua data profil Anda di server akan dihapus secara permanen.
                  </p>
                </div>
              </div>
              <Button onClick={handleDeleteAccount} variant="secondary" className={styles['clear-btn']} style={{ borderColor: '#ef4444', color: '#ef4444' }}>
                <Trash2 size={16} className="mr-2" />
                Hapus Akun
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
