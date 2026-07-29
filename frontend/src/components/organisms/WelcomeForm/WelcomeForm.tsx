import React, { useState } from 'react';
import { useChatStore } from '../../../store/chatStore';
import { OptionCard } from '../../molecules/OptionCard';
import { Button } from '../../atoms/Button';
import { Sparkles } from 'lucide-react';

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
    <div className={"flex-1 flex items-center justify-center p-4 md:p-8 overflow-y-auto w-full h-full bg-slate-50 dark:bg-slate-950 transition-colors duration-300"}>
      <div className={"w-full max-w-2xl bg-white/50 dark:bg-slate-900/50 border border-white/40 dark:border-slate-700/50 rounded-3xl p-6 md:p-8 backdrop-blur-2xl shadow-2xl transition-colors duration-300"}>
        <div className={"flex flex-col items-center text-center mb-8 select-none"}>
          <div className={"flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-600 shadow-lg shadow-emerald-600/20 mb-4"}>
            <Sparkles className={"text-white"} size={24} />
          </div>
          <h1 className={"text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2"}>Selamat Datang di PintarAI</h1>
          <p className={"text-sm md:text-base text-slate-500 dark:text-slate-400 max-w-lg leading-relaxed"}>
            Tutor virtual AI yang siap membantu belajarmu. Atur kurikulum agar penjelasan AI lebih sesuai dengan materi sekolahmu, atau langsung mengobrol sekarang.
          </p>
        </div>

        <div className={"space-y-6 mb-8"}>
          {/* Grade Selector */}
          <div className={"flex flex-col gap-3"}>
            <span className={"text-xs font-semibold text-slate-500 uppercase tracking-wider select-none"}>Pilih Kelas SMA</span>
            <div className={"grid grid-cols-3 gap-3"}>
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
          <div className={"flex flex-col gap-3"}>
            <span className={"text-xs font-semibold text-slate-500 uppercase tracking-wider select-none"}>Pilih Mata Pelajaran</span>
            <div className={"grid grid-cols-2 sm:grid-cols-3 gap-3"}>
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

        <div className={"flex flex-col sm:flex-row gap-3 items-center justify-center"}>
          <Button
            onClick={handleStartConfigured}
            disabled={!isFormValid}
            variant="primary"
            className={"w-full sm:w-auto px-8 py-3 text-base"}
          >
            Mulai Belajar
          </Button>
          <Button
            onClick={handleStartDirect}
            variant="flat"
            className={"w-full sm:w-auto px-6 py-3 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 text-sm"}
          >
            Langsung Tanya AI
          </Button>
        </div>
      </div>
    </div>
  );
};
