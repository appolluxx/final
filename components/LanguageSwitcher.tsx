import React from 'react';

interface LanguageSwitcherProps {
  language: 'en' | 'th';
  onToggle: () => void;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ language, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-slate-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-400"
      aria-label={`Switch to ${language === 'en' ? 'Thai' : 'English'}`}
    >
      <span className="block w-6 text-center">{language === 'en' ? 'TH' : 'EN'}</span>
    </button>
  );
};