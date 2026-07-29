import React from 'react';
import { X, Trash2, ShieldAlert } from 'lucide-react';
import { useChatStore } from '../../../store/chatStore';

import { Button } from '../../atoms/Button';

export const SettingsModal: React.FC = () => {
  const { isSettingsOpen, toggleSettings, clearAllData } = useChatStore();

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
    <div className={"fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 dark:bg-slate-950/85 backdrop-blur-md p-4"} onClick={toggleSettings}>
      <div className={"w-full max-w-lg bg-white/60 dark:bg-slate-900/60 border border-white/40 dark:border-slate-700/40 rounded-2xl overflow-hidden shadow-2xl flex flex-col backdrop-blur-2xl transition-colors duration-300"} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={"flex items-center justify-between px-6 py-4 border-b border-slate-200/50 dark:border-slate-800/50 select-none"}>
          <h2 className={"text-base md:text-lg font-bold text-slate-800 dark:text-slate-100"}>Pengaturan Aplikasi</h2>
          <button onClick={toggleSettings} className={"p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-100 transition-colors duration-150"} aria-label="Tutup pengaturan">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className={"p-6 flex flex-col gap-6"}>


          {/* Clear Data */}
          <div className={"flex flex-col gap-3"}>
            <span className={"text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider select-none"}>Manajemen Data</span>
            <div className={"flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50/50 dark:bg-slate-950/30 border border-slate-200/50 dark:border-slate-800/30"}>
              <div className={"flex items-start gap-3 w-full"}>
                <ShieldAlert className={"text-amber-500 shrink-0 mt-0.5"} size={24} />
                <div className={"flex flex-col gap-1"}>
                  <h3 className={"text-sm font-semibold text-slate-700 dark:text-slate-200"}>Hapus Riwayat</h3>
                  <p className={"text-xs text-slate-400 dark:text-slate-500 leading-relaxed"}>
                    Menghapus seluruh percakapan yang disimpan secara lokal di browser Anda.
                  </p>
                </div>
              </div>
              <Button onClick={handleClearData} variant="secondary" className={"w-full md:w-auto shrink-0 bg-transparent border-red-200 hover:border-red-500 dark:border-red-900/30 dark:hover:border-red-600 dark:hover:bg-red-950/20 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 font-medium text-xs py-2 px-3"}>
                <Trash2 size={16} className="mr-2" />
                Hapus Semua Data
              </Button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className={"px-6 py-4 border-t border-slate-200/50 dark:border-slate-800/50 flex items-center justify-end"}>
          <Button onClick={toggleSettings} variant="primary" className={"px-6 py-2 text-sm"}>
            Selesai
          </Button>
        </div>
      </div>
    </div>
  );
};
