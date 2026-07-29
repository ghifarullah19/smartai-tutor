import { create } from 'zustand';
import type { IChatSession, IMessage } from '../types/chat';
import { useAuthStore } from './authStore';

const BACKEND_URL = 'http://127.0.0.1:5000';

export interface IChatState {
  chats: IChatSession[];
  activeChatId: string | null;
  searchQuery: string;
  isSidebarOpen: boolean;
  isSettingsOpen: boolean;
  isProfileOpen: boolean;
  isLoading: boolean;
  userId: string;
  theme: 'light' | 'dark';
  isAppLoading: boolean;
  
  initUserId: () => void;
  fetchChats: () => Promise<void>;
  fetchMessages: (chatId: string) => Promise<void>;
  createNewChat: () => Promise<void>;
  selectChat: (id: string) => void;
  deleteChat: (id: string) => Promise<void>;
  setCurriculum: (id: string, grade: string | null, subject: string | null) => Promise<void>;
  sendMessage: (text: string) => Promise<void>;
  setSearchQuery: (query: string) => void;
  toggleSidebar: () => void;
  toggleSettings: () => void;
  toggleProfile: () => void;
  clearAllData: () => void;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setAppLoading: (loading: boolean) => void;
}

const getAuthHeaders = () => {
  const token = useAuthStore.getState().token;
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const useChatStore = create<IChatState>()((set, get) => ({
  chats: [],
  activeChatId: null,
  searchQuery: '',
  isSidebarOpen: false,
  isSettingsOpen: false,
  isProfileOpen: false,
  isLoading: false,
  userId: '',
  theme: 'light',
  isAppLoading: true,

  initUserId: () => {
    const manualTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const currentTheme = manualTheme || get().theme || 'light';
    get().setTheme(currentTheme);

    let storedId = localStorage.getItem('pintaraiUserId');
    if (!storedId) {
      storedId = 'user-' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('pintaraiUserId', storedId);
    }
    set({ userId: storedId });

    // Coba load chats jika sudah login
    if (useAuthStore.getState().isAuthenticated) {
      get().fetchChats().finally(() => {
        set({ isAppLoading: false });
      });
    } else {
      setTimeout(() => {
        set({ isAppLoading: false });
      }, 600);
    }
  },

  fetchChats: async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/chats`, { headers: getAuthHeaders() });
      if (!response.ok) throw new Error('Failed to fetch chats');
      const data = await response.json();
      
      const formattedChats: IChatSession[] = data.map((c: any) => ({
        id: c.id,
        title: c.title,
        grade: c.grade,
        subject: c.subject,
        createdAt: c.created_at,
        messages: [] // Akan di-load nanti saat dipilih
      }));
      
      set({ chats: formattedChats });
      
      // Jika ada chat tapi tidak ada yang aktif, aktifkan yang pertama dan muat pesannya
      const currentActiveId = get().activeChatId;
      if (formattedChats.length > 0 && (!currentActiveId || !formattedChats.find(c => c.id === currentActiveId))) {
        get().selectChat(formattedChats[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  },

  fetchMessages: async (chatId: string) => {
    try {
      set({ isLoading: true });
      const response = await fetch(`${BACKEND_URL}/api/chats/${chatId}/messages`, { headers: getAuthHeaders() });
      if (!response.ok) throw new Error('Failed to fetch messages');
      const data = await response.json();
      
      const messages: IMessage[] = data.map((m: any) => ({
        id: m.id.toString(),
        sender: m.sender === 'user' ? 'user' : 'bot',
        text: m.text,
        timestamp: m.timestamp
      }));
      
      set((state) => ({
        chats: state.chats.map(c => c.id === chatId ? { ...c, messages } : c),
        isLoading: false
      }));
    } catch (err) {
      console.error(err);
      set({ isLoading: false });
    }
  },

  createNewChat: async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/chats`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ title: 'Obrolan Baru' })
      });
      if (!response.ok) throw new Error('Failed to create chat');
      const c = await response.json();
      
      const newChat: IChatSession = {
        id: c.id,
        title: c.title,
        grade: c.grade,
        subject: c.subject,
        createdAt: c.created_at,
        messages: []
      };
      
      set((state) => ({
        chats: [newChat, ...state.chats],
        activeChatId: newChat.id,
        isSidebarOpen: false
      }));
    } catch (err) {
      console.error(err);
    }
  },

  selectChat: (id: string) => {
    set({ activeChatId: id, isSidebarOpen: false });
    get().fetchMessages(id);
  },

  deleteChat: async (id: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/chats/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Failed to delete chat');
      
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
      
      if (get().activeChatId) {
        get().fetchMessages(get().activeChatId as string);
      }
    } catch (err) {
      console.error(err);
    }
  },

  setCurriculum: async (id: string, grade: string | null, subject: string | null) => {
    const chat = get().chats.find(c => c.id === id);
    if (!chat) return;
    
    const title = (chat.title === 'Obrolan Baru' && subject && grade)
      ? `${subject} - ${grade}`
      : chat.title;
      
    // Optimistic update
    set((state) => ({
      chats: state.chats.map(c => c.id === id ? { ...c, grade, subject, title } : c)
    }));
    
    try {
      await fetch(`${BACKEND_URL}/api/chats/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ title, grade, subject })
      });
    } catch (err) {
      console.error(err);
    }
  },

  sendMessage: async (text: string) => {
    const { activeChatId, chats, isLoading } = get();
    if (!activeChatId || isLoading) return;

    const activeChat = chats.find((c) => c.id === activeChatId);
    if (!activeChat) return;

    // Optimistic user message
    const userMsg: IMessage = {
      id: 'temp-' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toISOString(),
    };

    set((state) => ({
      isLoading: true,
      chats: state.chats.map((c) => {
        if (c.id === activeChatId) {
          let updatedTitle = c.title;
          if (c.title === 'Obrolan Baru' && (!c.subject || !c.grade)) {
             updatedTitle = text.length > 20 ? text.substring(0, 20) + '...' : text;
          }
          return {
            ...c,
            title: updatedTitle,
            messages: [...c.messages, userMsg],
          };
        }
        return c;
      }),
    }));
    
    // Update title in backend if we changed it
    const updatedChat = get().chats.find(c => c.id === activeChatId);
    if (updatedChat && updatedChat.title !== activeChat.title) {
       fetch(`${BACKEND_URL}/api/chats/${activeChatId}`, {
         method: 'PUT',
         headers: getAuthHeaders(),
         body: JSON.stringify({ title: updatedChat.title })
       });
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/chats/${activeChatId}/ask`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          question: text,
          grade: activeChat.grade,
          subject: activeChat.subject,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const data = await response.json();
      
      const finalUserMsg: IMessage = {
        id: data.user_message_id.toString(),
        sender: 'user',
        text,
        timestamp: new Date().toISOString(),
      };
      
      const botMsg: IMessage = {
        id: data.ai_message_id.toString(),
        sender: 'bot',
        text: data.answer,
        timestamp: new Date().toISOString(),
      };

      set((state) => ({
        isLoading: false,
        chats: state.chats.map((c) => {
          if (c.id === activeChatId) {
             // Replace temporary user message with real one, and add bot message
             const msgs = c.messages.filter(m => m.id !== userMsg.id);
             return { ...c, messages: [...msgs, finalUserMsg, botMsg] };
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
        id: 'msg-error-' + Date.now(),
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

  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  toggleSettings: () => set((state) => ({ isSettingsOpen: !state.isSettingsOpen })),
  toggleProfile: () => set((state) => ({ isProfileOpen: !state.isProfileOpen })),

  clearAllData: () => {
    // Now we should probably call DELETE on all chats via API, but for simplicity:
    get().chats.forEach(c => get().deleteChat(c.id));
    set({
      activeChatId: null,
      isSettingsOpen: false,
    });
  },

  setTheme: (theme: 'light' | 'dark') => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
    set({ theme });
  },

  toggleTheme: () => {
    const currentTheme = get().theme;
    const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
    get().setTheme(nextTheme);
  },

  setAppLoading: (loading: boolean) => {
    set({ isAppLoading: loading });
  },
}));
