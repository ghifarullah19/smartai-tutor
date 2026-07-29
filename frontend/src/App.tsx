import { useState } from 'react';
import { MainChatPage } from './pages/MainChatPage';
import { LoginForm } from './components/organisms/LoginForm';
import { SignupForm } from './components/organisms/SignupForm';
import { useAuthStore } from './store/authStore';

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [isLoginMode, setIsLoginMode] = useState(true);

  if (isAuthenticated) {
    return <MainChatPage />;
  }

  return isLoginMode ? (
    <LoginForm onSwitchToSignup={() => setIsLoginMode(false)} />
  ) : (
    <SignupForm onSwitchToLogin={() => setIsLoginMode(true)} />
  );
}

export default App;

