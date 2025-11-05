
import React, { useState, useCallback } from 'react';
import { PolicyInput } from './PolicyInput';
import { SimulationResults } from './SimulationResults';
import { simulatePolicy } from '../services/geminiService';
import type { SimulationData, UserRole, Region } from '../types';
import { Header } from './Header';
import { useTranslations } from '../lib/i18n';
import { RegionSelector } from './RegionSelector';
import { SparklesIcon, UsersIcon, GovernmentIcon } from './icons';

interface SimulatorProps {
  onBackToHome: () => void;
}

type Mode = 'single' | 'compare';

interface RoleCardProps {
    role: UserRole;
    title: string;
    description: string;
    icon: React.ReactNode;
    onSelect: () => void;
}

const RoleCard: React.FC<RoleCardProps> = ({ role, title, description, icon, onSelect }) => (
    <button
        onClick={onSelect}
        className="p-6 text-left border rounded-lg transition-all duration-200 flex items-start gap-4 bg-white/70 backdrop-blur-sm border-gray-300 hover:border-primary-400 hover:bg-gradient-to-br hover:from-primary-50 hover:to-white hover:ring-2 hover:ring-primary-300 w-full max-w-lg"
    >
        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full mt-1 bg-slate-100 text-slate-600">
            {icon}
        </div>
        <div>
            <h4 className="font-bold text-lg text-gray-800">{title}</h4>
            <p className="text-gray-600">{description}</p>
        </div>
    </button>
);

const RoleSelection: React.FC<{ onSelectRole: (role: UserRole) => void, language: 'en' | 'th' }> = ({ onSelectRole, language }) => {
    const { t } = useTranslations(language);
    return (
        <div className="flex flex-col items-center justify-center pt-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('roleSelection.title')}</h2>
            <p className="text-gray-500 mb-8">Select a view to match your needs.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                 <RoleCard 
                    role="citizen"
                    title={t('role.citizen')}
                    description={t('role.citizen.description')}
                    icon={<UsersIcon />}
                    onSelect={() => onSelectRole('citizen')}
                />
                <RoleCard 
                    role="policymaker"
                    title={t('role.policymaker')}
                    description={t('role.policymaker.description')}
                    icon={<GovernmentIcon />}
                    onSelect={() => onSelectRole('policymaker')}
                />
            </div>
        </div>
    )
};


