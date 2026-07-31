import React, { useState, useRef, useEffect } from 'react';
import { User, Settings, LogOut, Sun, Moon } from 'lucide-react';
import { useChatStore } from '../../../store/chatStore';
import { useAuthStore } from '../../../store/authStore';

export const ProfileMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  const { theme, setTheme, toggleSettings, toggleProfile, clearAllData } = useChatStore();
  const { logout } = useAuthStore();

  const toggleMenu = () => setIsOpen(!isOpen);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleAction = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={toggleMenu}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all duration-200 shadow-sm"
        aria-label="Menu Profil"
      >
        <User size={18} className="text-slate-600 dark:text-slate-300" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden z-50 transform origin-top-right transition-all duration-200 animate-in fade-in slide-in-from-top-2">
          <div className="py-2">
            <button
              onClick={() => handleAction(toggleProfile)}
              className="flex items-center w-full px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <User size={16} className="mr-3 text-slate-500" />
              Profil Saya
            </button>
            <button
              onClick={() => handleAction(() => setTheme(theme === 'dark' ? 'light' : 'dark'))}
              className="flex items-center w-full px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {theme === 'dark' ? (
                <>
                  <Sun size={16} className="mr-3 text-amber-500" />
                  Mode Terang
                </>
              ) : (
                <>
                  <Moon size={16} className="mr-3 text-slate-500" />
                  Mode Gelap
                </>
              )}
            </button>
            <button
              onClick={() => handleAction(toggleSettings)}
              className="flex items-center w-full px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Settings size={16} className="mr-3 text-slate-500" />
              Pengaturan
            </button>
            <div className="border-t border-slate-200 dark:border-slate-800 my-1"></div>
            <button
              onClick={() => handleAction(() => {
                clearAllData();
                logout();
              })}
              className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors font-medium"
            >
              <LogOut size={16} className="mr-3" />
              Keluar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
