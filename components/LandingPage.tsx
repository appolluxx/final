import React, { useState } from 'react';
import { useTranslations } from '../lib/i18n';
import { BrandIcon, ChartBarIcon, UsersIcon, SparklesIcon as FeatureSparklesIcon, BrainCircuitIcon, StepsIcon } from './icons';
import { LanguageSwitcher } from './LanguageSwitcher';

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const [language, setLanguage] = useState<'en' | 'th'>('en');
  const { t } = useTranslations(language);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'th' : 'en');
  };

  const FeatureCard: React.FC<{icon: React.ReactNode, title: string, description: string}> = ({ icon, title, description }) => (
    <div className="text-center">
        <div className="flex justify-center items-center mb-4 w-16 h-16 bg-primary-100 text-primary-600 rounded-full mx-auto">
            {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2 text-gray-900">{title}</h3>
        <p className="text-gray-600">{description}</p>
    </div>
  );

  return (
    <div className="min-h-screen text-gray-800 font-sans">
      <div className="absolute top-0 right-0 p-6 z-10">
        <LanguageSwitcher language={language} onToggle={toggleLanguage} />
      </div>
      <main className="container mx-auto px-4">
        {/* Hero Section */}
        <section className="text-center py-20 sm:py-32">
          <div className="flex justify-center mb-6">
            <BrandIcon size="large" />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
            {t('landing.hero.title')}
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600">
            {t('landing.hero.subtitle')}
          </p>
          <button
            onClick={onStart}
            className="mt-10 bg-gradient-to-r from-primary-500 to-red-600 text-white font-semibold py-4 px-10 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            {t('landing.hero.cta')}
          </button>
        </section>

        {/* How it Works Section */}
        <section className="py-16">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900">{t('landing.howItWorks.title')}</h2>
            </div>
            <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8 text-center relative">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 hidden md:block" />
                <div className="relative bg-transparent p-4">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white border-2 border-primary-500 text-primary-500 font-bold text-2xl mx-auto mb-4">1</div>
                    <h3 className="text-xl font-semibold mb-2">{t('landing.howItWorks.step1.title')}</h3>
                    <p className="text-gray-600">{t('landing.howItWorks.step1.description')}</p>
                </div>
                <div className="relative bg-transparent p-4">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white border-2 border-primary-500 text-primary-500 font-bold text-2xl mx-auto mb-4">2</div>
                    <h3 className="text-xl font-semibold mb-2">{t('landing.howItWorks.step2.title')}</h3>
                    <p className="text-gray-600">{t('landing.howItWorks.step2.description')}</p>
                </div>
                <div className="relative bg-transparent p-4">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white border-2 border-primary-500 text-primary-500 font-bold text-2xl mx-auto mb-4">3</div>
                    <h3 className="text-xl font-semibold mb-2">{t('landing.howItWorks.step3.title')}</h3>
                    <p className="text-gray-600">{t('landing.howItWorks.step3.description')}</p>
                </div>
            </div>
        </section>


        {/* Features Section */}
        <section className="py-16 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">{t('landing.features.title')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto px-6">
            <FeatureCard icon={<StepsIcon />} title={t('landing.feature1.title')} description={t('landing.feature1.description')} />
            <FeatureCard icon={<UsersIcon />} title={t('landing.feature2.title')} description={t('landing.feature2.description')} />
            <FeatureCard icon={<ChartBarIcon />} title={t('landing.feature3.title')} description={t('landing.feature3.description')} />
          </div>
        </section>

        {/* Who is it for Section */}
        <section className="py-20">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900">{t('landing.whoIsItFor.title')}</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                <div className="bg-slate-100/70 p-6 rounded-lg text-center font-semibold text-slate-700">{t('landing.whoIsItFor.person1')}</div>
                <div className="bg-slate-100/70 p-6 rounded-lg text-center font-semibold text-slate-700">{t('landing.whoIsItFor.person2')}</div>
                <div className="bg-slate-100/70 p-6 rounded-lg text-center font-semibold text-slate-700">{t('landing.whoIsItFor.person3')}</div>
                <div className="bg-slate-100/70 p-6 rounded-lg text-center font-semibold text-slate-700">{t('landing.whoIsItFor.person4')}</div>
            </div>
        </section>
        
        {/* Powered by AI Section */}
        <section className="py-16 bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-2xl my-10 shadow-2xl">
            <div className="max-w-4xl mx-auto px-6 text-center">
                <div className="flex justify-center items-center mb-4 w-16 h-16 bg-slate-700 text-primary-400 rounded-full mx-auto">
                    <BrainCircuitIcon />
                </div>
                <h2 className="text-3xl font-bold">{t('landing.poweredBy.title')}</h2>
                <p className="mt-4 max-w-2xl mx-auto text-slate-300">
                    {t('landing.poweredBy.description')}
                </p>
            </div>
        </section>

      </main>
      <footer className="text-center py-8 mt-12 text-gray-500 text-sm">
        <p>{t('footer.copyright').replace('{year}', new Date().getFullYear().toString())}</p>
      </footer>
    </div>
  );
};