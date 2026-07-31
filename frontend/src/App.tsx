import { useState, useEffect } from 'react';
import { MainChatPage } from './pages/MainChatPage';
import { LoginForm } from './components/organisms/LoginForm';
import { SignupForm } from './components/organisms/SignupForm';
import { useAuthStore } from './store/authStore';
import { useChatStore } from './store/chatStore';
import { Moon, Sun } from 'lucide-react';

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { theme, toggleTheme, initUserId } = useChatStore();
  const [isLoginMode, setIsLoginMode] = useState(true);

  useEffect(() => {
    initUserId();
  }, [initUserId]);

  if (isAuthenticated) {
    return <MainChatPage />;
  }

  return (
    <div className="relative w-full h-full min-h-full bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Theme Toggle for Login/Signup */}
      <button 
        onClick={toggleTheme}
        className="fixed top-4 right-4 p-2.5 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 shadow-sm z-50 transition-all duration-200"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      {isLoginMode ? (
        <LoginForm onSwitchToSignup={() => setIsLoginMode(false)} />
      ) : (
        <SignupForm onSwitchToLogin={() => setIsLoginMode(true)} />
      )}
    </div>
  );
}

export default App;

