
import React from 'react';
import { useTranslations } from '../lib/i18n';
import { Region, regions } from '../types';

interface RegionSelectorProps {
    region: Region;
    setRegion: (region: Region) => void;
    language: 'en' | 'th';
}

export const RegionSelector: React.FC<RegionSelectorProps> = ({ region, setRegion, language }) => {
    const { t, T } = useTranslations(language);

    return (
        <div>
            <label htmlFor="region-select" className="block text-sm font-medium text-gray-700 mb-1">
                {t('region.label')}
            </label>
            <select
                id="region-select"
                value={region}
                onChange={(e) => setRegion(e.target.value as Region)}
                className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-500 transition-shadow duration-200"
            >
                {regions.map((r) => (
                    <option key={r} value={r}>
                        {T(r)}
                    </option>
                ))}
            </select>
        </div>
    );
};
