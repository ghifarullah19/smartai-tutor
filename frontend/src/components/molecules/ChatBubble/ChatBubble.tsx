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
      <div className={`${"flex gap-4 w-full p-4 border-b border-slate-200/50 dark:border-slate-900/50 hover:bg-slate-100/30 dark:hover:bg-slate-900/20 transition-colors duration-150"} ${"bg-white/40 dark:bg-slate-950/20"}`}>
        <div className={"shrink-0"}>
          <Avatar name="PintarAI" />
        </div>
        <div className={"flex flex-col gap-1 w-full overflow-hidden"}>
          <div className={"flex items-center gap-2 select-none"}>
            <span className={"text-sm font-semibold text-slate-800 dark:text-slate-200"}>PintarAI</span>
            <span className={"text-xs text-slate-500"}>sedang berpikir...</span>
          </div>
          <div className={"text-slate-700 dark:text-slate-300 text-sm md:text-base leading-relaxed"}>
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
    <div className={`${"flex gap-4 w-full p-4 border-b border-slate-200/50 dark:border-slate-900/50 hover:bg-slate-100/30 dark:hover:bg-slate-900/20 transition-colors duration-150"} ${isUser ? "bg-slate-100/55 dark:bg-slate-900/40" : "bg-white/40 dark:bg-slate-950/20"}`}>
      <div className={"shrink-0"}>
        <Avatar name={isUser ? 'Siswa' : 'PintarAI'} />
      </div>
      <div className={"flex flex-col gap-1 w-full overflow-hidden"}>
        <div className={"flex items-center gap-2 select-none"}>
          <span className={"text-sm font-semibold text-slate-800 dark:text-slate-200"}>{isUser ? 'Anda' : 'PintarAI'}</span>
          <span className={"text-xs text-slate-500"}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <div className={"text-slate-700 dark:text-slate-300 text-sm md:text-base leading-relaxed"}>
          {isUser ? (
            <p className={"whitespace-pre-wrap break-words"}>{message.text}</p>
          ) : (
            <div className={"break-words"}>
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
