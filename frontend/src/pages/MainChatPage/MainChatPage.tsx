import React, { useEffect } from 'react';
import { useChatStore } from '../../store/chatStore';
import { AppShell } from '../../components/templates/AppShell';
import { Sidebar } from '../../components/organisms/Sidebar';
import { ChatArea } from '../../components/organisms/ChatArea';
import { SettingsModal } from '../../components/organisms/SettingsModal';
import { ProfileModal } from '../../components/organisms/ProfileModal';
import { SplashScreen } from '../../components/organisms/SplashScreen';

export const MainChatPage: React.FC = () => {
  const { chats, createNewChat, isAppLoading } = useChatStore();

  useEffect(() => {
    // Jika tidak ada riwayat obrolan sama sekali, buat sesi obrolan baru secara otomatis
    if (!isAppLoading && chats.length === 0) {
      createNewChat();
    }
  }, [chats, createNewChat, isAppLoading]);

  if (isAppLoading) {
    return <SplashScreen />;
  }

  return (
    <div className={"w-full h-screen h-[100dvh] relative overflow-hidden"}>
      <AppShell
        sidebar={<Sidebar />}
        content={<ChatArea />}
      />
      <SettingsModal />
      <ProfileModal />
    </div>
  );
};
