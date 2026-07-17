import React from 'react';
import { useChatStore } from '../../../store/chatStore';
import styles from './AppShell.module.css';

export interface IAppShellProps {
  sidebar: React.ReactNode;
  content: React.ReactNode;
}

export const AppShell: React.FC<IAppShellProps> = ({ sidebar, content }) => {
  const { isSidebarOpen, toggleSidebar } = useChatStore();

  return (
    <div className={styles['app-shell']}>
      {/* Sidebar Section */}
      {sidebar}

      {/* Backdrop overlay on mobile when sidebar is open */}
      {isSidebarOpen && (
        <div className={styles['backdrop']} onClick={toggleSidebar} />
      )}

      {/* Main Content Section */}
      <main className={styles['main-content']}>
        {content}
      </main>
    </div>
  );
};
