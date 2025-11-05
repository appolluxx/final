
import React from 'react';
import type { ImpactMetric } from '../types';
import { GDPGrowthIcon, EmploymentRateIcon, InequalityIndexIcon, CO2EmissionsIcon, ArrowUpIcon, ArrowDownIcon, MinusIcon } from './icons';

interface DataCardProps {
  metric: ImpactMetric;
  onClick?: () => void;
}

const metricIcons: { [key: string]: React.ReactNode } = {
  'GDP Growth': <GDPGrowthIcon />,
  'Employment Rate': <EmploymentRateIcon />,
  'Inequality Index': <InequalityIndexIcon />,
  'CO₂ Emissions': <CO2EmissionsIcon />,
};

const getIconForMetric = (name: string) => {
    const lowerCaseName = name.toLowerCase();
    if (lowerCaseName.includes('gdp')) return metricIcons['GDP Growth'];
    if (lowerCaseName.includes('employment') || lowerCaseName.includes('job')) return metricIcons['Employment Rate'];
    if (lowerCaseName.includes('inequality')) return metricIcons['Inequality Index'];
    if (lowerCaseName.includes('emission') || lowerCaseName.includes('co2')) return metricIcons['CO₂ Emissions'];
    return metricIcons['GDP Growth']; // Default icon
};

const changeIcons = {
  positive: <ArrowUpIcon className="text-green-700" />,
  negative: <ArrowDownIcon className="text-red-700" />,
  neutral: <MinusIcon className="text-slate-700" />,
};

// Colors adhering to research spec: high-contrast for accessibility
const impactStyles = {
    'Significant Improvement': { bg: 'bg-green-200', text: 'text-green-900', border: 'border-green-400', arrow: <ArrowUpIcon className="text-green-700" /> },
    'Moderate Improvement': { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300', arrow: <ArrowUpIcon className="text-green-700" /> },
    'Neutral': { bg: 'bg-slate-100', text: 'text-slate-800', border: 'border-slate-300', arrow: <MinusIcon className="text-slate-700" /> },
    'Moderate Headwind': { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300', arrow: <ArrowDownIcon className="text-red-700" /> },
    'Significant Headwind': { bg: 'bg-red-200', text: 'text-red-900', border: 'border-red-400', arrow: <ArrowDownIcon className="text-red-700" /> },
};


export const DataCard: React.FC<DataCardProps> = ({ metric, onClick }) => {
  const isPolicymaker = !!metric.impactAssessment;

  if (isPolicymaker) {
    const styles = impactStyles[metric.impactAssessment!] ?? impactStyles['Neutral'];
    return (
      <div 
        onClick={onClick} 
        className={`p-4 rounded-xl border ${styles.border} ${styles.bg} transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${onClick ? 'cursor-pointer' : ''}`}
      >
        <p className="text-sm font-medium text-slate-600">{metric.name}</p>
        <div className="flex items-baseline justify-between mt-1">
          <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
          <p className={`text-sm font-semibold ${styles.text}`}>{metric.delta}</p>
        </div>
        <div className="flex items-center gap-2 mt-3 text-sm">
          <div className="flex-shrink-0">{styles.arrow}</div>
          <span className={`font-semibold ${styles.text}`}>{metric.impactAssessment}</span>
        </div>
      </div>
    );
  }
  
  // Citizen View
  const citizenChangeColors = {
    positive: { bg: 'bg-green-50', text: 'text-green-800' },
    negative: { bg: 'bg-red-50', text: 'text-red-800' },
    neutral: { bg: 'bg-slate-100', text: 'text-slate-700' },
  };
  const colors = citizenChangeColors[metric.change];

  return (
    <div className={`bg-white p-5 rounded-xl border border-gray-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-500">{metric.name}</p>
          <p className="text-2xl font-bold text-gray-800">{metric.value}</p>
        </div>
        <div className={`w-10 h-10 flex items-center justify-center ${colors.bg} rounded-full`}>
          {getIconForMetric(metric.name)}
        </div>
      </div>
      <div className="flex items-center gap-1.5 mt-4 text-sm text-gray-700">
        <div className="flex-shrink-0">{changeIcons[metric.change]}</div>
        <span>{metric.summary}</span>
      </div>
    </div>
  );
};
