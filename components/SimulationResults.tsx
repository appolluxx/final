

import React, { useState, useEffect } from 'react';
import type { SimulationData, KeyVariable, QuarterlyDataPoint, PolicyRecommendation, UserRole, SectorImpact, GlobalCaseStudy, Sector, SocialListeningAnalysis } from '../types';
import { DataCard } from './DataCard';
import { ImpactChart } from './ImpactChart';
import { InfoIcon, LightbulbIcon, LinkIcon, SendIcon, ChatBubbleIcon } from './icons';
import { useTranslations } from '../lib/i18n';

interface SimulationResultsProps {
  data: SimulationData | null;
  isLoading: boolean;
  error: string | null;
  language: 'en' | 'th';
  policy: string;
  onPolicyChange: (newPolicy: string) => void;
  userRole: UserRole;
}

const SkeletonCard: React.FC = () => (
  <div className="bg-slate-100 p-4 rounded-xl animate-pulse">
    <div className="h-4 bg-slate-300 rounded w-3/4 mb-3"></div>
    <div className="h-8 bg-slate-300 rounded w-1/2 mb-3"></div>
    <div className="h-3 bg-slate-300 rounded w-full"></div>
  </div>
);

const SkeletonSection: React.FC<{ hasTitle?: boolean }> = ({ hasTitle = true }) => (
    <div className="space-y-4">
        {hasTitle && <div className="h-6 bg-slate-200 rounded w-1/2"></div>}
        <div className="bg-slate-100 p-4 rounded-xl animate-pulse space-y-3">
            <div className="h-4 bg-slate-300 rounded w-3/4"></div>
            <div className="h-4 bg-slate-300 rounded w-full"></div>
            <div className="h-4 bg-slate-300 rounded w-5/6"></div>
        </div>
    </div>
);


const ChartModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  kpiName: string;
  data: QuarterlyDataPoint[];
  language: 'en' | 'th';
}> = ({ isOpen, onClose, kpiName, data, language }) => {
  const { t } = useTranslations(language);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-full max-h-[70vh] flex flex-col p-6" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">{t('results.forecastTitle')}: {kpiName}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">&times;</button>
        </div>
        <div className="flex-grow">
          <ImpactChart data={data} kpiName={kpiName} />
        </div>
      </div>
    </div>
  );
};

const RecommendationCard: React.FC<{ rec: PolicyRecommendation, language: 'en' | 'th' }> = ({ rec, language }) => {
    const { t } = useTranslations(language);

    const riskColors = {
        Low: 'bg-green-100 text-green-800',
        Medium: 'bg-yellow-100 text-yellow-800',
        High: 'bg-red-100 text-red-800',
    };

    return (
        <div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">{t('results.recommendationTitle')}</h3>
            <div className="bg-slate-50 p-4 rounded-lg border border-gray-200 space-y-4">
                <p className="text-lg font-semibold text-primary-700">{rec.RecommendationSummary}</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-white p-3 rounded-md border">
                        <p className="font-semibold text-gray-500">{t('results.rec.ministry')}</p>
                        <p className="text-gray-800">{rec.ProposedMinistryAgency}</p>
                    </div>
                    <div className="bg-white p-3 rounded-md border">
                        <p className="font-semibold text-gray-500">{t('results.rec.impactScore')}</p>
                        <p className="text-gray-800 font-bold text-lg">{rec.PredictedImpactScore} / 10</p>
                    </div>
                    <div className="bg-white p-3 rounded-md border">
                        <p className="font-semibold text-gray-500">{t('results.rec.riskScore')}</p>
                        <p className={`font-bold px-2 py-0.5 rounded-full inline-block ${riskColors[rec.AI_GovernanceRiskScore]}`}>{rec.AI_GovernanceRiskScore}</p>
                    </div>
                </div>

                <div>
                    <h4 className="font-semibold text-gray-700 mb-2">{t('results.rec.steps')}</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                        {rec.ImplementationSteps.map((step, i) => <li key={i}>{step}</li>)}
                    </ul>
                </div>

                <div>
                    <h4 className="font-semibold text-gray-700 mb-2">{t('results.rec.risks')}</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                         {rec.AssociatedRisksTradeoffs.map((risk, i) => <li key={i}>{risk}</li>)}
                    </ul>
                </div>
            </div>
        </div>
    );
};

