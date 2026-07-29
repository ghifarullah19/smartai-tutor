import React, { useState } from 'react';
import { Button } from '../../atoms/Button';
import styles from './SignupForm.module.css';
import { UserPlus } from 'lucide-react';

interface ISignupFormProps {
  onSwitchToLogin: () => void;
}

export const SignupForm: React.FC<ISignupFormProps> = ({ onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Terjadi kesalahan saat mendaftar');
      }

      setSuccess('Pendaftaran berhasil! Mengalihkan ke form login...');
      setTimeout(() => {
        onSwitchToLogin();
      }, 2000);
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
            <UserPlus size={32} className={styles.icon} />
          </div>
          <h2 className={styles.title}>Daftar PintarAI</h2>
          <p className={styles.subtitle}>Buat akun baru untuk mulai belajar</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}
          {success && <div className={styles.success}>{success}</div>}
          
          <div className={styles.inputGroup}>
            <label htmlFor="name" className={styles.label}>Nama Lengkap (Opsional)</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.input}
              placeholder="Budi Santoso"
            />
          </div>

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
            {isLoading ? 'Mendaftar...' : 'Daftar'}
          </Button>

          <p className={styles.switchText}>
            Sudah punya akun?{' '}
            <button type="button" className={styles.switchBtn} onClick={onSwitchToLogin}>
              Masuk di sini
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};
