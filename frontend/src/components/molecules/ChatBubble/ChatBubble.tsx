import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import type { IMessage } from '../../../types/chat';
import { Avatar } from '../../../components/atoms/Avatar';
import { Skeleton } from '../../../components/atoms/Skeleton';
import { Spinner } from '../../../components/atoms/Spinner';
import styles from './ChatBubble.module.css';

export interface IChatBubbleProps {
  message?: IMessage;
  isLoading?: boolean;
}

const preprocessLaTeX = (text: string) => {
  let processedText = text.replace(/\\\[/g, '$$');
  processedText = processedText.replace(/\\\]/g, '$$');
  processedText = processedText.replace(/\\\(/g, '$');
  processedText = processedText.replace(/\\\)/g, '$');
  return processedText;
};

export const ChatBubble: React.FC<IChatBubbleProps> = ({ message, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className={`${styles['bubble-container']} ${styles['bubble-bot']}`}>
        <div className={styles['avatar-wrapper']}>
          <Avatar name="PintarAI" />
        </div>
        <div className={styles['content-wrapper']}>
          <div className={styles['sender-info']}>
            <span className={styles['sender-name']}>PintarAI</span>
            <span className={styles['message-time']}>sedang berpikir...</span>
          </div>
          <div className={styles['message-body']}>
            <div className="flex flex-col gap-2.5 max-w-md py-1">
              <Skeleton width="90%" height="14px" />
              <Skeleton width="75%" height="14px" />
              <Skeleton width="50%" height="14px" />
            </div>
            <div className="flex items-center gap-2 mt-4 text-xs text-slate-400 dark:text-slate-500 select-none">
              <Spinner size="sm" />
              <span>merumuskan jawaban...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!message) return null;

  const isUser = message.sender === 'user';

  return (
    <div className={`${styles['bubble-container']} ${isUser ? styles['bubble-user'] : styles['bubble-bot']}`}>
      <div className={styles['avatar-wrapper']}>
        <Avatar name={isUser ? 'Siswa' : 'PintarAI'} />
      </div>
      <div className={styles['content-wrapper']}>
        <div className={styles['sender-info']}>
          <span className={styles['sender-name']}>{isUser ? 'Anda' : 'PintarAI'}</span>
          <span className={styles['message-time']}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <div className={styles['message-body']}>
          {isUser ? (
            <p className={styles['user-text']}>{message.text}</p>
          ) : (
            <div className={styles['bot-text']}>
              <ReactMarkdown
                remarkPlugins={[remarkMath, remarkGfm]}
                rehypePlugins={[rehypeRaw, rehypeKatex]}
              >
                {preprocessLaTeX(message.text)}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
