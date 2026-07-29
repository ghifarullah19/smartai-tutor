import React, { useState } from 'react';
import { useAuthStore } from '../../../store/authStore';
import { Button } from '../../atoms/Button';
import styles from './LoginForm.module.css';
import { LogIn } from 'lucide-react';

interface ILoginFormProps {
  onSwitchToSignup: () => void;
}

export const LoginForm: React.FC<ILoginFormProps> = ({ onSwitchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Terjadi kesalahan saat login');
      }

      login(data.user, data.token);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.iconWrapper}>
            <LogIn size={32} className={styles.icon} />
          </div>
          <h2 className={styles.title}>Masuk ke PintarAI</h2>
          <p className={styles.subtitle}>Tutor virtual AI untuk Anda</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}
          
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              placeholder="siswa@pintarai.com"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>Kata Sandi</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              placeholder="••••••••"
              required
            />
          </div>

          <Button 
            type="submit" 
            variant="primary" 
            className={styles.submitBtn}
            disabled={isLoading}
          >
            {isLoading ? 'Memproses...' : 'Masuk'}
          </Button>

          <p className={styles.switchText}>
            Belum punya akun?{' '}
            <button type="button" className={styles.switchBtn} onClick={onSwitchToSignup}>
              Daftar di sini
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};
