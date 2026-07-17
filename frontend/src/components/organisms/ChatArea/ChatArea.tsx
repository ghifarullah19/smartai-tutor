import React, { useState, useRef, useEffect } from 'react';
import { Menu, Send, BookOpen, MessageSquare } from 'lucide-react';
import { useChatStore } from '../../../store/chatStore';
import { ChatBubble } from '../../molecules/ChatBubble';
import { WelcomeForm } from '../WelcomeForm';
import styles from './ChatArea.module.css';

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

  if (!activeChatId) {
    return (
      <div className={styles['empty-area']}>
        <MessageSquare size={48} className={styles['empty-icon']} />
        <h2 className={styles['empty-title']}>Mulai Belajar Sekarang</h2>
        <p className={styles['empty-subtitle']}>
          Pilih salah satu riwayat obrolan di sidebar atau buat obrolan baru untuk mulai bertanya pada PintarAI.
        </p>
      </div>
    );
  }

  if (!activeChat) return null;

  // If grade and subject are not configured yet, show the Welcome onboarding form
  if (activeChat.grade === null && activeChat.subject === null) {
    return <WelcomeForm />;
  }

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

  const hasCurriculum = activeChat.grade && activeChat.subject;

  return (
    <div className={styles['chat-area']}>
      {/* Header */}
      <header className={styles['chat-header']}>
        <div className={styles['header-left']}>
          <button onClick={toggleSidebar} className={styles['menu-btn']} aria-label="Buka menu">
            <Menu size={20} />
          </button>
          <div className={styles['title-info']}>
            <h2 className={styles['chat-title']}>{activeChat.title}</h2>
            {hasCurriculum ? (
              <div className={styles['curriculum-badge']}>
                <BookOpen size={12} className="mr-1" />
                <span>{activeChat.subject} • {activeChat.grade}</span>
              </div>
            ) : (
              <div className={styles['curriculum-badge-general']}>
                <span>Obrolan Umum</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Messages List */}
      <div className={styles['messages-container']}>
        {activeChat.messages.length === 0 ? (
          <div className={styles['no-messages']}>
            <div className={styles['no-messages-icon-wrapper']}>
              <BookOpen size={32} className="text-emerald-500 dark:text-emerald-400" />
            </div>
            <h3 className={styles['no-messages-title']}>
              {hasCurriculum 
                ? `Tanyakan materi ${activeChat.subject} ${activeChat.grade}`
                : "Tanyakan apa saja ke PintarAI"}
            </h3>
            <p className={styles['no-messages-subtitle']}>
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
      <footer className={styles['input-section']}>
        <div className={styles['input-container']}>
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
            className={styles['input-textarea']}
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim() || isLoading}
            className={styles['send-btn']}
            aria-label="Kirim pesan"
          >
            <Send size={18} />
          </button>
        </div>
        <span className={styles['footer-notice']}>
          PintarAI dirancang untuk membantu murid SMA belajar. Selalu verifikasi jawaban penting.
        </span>
      </footer>
    </div>
  );
};
