import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { IChatSession, IMessage } from '../types/chat';

const BACKEND_URL = 'http://127.0.0.1:5000';

export interface IChatState {
  chats: IChatSession[];
  activeChatId: string | null;
  searchQuery: string;
  isSidebarOpen: boolean;
  isSettingsOpen: boolean;
  isLoading: boolean;
  userId: string;
  theme: 'light' | 'dark';
  isAppLoading: boolean;
  
  initUserId: () => void;
  createNewChat: () => void;
  selectChat: (id: string) => void;
  deleteChat: (id: string) => void;
  setCurriculum: (id: string, grade: string | null, subject: string | null) => void;
  sendMessage: (text: string) => Promise<void>;
  setSearchQuery: (query: string) => void;
  toggleSidebar: () => void;
  toggleSettings: () => void;
  clearAllData: () => void;
  toggleTheme: () => void;
  setAppLoading: (loading: boolean) => void;
}

export const useChatStore = create<IChatState>()(
  persist(
    (set, get) => ({
      chats: [],
      activeChatId: null,
      searchQuery: '',
      isSidebarOpen: false,
      isSettingsOpen: false,
      isLoading: false,
      userId: '',
      theme: 'light',
      isAppLoading: true,

      initUserId: () => {
        // Singkronkan kelas DOM root dari tema yang dipulihkan (hydrated)
        const currentTheme = get().theme || 'light';
        const root = window.document.documentElement;
        if (currentTheme === 'dark') {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }

        let storedId = localStorage.getItem('pintaraiUserId');
        if (!storedId) {
          storedId = 'user-' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
          localStorage.setItem('pintaraiUserId', storedId);
        }
        set({ userId: storedId });

        // Berikan waktu delay halus (600ms) untuk tampilan layar splash screen
        setTimeout(() => {
          set({ isAppLoading: false });
        }, 600);
      },

      createNewChat: () => {
        const newChat: IChatSession = {
          id: 'chat-' + Math.random().toString(36).substring(2, 15),
          title: 'Chat Baru',
          messages: [],
          grade: null,
          subject: null,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          chats: [newChat, ...state.chats],
          activeChatId: newChat.id,
          isSidebarOpen: false, // Close sidebar on mobile after creation
        }));
      },

      selectChat: (id: string) => {
        set({ activeChatId: id, isSidebarOpen: false });
      },

      deleteChat: (id: string) => {
        set((state) => {
          const updatedChats = state.chats.filter((chat) => chat.id !== id);
          let nextActiveId = state.activeChatId;
          if (state.activeChatId === id) {
            nextActiveId = updatedChats.length > 0 ? updatedChats[0].id : null;
          }
          return {
            chats: updatedChats,
            activeChatId: nextActiveId,
          };
        });
      },

      setCurriculum: (id: string, grade: string | null, subject: string | null) => {
        set((state) => {
          const updatedChats = state.chats.map((chat) => {
            if (chat.id === id) {
              // Update title dynamically if it's still 'Chat Baru'
              const title = (chat.title === 'Chat Baru' && subject && grade)
                ? `${subject} - ${grade}`
                : chat.title;
              return { ...chat, grade, subject, title };
            }
            return chat;
          });
          return { chats: updatedChats };
        });
      },

      sendMessage: async (text: string) => {
        const { activeChatId, chats, userId, isLoading } = get();
        if (!activeChatId || isLoading) return;

        const activeChat = chats.find((c) => c.id === activeChatId);
        if (!activeChat) return;

        // User message
        const userMsg: IMessage = {
          id: 'msg-' + Math.random().toString(36).substring(2, 15),
          sender: 'user',
          text,
          timestamp: new Date().toISOString(),
        };

        // Update local state with user message
        set((state) => ({
          isLoading: true,
          chats: state.chats.map((c) => {
            if (c.id === activeChatId) {
              const updatedTitle = c.title === 'Chat Baru' 
                ? (text.length > 20 ? text.substring(0, 20) + '...' : text) 
                : c.title;
              return {
                ...c,
                title: updatedTitle,
                messages: [...c.messages, userMsg],
              };
            }
            return c;
          }),
        }));

        try {
          const response = await fetch(`${BACKEND_URL}/ask`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              question: text,
              userId,
              grade: activeChat.grade,
              subject: activeChat.subject,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Server error: ${response.status}`);
          }

          const data = await response.json();
          const botMsg: IMessage = {
            id: 'msg-' + Math.random().toString(36).substring(2, 15),
            sender: 'bot',
            text: data.answer,
            timestamp: new Date().toISOString(),
          };

          set((state) => ({
            isLoading: false,
            chats: state.chats.map((c) => {
              if (c.id === activeChatId) {
                return { ...c, messages: [...c.messages, botMsg] };
              }
              return c;
            }),
          }));
        } catch (error: any) {
          console.error('Error sending message:', error);
          
          let displayErrorText = 'Maaf, terjadi kesalahan saat menghubungi server. Pastikan server backend Anda berjalan.';
          if (error.message && !error.message.includes('Failed to fetch')) {
            displayErrorText = error.message;
          }

          const errorMsg: IMessage = {
            id: 'msg-' + Math.random().toString(36).substring(2, 15),
            sender: 'bot',
            text: displayErrorText,
            timestamp: new Date().toISOString(),
          };
          set((state) => ({
            isLoading: false,
            chats: state.chats.map((c) => {
              if (c.id === activeChatId) {
                return { ...c, messages: [...c.messages, errorMsg] };
              }
              return c;
            }),
          }));
        }
      },

      setSearchQuery: (query: string) => {
        set({ searchQuery: query });
      },

      toggleSidebar: () => {
        set((state) => ({ isSidebarOpen: !state.isSidebarOpen }));
      },

      toggleSettings: () => {
        set((state) => ({ isSettingsOpen: !state.isSettingsOpen }));
      },

      clearAllData: () => {
        set({
          chats: [],
          activeChatId: null,
          isSettingsOpen: false,
        });
      },

      toggleTheme: () => {
        const currentTheme = get().theme;
        const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        const root = window.document.documentElement;
        if (nextTheme === 'dark') {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
        
        set({ theme: nextTheme });
      },

      setAppLoading: (loading: boolean) => {
        set({ isAppLoading: loading });
      },
    }),
    {
      name: 'pintarai-chats',
      partialize: (state) => ({
        chats: state.chats,
        activeChatId: state.activeChatId,
        theme: state.theme,
      }),
    }
  )
);