export const Simulator: React.FC<SimulatorProps> = ({ onBackToHome }) => {
  const [language, setLanguage] = useState<'en' | 'th'>('en');
  const { t } = useTranslations(language);
  const [mode, setMode] = useState<Mode>('single');
  
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [region, setRegion] = useState<Region>('Nationwide');

  const [policyA, setPolicyA] = useState<string>('');
  const [userContextA, setUserContextA] = useState<string>('');
  const [simulationDataA, setSimulationDataA] = useState<SimulationData | null>(null);
  const [isLoadingA, setIsLoadingA] = useState<boolean>(false);
  const [errorA, setErrorA] = useState<string | null>(null);

  const [policyB, setPolicyB] = useState<string>('');
  const [userContextB, setUserContextB] = useState<string>('');
  const [simulationDataB, setSimulationDataB] = useState<SimulationData | null>(null);
  const [isLoadingB, setIsLoadingB] = useState<boolean>(false);
  const [errorB, setErrorB] = useState<string | null>(null);

  const runSimulation = useCallback(async (
    policy: string,
    userContext: string,
    setLoading: (l: boolean) => void, 
    setError: (e: string | null) => void, 
    setData: (d: SimulationData | null) => void
  ) => {
    if (!userRole) return;
    if (!policy.trim()) {
      setError(t('error.policyRequired'));
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await simulatePolicy(policy, language, region, userRole, userContext);
      setData(data);
    } catch (err) {
      console.error('Simulation failed:', err);
      setError(err instanceof Error ? err.message : t('error.simulationFailed'));
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [language, region, userRole, t]);

  const handleSimulateSingle = () => runSimulation(policyA, userContextA, setIsLoadingA, setErrorA, setSimulationDataA);
  
  const handleSimulateComparison = () => {
    runSimulation(policyA, userContextA, setIsLoadingA, setErrorA, setSimulationDataA);
    runSimulation(policyB, userContextB, setIsLoadingB, setErrorB, setSimulationDataB);
  };

  const handlePolicyAChangeAndSimulate = (newPolicy: string) => {
    setPolicyA(newPolicy);
    setTimeout(() => runSimulation(newPolicy, userContextA, setIsLoadingA, setErrorA, setSimulationDataA), 100);
  };

  const handlePolicyBChangeAndSimulate = (newPolicy: string) => {
    setPolicyB(newPolicy);
    setTimeout(() => runSimulation(newPolicy, userContextB, setIsLoadingB, setErrorB, setSimulationDataB), 100);
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'th' : 'en');
    setSimulationDataA(null);
    setSimulationDataB(null);
    setErrorA(null);
    setErrorB(null);
  };
  
  return (
    <div className="min-h-screen text-gray-800 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Header 
            language={language} 
            onToggleLanguage={toggleLanguage} 
            onBackToHome={onBackToHome}
            mode={mode}
            setMode={setMode}
        />

        <main className="mt-8">
          {!userRole ? (
            <RoleSelection onSelectRole={setUserRole} language={language} />
          ) : (
            <>
              {mode === 'single' ? (
                <PolicyInput
                  policy={policyA}
                  setPolicy={setPolicyA}
                  userContext={userContextA}
                  setUserContext={setUserContextA}
                  onSimulate={handleSimulateSingle}
                  isLoading={isLoadingA}
                  language={language}
                  region={region}
                  setRegion={setRegion}
                  title={t('policyInput.title')}
                  userRole={userRole}
                />
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                  <PolicyInput
                    policy={policyA}
                    setPolicy={setPolicyA}
                    userContext={userContextA}
                    setUserContext={setUserContextA}
                    onSimulate={() => {}} // No individual button
                    isLoading={isLoadingA}
                    language={language}
                    region={region}
                    setRegion={setRegion}
                    title={t('policyInput.titleA')}
                    userRole={userRole}
                  />
                   <PolicyInput
                    policy={policyB}
                    setPolicy={setPolicyB}
                    userContext={userContextB}
                    setUserContext={setUserContextB}
                    onSimulate={() => {}} // No individual button
                    isLoading={isLoadingB}
                    language={language}
                    region={region}
                    setRegion={setRegion}
                    title={t('policyInput.titleB')}
                    userRole={userRole}
                  />
                </div>
              )}
              
              {mode === 'compare' && (
                  <div className="mt-8 border-t border-gray-200 pt-8 flex flex-col items-center">
                      <div className="w-full max-w-lg mb-4">
                         <RegionSelector region={region} setRegion={setRegion} language={language} />
                      </div>
                       <button
                          onClick={handleSimulateComparison}
                          disabled={isLoadingA || isLoadingB || !policyA || !policyB || !userRole}
                          className="w-full max-w-sm bg-gradient-to-r from-primary-500 to-red-600 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {isLoadingA || isLoadingB ? t('policyInput.buttonLoading') : <><SparklesIcon /> {t('policyInput.buttonCompare')}</>}
                        </button>
                  </div>
              )}

              <div className={`grid grid-cols-1 ${mode === 'compare' && 'lg:grid-cols-2'} gap-8`}>
                  <div>
                      <SimulationResults
                        data={simulationDataA}
                        isLoading={isLoadingA}
                        error={errorA}
                        language={language}
                        policy={policyA}
                        onPolicyChange={handlePolicyAChangeAndSimulate}
                        userRole={userRole}
                      />
                  </div>
                   {mode === 'compare' && (
                       <div>
                           <SimulationResults
                            data={simulationDataB}
                            isLoading={isLoadingB}
                            error={errorB}
                            language={language}
                            policy={policyB}
                            onPolicyChange={handlePolicyBChangeAndSimulate}
                            userRole={userRole}
                          />
                       </div>
                   )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};
