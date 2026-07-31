import React, { useState, useEffect } from 'react';
import { X, Save, Trash2, ShieldAlert } from 'lucide-react';
import { useChatStore } from '../../../store/chatStore';
import { useAuthStore } from '../../../store/authStore';
import { Button } from '../../atoms/Button';
import { API_URL } from '../../../config';

export const ProfileModal: React.FC = () => {
  const { isProfileOpen, toggleProfile } = useChatStore();
  const { user, token, updateUser, logout } = useAuthStore();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  if (!isProfileOpen) return null;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setIsSaving(true);
    setMessage(null);

    try {
      const payload: any = { name, email };
      if (password) payload.password = password;

      const response = await fetch(`${API_URL}/account`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Gagal memperbarui profil');
      }

      updateUser({ name: data.user.name, email: data.user.email });
      setPassword(''); // Clear password field after save
      setMessage({ text: 'Profil berhasil diperbarui!', type: 'success' });
      
      // Auto-hide message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      setMessage({ text: error.message, type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      'Apakah Anda yakin ingin menghapus akun Anda secara permanen? Semua data Anda akan hilang.'
    );
    if (confirmDelete) {
      try {
        const response = await fetch(`${API_URL}/account`, {
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
        toggleProfile();
        logout();
      } catch (error: any) {
        alert(error.message);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 dark:bg-slate-950/85 backdrop-blur-md p-4" onClick={toggleProfile}>
      <div className="w-full max-w-lg bg-white/60 dark:bg-slate-900/60 border border-white/40 dark:border-slate-700/40 rounded-2xl overflow-hidden shadow-2xl flex flex-col backdrop-blur-2xl transition-colors duration-300 max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200/50 dark:border-slate-800/50 select-none shrink-0">
          <h2 className="text-base md:text-lg font-bold text-slate-800 dark:text-slate-100">Profil Saya</h2>
          <button onClick={toggleProfile} className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-100 transition-colors duration-150" aria-label="Tutup profil">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col gap-6 overflow-y-auto">
          {message && (
            <div className={`p-3 rounded-lg text-sm font-medium ${message.type === 'success' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
              {message.text}
            </div>
          )}

          {/* Edit Profile Form */}
          <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Nama</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
                placeholder="Masukkan nama Anda"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
                placeholder="Masukkan email Anda"
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Password Baru <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">(Kosongkan jika tidak ingin mengubah)</span></label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
                placeholder="••••••••"
                minLength={6}
              />
            </div>
            
            <div className="flex justify-end mt-2">
              <Button type="submit" variant="primary" className="px-6 py-2 text-sm flex items-center" disabled={isSaving}>
                <Save size={16} className="mr-2" />
                {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Button>
            </div>
          </form>

          <hr className="border-slate-200 dark:border-slate-800 my-2" />

          {/* Delete Account */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider select-none">Zona Berbahaya</span>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50/50 dark:bg-slate-950/30 border border-red-200/50 dark:border-red-900/30">
              <div className="flex items-start gap-3 w-full">
                <ShieldAlert className="text-red-500 shrink-0 mt-0.5" size={24} />
                <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-semibold text-red-600 dark:text-red-400">Hapus Akun Permanen</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Semua data profil Anda di server akan dihapus secara permanen.
                  </p>
                </div>
              </div>
              <Button onClick={handleDeleteAccount} variant="secondary" className="w-full md:w-auto shrink-0 bg-transparent border-red-200 hover:border-red-500 dark:border-red-900/30 dark:hover:border-red-600 dark:hover:bg-red-950/20 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 font-medium text-xs py-2 px-3">
                <Trash2 size={16} className="mr-2" />
                Hapus Akun
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
