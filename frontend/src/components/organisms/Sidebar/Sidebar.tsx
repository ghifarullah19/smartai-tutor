import React from 'react';
import { Plus, Trash2, X, MessageSquare } from 'lucide-react';
import { useChatStore } from '../../../store/chatStore';
import { Button } from '../../atoms/Button';
import { SearchBar } from '../../molecules/SearchBar';

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
  } = useChatStore();

  const filteredChats = chats.filter((chat) =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside className={`${"fixed top-0 bottom-0 left-0 z-40 flex flex-col w-[260px] bg-white/60 border-r border-slate-200/50 dark:bg-slate-950/60 dark:border-slate-800/50 backdrop-blur-2xl transform -translate-x-full md:translate-x-0 md:relative md:bg-white/40 md:dark:bg-slate-950/40 transition-all duration-300 ease-in-out shadow-[4px_0_24px_rgba(0,0,0,0.02)] dark:shadow-[4px_0_24px_rgba(0,0,0,0.2)]"} ${isSidebarOpen ? "translate-x-0" : ''}`}>
      <div className={"flex items-center justify-between p-4 shrink-0"}>
        <Button onClick={createNewChat} variant="primary" className={"w-full justify-start py-2.5 px-4 text-sm font-medium"}>
          <Plus size={16} className="mr-2" />
          Chat Baru
        </Button>
        <button onClick={toggleSidebar} className={"flex items-center justify-center p-2 rounded-lg text-slate-400 dark:text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-900 hover:text-slate-800 dark:hover:text-slate-100 md:hidden ml-2"} aria-label="Tutup sidebar">
          <X size={20} />
        </button>
      </div>

      <div className={"px-4 py-2 shrink-0"}>
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>

      <div className={"flex flex-col flex-1 min-h-0 px-2 py-4 overflow-hidden"}>
        <span className={"px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 select-none"}>Riwayat Obrolan</span>
        <div className={"flex-1 overflow-y-auto px-1 space-y-1"}>
          {filteredChats.length === 0 ? (
            <p className={"px-3 py-4 text-center text-sm text-slate-500 italic select-none"}>Tidak ada riwayat obrolan</p>
          ) : (
            filteredChats.map((chat) => {
              const isActive = chat.id === activeChatId;
              return (
                <div
                  key={chat.id}
                  onClick={() => selectChat(chat.id)}
                  className={`${"relative flex items-center gap-3 px-3 py-3 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-900/60 hover:text-slate-900 dark:hover:text-slate-200 cursor-pointer select-none transition-all duration-150"} ${isActive ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 border border-slate-200/40 dark:border-slate-800/40 font-semibold shadow-sm" : ''}`}
                >
                  <MessageSquare size={16} className={"text-slate-400 dark:text-slate-500 shrink-0 group-hover:text-slate-700 dark:group-hover:text-slate-300"} />
                  <span className={"flex-1 text-sm truncate pr-6"}>{chat.title}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteChat(chat.id);
                    }}
                    className={"absolute right-2 opacity-0 group-hover:opacity-100 p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 transition-all duration-150 opacity-70 hover:opacity-100"}
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

    </aside>
  );
};
