import React from 'react';
import { useChatStore } from '../../../store/chatStore';

export interface IAppShellProps {
  sidebar: React.ReactNode;
  content: React.ReactNode;
}

export const AppShell: React.FC<IAppShellProps> = ({ sidebar, content }) => {
  const { isSidebarOpen, toggleSidebar } = useChatStore();

  return (
    <div className={"flex w-full h-full overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300"}>
      {/* Sidebar Section */}
      {sidebar}

      {/* Backdrop overlay on mobile when sidebar is open */}
      {isSidebarOpen && (
        <div className={"fixed inset-0 z-30 bg-slate-950/30 dark:bg-slate-950/60 backdrop-blur-md md:hidden"} onClick={toggleSidebar} />
      )}

      {/* Main Content Section */}
      <main className={"flex-1 flex flex-col h-full min-w-0 overflow-hidden relative"}>
        {content}
      </main>
    </div>
  );
};
