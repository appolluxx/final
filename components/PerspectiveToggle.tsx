import React from 'react';
import type { Perspective } from '../types';
import { useTranslations } from '../lib/i18n';

interface PerspectiveToggleProps {
  selected: Perspective;
  setSelected: (perspective: Perspective) => void;
  language: 'en' | 'th';
}

const perspectives: Perspective[] = ['Citizen', 'Business Owner', 'Student', 'Environment'];

export const PerspectiveToggle: React.FC<PerspectiveToggleProps> = ({ selected, setSelected, language }) => {
  const { t } = useTranslations(language);
  
  return (
    <div className="flex items-center bg-slate-100 rounded-xl p-1 space-x-1 shadow-inner">
      {perspectives.map((p) => (
        <button
          key={p}
          onClick={() => setSelected(p)}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-400
            ${selected === p ? 'bg-white text-primary-600 shadow-md' : 'bg-transparent text-slate-600 hover:bg-slate-200'}
          `}
        >
          {t(`perspectives.${p.replace(' ', '')}`)}
        </button>
      ))}
    </div>
  );
};