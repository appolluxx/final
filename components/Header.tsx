
import React from 'react';
import { BrandIcon, ArrowLeftIcon } from './icons';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useTranslations } from '../lib/i18n';

interface HeaderProps {
    language: 'en' | 'th';
    onToggleLanguage: () => void;
    onBackToHome: () => void;
    mode: 'single' | 'compare';
    setMode: (mode: 'single' | 'compare') => void;
}

export const Header: React.FC<HeaderProps> = ({ language, onToggleLanguage, onBackToHome, mode, setMode }) => {
    const { t } = useTranslations(language);
    return (
        <header>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
             <div className="flex items-center gap-4">
                <button 
                    onClick={onBackToHome} 
                    className="p-2 rounded-full hover:bg-slate-200 transition-colors"
                    aria-label="Back to home"
                >
                    <ArrowLeftIcon />
                </button>
                <div className="flex items-center gap-3">
                    <BrandIcon />
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                        {t('appTitle')}
                    </h1>
                </div>
            </div>
            <div className="flex items-center gap-4 self-end sm:self-center">
                 <div className="flex items-center bg-slate-200 rounded-lg p-1 text-sm font-semibold">
                    <button onClick={() => setMode('single')} className={`px-4 py-1.5 rounded-md transition-colors ${mode === 'single' ? 'bg-white shadow-sm text-primary-600' : 'text-slate-600 hover:bg-slate-300'}`}>{t('mode.single')}</button>
                    <button onClick={() => setMode('compare')} className={`px-4 py-1.5 rounded-md transition-colors ${mode === 'compare' ? 'bg-white shadow-sm text-primary-600' : 'text-slate-600 hover:bg-slate-300'}`}>{t('mode.compare')}</button>
                 </div>
                 <LanguageSwitcher language={language} onToggle={onToggleLanguage} />
            </div>
          </div>
          <p className="mt-2 text-lg text-gray-500 pl-14 hidden sm:block">
            {t('appSubtitle')}
          </p>
        </header>
    );
}