import React, { useState } from 'react';
import { useChatStore } from '../../../store/chatStore';
import { OptionCard } from '../../molecules/OptionCard';
import { Button } from '../../atoms/Button';
import { Sparkles } from 'lucide-react';
import styles from './WelcomeForm.module.css';

const GRADES = ['Kelas 10', 'Kelas 11', 'Kelas 12'];
const SUBJECTS = [
  'Matematika',
  'Fisika',
  'Kimia',
  'Biologi',
  'Bahasa Indonesia',
  'Bahasa Inggris',
];

export const WelcomeForm: React.FC = () => {
  const { activeChatId, setCurriculum } = useChatStore();
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  if (!activeChatId) return null;

  const handleStartConfigured = () => {
    if (selectedGrade && selectedSubject) {
      setCurriculum(activeChatId, selectedGrade, selectedSubject);
    }
  };

  const handleStartDirect = () => {
    setCurriculum(activeChatId, '', '',);
  };

  const isFormValid = selectedGrade !== null && selectedSubject !== null;

  return (
    <div className={styles['welcome-container']}>
      <div className={styles['welcome-card']}>
        <div className={styles['welcome-header']}>
          <div className={styles['icon-wrapper']}>
            <Sparkles className={styles['header-icon']} size={24} />
          </div>
          <h1 className={styles['welcome-title']}>Selamat Datang di PintarAI</h1>
          <p className={styles['welcome-subtitle']}>
            Tutor virtual AI yang siap membantu belajarmu. Atur kurikulum agar penjelasan AI lebih sesuai dengan materi sekolahmu, atau langsung mengobrol sekarang.
          </p>
        </div>

        <div className={styles['setup-section']}>
          {/* Grade Selector */}
          <div className={styles['selector-group']}>
            <span className={styles['group-label']}>Pilih Kelas SMA</span>
            <div className={styles['grid-grades']}>
              {GRADES.map((grade) => (
                <OptionCard
                  key={grade}
                  label={grade}
                  selected={selectedGrade === grade}
                  onClick={() => setSelectedGrade(grade)}
                />
              ))}
            </div>
          </div>

          {/* Subject Selector */}
          <div className={styles['selector-group']}>
            <span className={styles['group-label']}>Pilih Mata Pelajaran</span>
            <div className={styles['grid-subjects']}>
              {SUBJECTS.map((subject) => (
                <OptionCard
                  key={subject}
                  label={subject}
                  selected={selectedSubject === subject}
                  onClick={() => setSelectedSubject(subject)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className={styles['action-footer']}>
          <Button
            onClick={handleStartConfigured}
            disabled={!isFormValid}
            variant="primary"
            className={styles['start-btn']}
          >
            Mulai Belajar
          </Button>
          <Button
            onClick={handleStartDirect}
            variant="flat"
            className={styles['skip-btn']}
          >
            Langsung Tanya AI
          </Button>
        </div>
      </div>
    </div>
  );
};
