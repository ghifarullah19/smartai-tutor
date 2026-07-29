import React from 'react';
import { Plus, Trash2, Settings, X, MessageSquare, LogOut } from 'lucide-react';
import { useChatStore } from '../../../store/chatStore';
import { useAuthStore } from '../../../store/authStore';
import { Button } from '../../atoms/Button';
import { SearchBar } from '../../molecules/SearchBar';
import styles from './Sidebar.module.css';

export const Sidebar: React.FC = () => {
  const {
    chats,
    activeChatId,
    searchQuery,
    isSidebarOpen,
    createNewChat,
    selectChat,
    deleteChat,
    setSearchQuery,
    toggleSidebar,
    toggleSettings,
  } = useChatStore();

  const logout = useAuthStore((state) => state.logout);

  const filteredChats = chats.filter((chat) =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside className={`${styles['sidebar']} ${isSidebarOpen ? styles['sidebar-open'] : ''}`}>
      <div className={styles['sidebar-header']}>
        <Button onClick={createNewChat} variant="primary" className={styles['new-chat-btn']}>
          <Plus size={16} className="mr-2" />
          Chat Baru
        </Button>
        <button onClick={toggleSidebar} className={styles['close-sidebar-btn']} aria-label="Tutup sidebar">
          <X size={20} />
        </button>
      </div>

      <div className={styles['search-wrapper']}>
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>

      <div className={styles['chat-list-container']}>
        <span className={styles['list-title']}>Riwayat Obrolan</span>
        <div className={styles['chat-list']}>
          {filteredChats.length === 0 ? (
            <p className={styles['empty-list']}>Tidak ada riwayat obrolan</p>
          ) : (
            filteredChats.map((chat) => {
              const isActive = chat.id === activeChatId;
              return (
                <div
                  key={chat.id}
                  onClick={() => selectChat(chat.id)}
                  className={`${styles['chat-item']} ${isActive ? styles['chat-item-active'] : ''}`}
                >
                  <MessageSquare size={16} className={styles['chat-icon']} />
                  <span className={styles['chat-title']}>{chat.title}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteChat(chat.id);
                    }}
                    className={styles['delete-btn']}
                    title="Hapus Chat"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className={styles['sidebar-footer']}>
        <button onClick={toggleSettings} className={styles['settings-btn']}>
          <Settings size={16} className="mr-2" />
          Pengaturan
        </button>
        <button onClick={logout} className={styles['settings-btn']} style={{ marginTop: '0.5rem', color: '#ef4444' }}>
          <LogOut size={16} className="mr-2" />
          Keluar
        </button>
      </div>
    </aside>
  );
};