const SectorAnalysis: React.FC<{ impacts: SectorImpact[], language: 'en' | 'th' }> = ({ impacts, language }) => {
    const { t } = useTranslations(language);
    const [expandedSector, setExpandedSector] = useState<Sector | null>(null);

    const getHeatmapColor = (score: number) => {
        if (score > 3) return 'bg-green-600';
        if (score > 1) return 'bg-green-400';
        if (score >= -1) return 'bg-slate-300';
        if (score >= -3) return 'bg-red-400';
        return 'bg-red-600';
    };

    return (
        <div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">{t('results.sectorAnalysisTitle')}</h3>
            <div className="bg-slate-50 p-4 rounded-lg border border-gray-200 space-y-4">
                <h4 className="font-semibold text-gray-700">{t('results.heatmapTitle')}</h4>
                <div className="grid grid-cols-5 gap-2 text-center text-xs font-semibold text-white">
                    {impacts.map((impact, index) => (
                        <div 
                           key={impact.sector} 
                           className={`p-2 rounded ${getHeatmapColor(impact.impactScore)} animate-fade-in-slide-up`}
                           style={{ animationDelay: `${0.05 * index}s` }}
                        >
                            {t(`sectors.${impact.sector}`)}
                        </div>
                    ))}
                </div>
                <div className="space-y-2 pt-2">
                    {impacts.map(impact => (
                        <div key={impact.sector}>
                            <button onClick={() => setExpandedSector(prev => prev === impact.sector ? null : impact.sector)} className="w-full text-left font-semibold text-gray-800 flex justify-between items-center py-1">
                                <span>{t(`sectors.${impact.sector}`)}</span>
                                <svg className={`w-4 h-4 transition-transform duration-300 text-gray-500 ${expandedSector === impact.sector ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </button>
                            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${expandedSector === impact.sector ? 'max-h-40 mt-1 opacity-100' : 'max-h-0 opacity-0'}`}>
                                <p className="text-sm text-gray-600 pl-2 border-l-2 border-primary-300 pt-1 pb-1">
                                    {impact.summary}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const GlobalCases: React.FC<{ cases: GlobalCaseStudy[], language: 'en' | 'th' }> = ({ cases, language }) => {
    const { t } = useTranslations(language);

    return (
        <div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">{t('results.globalCasesTitle')}</h3>
            <div className="space-y-4">
                {cases.map((study, i) => (
                    <div key={i} className="bg-slate-50 p-4 rounded-lg border border-gray-200">
                        <p className="font-bold text-gray-800">{study.country}: <span className="font-medium">{study.policy}</span></p>
                        <p className="text-sm text-gray-600 mt-1"><span className="font-semibold">{t('results.rec.outcome')}:</span> {study.outcome}</p>
                        <p className="text-sm text-gray-600 mt-1"><span className="font-semibold">{t('results.rec.relevance')}:</span> {study.relevance}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const SocialListeningAnalysisCard: React.FC<{ analysis: SocialListeningAnalysis, language: 'en' | 'th' }> = ({ analysis, language }) => {
    const { t } = useTranslations(language);

    const sentimentStyles = {
        Positive: 'bg-green-100 text-green-800',
        Negative: 'bg-red-100 text-red-800',
        Mixed: 'bg-yellow-100 text-yellow-800',
        Neutral: 'bg-slate-200 text-slate-800',
    };

    return (
        <div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">{t('results.socialListeningTitle')}</h3>
            <div className="bg-slate-50 p-4 rounded-lg border border-gray-200 space-y-4">
                <div>
                    <h4 className="font-semibold text-gray-700 mb-2">{t('results.socialListening.sentiment')}</h4>
                    <p className={`font-bold px-3 py-1 rounded-full inline-block text-sm ${sentimentStyles[analysis.overallSentiment]}`}>{analysis.overallSentiment}</p>
                    <p className="text-sm text-gray-600 mt-2">{analysis.summary}</p>
                </div>
                 <div>
                    <h4 className="font-semibold text-gray-700 mb-2">{t('results.socialListening.discussion')}</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                        {analysis.keyDiscussionPoints.map((point, i) => <li key={i}>{point}</li>)}
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold text-gray-700 mb-2">{t('results.socialListening.hashtags')}</h4>
                    <div className="flex flex-wrap gap-2">
                        {analysis.potentialViralHashtags.map((tag, i) => (
                           <span key={i} className="bg-sky-100 text-sky-800 text-xs font-semibold px-2.5 py-1 rounded-full">{tag}</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};


export const SimulationResults: React.FC<SimulationResultsProps> = ({ data, isLoading, error, language, userRole }) => {
  const { t } = useTranslations(language);
  const [showSources, setShowSources] = useState(false);
  const [showSuggestionSent, setShowSuggestionSent] = useState(false);
  const [chartModalData, setChartModalData] = useState<{ kpiName: string; data: QuarterlyDataPoint[] } | null>(null);

  useEffect(() => {
    setShowSources(false);
    setChartModalData(null);
    setShowSuggestionSent(false);
  }, [data]);

  const handleSendSuggestion = () => {
    setShowSuggestionSent(true);
    setTimeout(() => {
      setShowSuggestionSent(false);
    }, 3000);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard />
          </div>
          {userRole === 'policymaker' && <SkeletonSection hasTitle />}
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <SkeletonSection />
                    <SkeletonSection />
                </div>
                <div className="lg:col-span-1 space-y-8">
                    <SkeletonSection />
                </div>
           </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[200px] bg-red-50 text-red-700 rounded-lg p-6 text-center">
          <InfoIcon /><p className="font-semibold mt-2">{t('results.errorTitle')}</p><p className="text-sm">{error}</p>
        </div>
      );
    }

    if (!data) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[200px] bg-primary-50 text-primary-700 rounded-lg p-6 text-center">
          <LightbulbIcon /><p className="font-semibold mt-2">{t('results.placeholderTitle')}</p><p className="text-sm">{t('results.placeholderSubtitle')}</p>
        </div>
      );
    }

    // Citizen View
    if (userRole === 'citizen') {
        return (
            <div className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data.metrics.map((metric, index) => ( 
                       <div key={index} className="animate-fade-in-slide-up" style={{ animationDelay: `${0.1 * index}s` }}>
                         <DataCard metric={metric} /> 
                       </div>
                    ))}
                </div>
                <div className="animate-fade-in-slide-up" style={{ animationDelay: '0.2s' }}>
                    <h3 className="text-xl font-bold text-gray-800 mb-3">{t('results.summaryTitle')}</h3>
                    <div className="text-gray-600 bg-slate-50 p-4 rounded-lg border border-gray-200 space-y-4">
                        {Object.entries(data.overallSummary).map(([topic, content]) => (
                            <div key={topic}>
                                <h4 className="font-semibold text-gray-800">{topic}</h4>
                                <p>{content}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="border-t pt-6 space-y-4 animate-fade-in-slide-up" style={{ animationDelay: '0.3s' }}>
                    <div>
                        <button
                            onClick={() => setShowSources(!showSources)}
                            disabled={!data.sources || data.sources.length === 0}
                            className="w-full bg-slate-100 text-slate-700 font-semibold py-3 px-6 rounded-lg shadow-sm hover:bg-slate-200 transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:hover:bg-slate-100"
                        >
                            <LinkIcon />
                            {data.sources && data.sources.length > 0
                                ? (showSources ? t('results.hideSource') : t('results.viewSource'))
                                : t('results.noSources')
                            }
                        </button>
                        {showSources && data.sources && data.sources.length > 0 && (
                            <div className="mt-4">
                            <h3 className="text-xl font-bold text-gray-800 mb-3">{t('results.sourcesTitle')}</h3>
                            <div className="bg-slate-50 p-4 rounded-lg border border-gray-200 space-y-3">
                                {data.sources.map((source, index) => (
                                <a href={source.uri} target="_blank" rel="noopener noreferrer" key={index} className="flex items-start gap-3 text-sm text-primary-700 hover:underline">
                                    <LinkIcon /> <span className="truncate">{source.title}</span>
                                </a>
                                ))}
                            </div>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={handleSendSuggestion} className="bg-slate-100 text-slate-700 font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-slate-200 transition-all duration-300 flex items-center gap-2">
                            <SendIcon />
                            {t('results.sendSuggestion')}
                        </button>
                        {showSuggestionSent && (
                             <p className="text-green-600 font-semibold text-sm">
                                {t('results.suggestionSent')}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Policymaker View
    if (userRole === 'policymaker') {
      return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.metrics.map((metric, index) => ( 
            <div key={index} className="animate-fade-in-slide-up" style={{ animationDelay: `${0.1 * index}s` }}>
                <DataCard 
                    metric={metric} 
                    onClick={() => data.forecastData && data.forecastData[metric.name] && setChartModalData({ kpiName: metric.name, data: data.forecastData[metric.name] })}
                /> 
            </div>
          ))}
        </div>
        
        {data.kpiSummary && (
            <div className="animate-fade-in-slide-up" style={{ animationDelay: '0.2s' }}>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{t('results.kpiSummaryTitle')}</h3>
                <div className="text-gray-600 bg-slate-50 p-4 rounded-lg border border-gray-200">
                    <p>{data.kpiSummary}</p>
                </div>
            </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {data.recommendation && <div className="animate-fade-in-slide-up" style={{ animationDelay: '0.3s' }}><RecommendationCard rec={data.recommendation} language={language} /></div>}
              {data.sectoralImpacts && data.sectoralImpacts.length > 0 && <div className="animate-fade-in-slide-up" style={{ animationDelay: '0.4s' }}><SectorAnalysis impacts={data.sectoralImpacts} language={language} /></div>}
              {data.socialListeningAnalysis && <div className="animate-fade-in-slide-up" style={{ animationDelay: '0.5s' }}><SocialListeningAnalysisCard analysis={data.socialListeningAnalysis} language={language} /></div>}
              {data.globalCaseStudies && data.globalCaseStudies.length > 0 && <div className="animate-fade-in-slide-up" style={{ animationDelay: '0.6s' }}><GlobalCases cases={data.globalCaseStudies} language={language} /></div>}
            </div>
            <div className="lg:col-span-1 space-y-8 animate-fade-in-slide-up" style={{ animationDelay: '0.35s' }}>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{t('results.summaryTitle')}</h3>
                <div className="text-gray-600 bg-slate-50 p-4 rounded-lg border border-gray-200 space-y-4">
                    {Object.entries(data.overallSummary).map(([topic, content]) => (
                        <div key={topic}>
                            <h4 className="font-semibold text-gray-800">{topic}</h4>
                            <p>{content}</p>
                        </div>
                    ))}
                </div>
              </div>
              
              <div>
                  <button 
                      onClick={() => setShowSources(!showSources)}
                      disabled={!data.sources || data.sources.length === 0}
                      className="w-full bg-slate-100 text-slate-700 font-semibold py-3 px-6 rounded-lg shadow-sm hover:bg-slate-200 transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:hover:bg-slate-100"
                  >
                      <LinkIcon />
                      {data.sources && data.sources.length > 0
                          ? (showSources ? t('results.hideSource') : t('results.viewSource'))
                          : t('results.noSources')
                      }
                  </button>
                  {showSources && data.sources && data.sources.length > 0 && (
                      <div className="mt-4">
                          <h3 className="text-xl font-bold text-gray-800 mb-3">{t('results.sourcesTitle')}</h3>
                          <div className="bg-slate-50 p-4 rounded-lg border border-gray-200 space-y-3">
                              {data.sources.map((source, index) => (
                                  <a href={source.uri} target="_blank" rel="noopener noreferrer" key={index} className="flex items-start gap-3 text-sm text-primary-700 hover:underline">
                                      <LinkIcon /> <span className="truncate">{source.title}</span>
                                  </a>
                              ))}
                          </div>
                      </div>
                  )}
              </div>

              <div className="flex items-center gap-4">
                <button onClick={handleSendSuggestion} className="bg-slate-100 text-slate-700 font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-slate-200 transition-all duration-300 flex items-center gap-2">
                    <SendIcon />
                    {t('results.sendSuggestion')}
                </button>
                {showSuggestionSent && (
                        <p className="text-green-600 font-semibold text-sm">
                        {t('results.suggestionSent')}
                    </p>
                )}
              </div>
            </div>
        </div>
        <ChartModal 
            isOpen={!!chartModalData}
            onClose={() => setChartModalData(null)}
            kpiName={chartModalData?.kpiName ?? ''}
            data={chartModalData?.data ?? []}
            language={language}
        />
      </div>
    );
    }

    return null;
  };
  
  return (
    <section className="mt-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-800">{t('results.title')}</h2>
                {data && userRole === 'policymaker' && !isLoading && (
                    <span className="bg-sky-100 text-sky-800 text-xs font-medium px-2.5 py-0.5 rounded-full animate-fade-in-slide-up">
                        ✓ {t('results.socialListening.loaded')}
                    </span>
                )}
            </div>
        </div>
        <div className="transition-all duration-500">
            {renderContent()}
        </div>
    </section>
  );
};