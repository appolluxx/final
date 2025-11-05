

import React, { useState } from 'react';
import { SparklesIcon, PencilIcon, IdCardIcon, InfoIcon } from './icons';
import { useTranslations } from '../lib/i18n';
import type { UserRole, Region } from '../types';
import { RegionSelector } from './RegionSelector';

interface PolicyInputProps {
  policy: string;
  setPolicy: (policy: string) => void;
  userContext: string;
  setUserContext: (context: string) => void;
  onSimulate: () => void;
  isLoading: boolean;
  language: 'en' | 'th';
  region: Region;
  setRegion: (region: Region) => void;
  title: string;
  userRole: UserRole | null;
}

export const PolicyInput: React.FC<PolicyInputProps> = ({ policy, setPolicy, userContext, setUserContext, onSimulate, isLoading, language, region, setRegion, title, userRole }) => {
  const { t } = useTranslations(language);
  const [contextMode, setContextMode] = useState<'text' | 'thaiId'>('text');

  return (
    <div className="bg-white/70 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-200 h-full flex flex-col">
      
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-500">{t('policyInput.subtitle')}</p>
      </div>
      
      <div className="flex-grow flex flex-col gap-4">
          <div>
              <label htmlFor={`policy-input-${title}`} className="sr-only">{t('policyInput.title')}</label>
              <textarea
                id={`policy-input-${title}`}
                value={policy}
                onChange={(e) => setPolicy(e.target.value)}
                placeholder={t('policyInput.placeholder')}
                className="w-full h-36 p-4 bg-slate-50/80 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-500 transition-shadow duration-200 resize-none text-base"
                rows={6}
              />
              <p className="mt-2 text-xs text-gray-500">
                {t('policyInput.tip')}
              </p>
          </div>
          
          {/* Context Input Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('policyInput.context.label')}
            </label>
            {userRole === 'citizen' ? (
              <div>
                <div className="flex items-center bg-slate-100 rounded-lg p-1 space-x-1 mb-3">
                  <button onClick={() => setContextMode('text')} className={`flex-1 flex items-center justify-center px-3 py-1.5 text-sm font-semibold rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-400 ${contextMode === 'text' ? 'bg-white text-primary-600 shadow-sm' : 'bg-transparent text-slate-600 hover:bg-slate-200'}`}>
                    <PencilIcon /> {t('policyInput.context.describe')}
                  </button>
                  <button onClick={() => setContextMode('thaiId')} className={`flex-1 flex items-center justify-center px-3 py-1.5 text-sm font-semibold rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-400 ${contextMode === 'thaiId' ? 'bg-white text-primary-600 shadow-sm' : 'bg-transparent text-slate-600 hover:bg-slate-200'}`}>
                    <IdCardIcon /> {t('policyInput.context.thaiId')}
                  </button>
                </div>
                {contextMode === 'text' && (
                  <textarea
                    id={`context-input-${title}`}
                    value={userContext}
                    onChange={(e) => setUserContext(e.target.value)}
                    placeholder={t('policyInput.context.placeholder')}
                    className="w-full h-24 p-4 bg-slate-50/80 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-500 transition-shadow duration-200 resize-none text-base"
                    rows={3}
                  />
                )}
                {contextMode === 'thaiId' && (
                  <div className="w-full h-24 p-4 bg-slate-50/80 border border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-center">
                    <button className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-blue-700 transition-colors">
                      {t('policyInput.context.thaiIdButton')}
                    </button>
                    <p className="text-xs text-gray-500 mt-2">{t('policyInput.context.thaiIdPlaceholder')}</p>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <textarea
                  id={`context-input-${title}`}
                  value={userContext}
                  onChange={(e) => setUserContext(e.target.value)}
                  placeholder={t('policyInput.context.placeholder')}
                  className="w-full h-24 p-4 bg-slate-50/80 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-500 transition-shadow duration-200 resize-none text-base"
                  rows={3}
                />
                 <div className="mt-2 text-xs text-sky-700 bg-sky-50 p-2 rounded-md flex items-start gap-2">
                    <InfoIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>{t('results.socialListening.loaded')}</span>
                 </div>
              </div>
            )}
          </div>
      </div>

      <div className="mt-6 border-t border-gray-200 pt-6 flex flex-col gap-4">
        {/* Only show region selection in single mode context */}
        {!title.includes(t('policyInput.titleB')) && (
             <RegionSelector region={region} setRegion={setRegion} language={language} />
        )}
        
        <button
          onClick={onSimulate}
          disabled={isLoading || !policy || !userRole}
          className="w-full bg-gradient-to-r from-primary-500 to-red-600 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {t('policyInput.buttonLoading')}
            </>
          ) : (
           <>
             <SparklesIcon />
             {t('policyInput.button')}
           </>
          )}
        </button>
      </div>
    </div>
  );
};