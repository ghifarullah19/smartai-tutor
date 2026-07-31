import React, { useState, useRef, useEffect } from 'react';
import { Menu, Send, BookOpen, MessageSquare } from 'lucide-react';
import { useChatStore } from '../../../store/chatStore';
import { ChatBubble } from '../../molecules/ChatBubble';
import { ProfileMenu } from '../../molecules/ProfileMenu';
import { WelcomeForm } from '../WelcomeForm';

export const ChatArea: React.FC = () => {
  const { chats, activeChatId, isLoading, sendMessage, toggleSidebar } = useChatStore();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const activeChat = chats.find((c) => c.id === activeChatId);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeChat?.messages, isLoading]);



  const handleSend = () => {
    const text = inputText.trim();
    if (!text || isLoading) return;
    sendMessage(text);
    setInputText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const hasCurriculum = activeChat ? (activeChat.grade && activeChat.subject) : false;

  return (
    <div className={"flex-1 flex flex-col h-full bg-slate-50/50 dark:bg-slate-950/20 overflow-hidden relative"}>
      {/* Header (Always Visible) */}
      <header className={"relative z-30 flex items-center justify-between px-4 md:px-6 py-3 md:py-4 border-b border-slate-200/50 dark:border-slate-800/50 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl shrink-0 select-none shadow-sm"}>
        <div className={"flex items-center gap-3 w-full"}>
          <button onClick={toggleSidebar} className={"p-2 rounded-lg text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-700 dark:hover:text-slate-100 md:hidden"} aria-label="Buka menu">
            <Menu size={20} />
          </button>
          {activeChat ? (
            <div className={"flex flex-col gap-1"}>
              <h2 className={"text-base md:text-lg font-bold text-slate-800 dark:text-slate-100 truncate max-w-xs sm:max-w-md"}>{activeChat.title}</h2>
              {hasCurriculum ? (
                <div className={"flex items-center bg-emerald-600/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs px-2 py-0.5 rounded-full font-medium w-fit"}>
                  <BookOpen size={12} className="mr-1" />
                  <span>{activeChat.subject} • {activeChat.grade}</span>
                </div>
              ) : (
                <div className={"flex items-center bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-xs px-2 py-0.5 rounded-full font-medium w-fit"}>
                  <span>Obrolan Umum</span>
                </div>
              )}
            </div>
          ) : (
            <div className={"flex flex-col gap-1"}>
              <h2 className={"text-base md:text-lg font-bold text-slate-800 dark:text-slate-100"}>PintarAI</h2>
            </div>
          )}
        </div>
        
        {/* Profile Menu Dropdown */}
        <div className="ml-auto pl-4">
          <ProfileMenu />
        </div>
      </header>

      {/* Main Content */}
      {!activeChatId || !activeChat ? (
        <div className={"flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 select-none"}>
          <MessageSquare size={48} className={"text-slate-300 dark:text-slate-700 mb-4 animate-pulse"} />
          <h2 className={"text-xl font-bold text-slate-800 dark:text-slate-200 mb-2"}>Mulai Belajar Sekarang</h2>
          <p className={"text-sm text-slate-500 max-w-sm leading-relaxed"}>
            Pilih salah satu riwayat obrolan di sidebar atau buat obrolan baru untuk mulai bertanya pada PintarAI.
          </p>
        </div>
      ) : activeChat.grade === null && activeChat.subject === null ? (
        <WelcomeForm />
      ) : (
        <>
          <div className={"flex-1 overflow-y-auto w-full py-4"}>
            {activeChat.messages.length === 0 ? (
              <div className={"flex flex-col items-center justify-center p-8 text-center h-full w-full select-none max-w-lg mx-auto"}>
                <div className={"flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-100/30 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-900/30 mb-6"}>
                  <BookOpen size={32} className="text-emerald-500 dark:text-emerald-400" />
                </div>
                <h3 className={"text-lg font-bold text-slate-800 dark:text-slate-200 mb-2"}>
                  {hasCurriculum 
                    ? `Tanyakan materi ${activeChat.subject} ${activeChat.grade}`
                    : "Tanyakan apa saja ke PintarAI"}
                </h3>
                <p className={"text-sm text-slate-400 dark:text-slate-500 leading-relaxed"}>
                  Ketik pertanyaanmu di bawah ini, misalnya rumus, penjelasan teori, atau contoh soal.
                </p>
              </div>
            ) : (
              activeChat.messages.map((msg) => (
                <ChatBubble key={msg.id} message={msg} />
              ))
            )}
            
            {/* Typing indicator */}
            {isLoading && <ChatBubble isLoading={true} />}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Section */}
          <footer className={"px-4 py-4 md:px-8 border-t border-slate-200/50 dark:border-slate-800/50 bg-white/40 dark:bg-slate-950/50 backdrop-blur-xl shrink-0 flex flex-col items-center gap-2"}>
            <div className={"w-full max-w-3xl flex items-center gap-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-2 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition-all duration-200"}>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  hasCurriculum
                    ? `Tanya seputar ${activeChat.subject} ${activeChat.grade}...`
                    : "Tanya apa saja ke PintarAI..."
                }
                rows={1}
                disabled={isLoading}
                className={"flex-1 bg-transparent border-none text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 px-3 py-2 outline-none resize-none text-sm md:text-base max-h-32"}
              />
              <button
                onClick={handleSend}
                disabled={!inputText.trim() || isLoading}
                className={"flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md active:scale-95 transition-all duration-150 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"}
                aria-label="Kirim pesan"
              >
                <Send size={18} />
              </button>
            </div>
            <span className={"text-[10px] md:text-xs text-slate-400 dark:text-slate-600 text-center select-none"}>
              PintarAI dirancang untuk membantu murid SMA belajar. Selalu verifikasi jawaban penting.
            </span>
          </footer>
        </>
      )}
    </div>
  );
};
