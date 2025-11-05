

export type UserRole = 'citizen' | 'policymaker';
// FIX: Add Perspective type definition to resolve import error in PerspectiveToggle.tsx
export type Perspective = 'Citizen' | 'Business Owner' | 'Student' | 'Environment';
export type Region = 'Nationwide' | 'Bangkok' | 'Chiang Mai' | 'Phuket' | 'Khon Kaen' | 'Chonburi' | 'Songkhla' | 'Nakhon Ratchasima';

export const regions: Region[] = ['Nationwide', 'Bangkok', 'Chiang Mai', 'Phuket', 'Khon Kaen', 'Chonburi', 'Songkhla', 'Nakhon Ratchasima'];

// Unified metric type for both Citizen and Policymaker views
export interface ImpactMetric {
  name: string; // e.g., "Job Market Health" (Citizen) or "Unemployment Rate" (Policymaker)
  value: string; // e.g., "Improving" (Citizen) or "4.1%" (Policymaker)
  change: 'positive' | 'negative' | 'neutral';
  summary: string; // Narrative summary
  
  // Policymaker-specific fields
  delta?: string; // e.g., "+0.2%"
  impactAssessment?: 'Significant Improvement' | 'Moderate Improvement' | 'Neutral' | 'Moderate Headwind' | 'Significant Headwind';
}

// For the 5-year quarterly forecast
export interface QuarterlyDataPoint {
  quarter: number; // 1-20
  year: number; // 1-5
  value: number; // mean prediction
  lowerBound: number;
  upperBound: number;
}

// For the structured recommendation
export interface PolicyRecommendation {
  PolicyActionID: string;
  RecommendationSummary: string;
  ProposedMinistryAgency: string;
  AssociatedPolicyCategory: string;
  PredictedImpactScore: number;
  ImplementationTimeline: string;
  AI_GovernanceRiskScore: 'Low' | 'Medium' | 'High';
  ImplementationSteps: string[];
  AssociatedRisksTradeoffs: string[];
}

export interface Source {
  title: string;
  uri: string;
}

export interface KeyVariable {
  name: string;
  value: number;
  unit: string;
}

// Policymaker Specific - Sector Analysis
export type Sector = 'Retail' | 'Tourism' | 'Manufacturing' | 'Logistics' | 'Agricultural';
export const sectors: Sector[] = ['Retail', 'Tourism', 'Manufacturing', 'Logistics', 'Agricultural'];

export interface SectorImpact {
  sector: Sector;
  impactScore: number; // From -5 (highly negative) to +5 (highly positive)
  summary: string;
}

// Policymaker Specific - Global Precedents
export interface GlobalCaseStudy {
  country: string;
  policy: string;
  outcome: string;
  relevance: string;
}

// Policymaker Specific - Social Listening
export interface SocialListeningAnalysis {
  overallSentiment: 'Positive' | 'Negative' | 'Mixed' | 'Neutral';
  keyDiscussionPoints: string[];
  potentialViralHashtags: string[];
  summary: string;
}


// A single, unified data structure to accommodate both user roles
export interface SimulationData {
  metrics: ImpactMetric[]; // For Citizens, this holds simplified metrics. For Policymakers, it holds detailed KPIs.
  overallSummary: { [key: string]: string };
  sources: Source[];
  keyVariable?: KeyVariable | null;

  // Policymaker-specific fields
  policyCategory?: string;
  forecastData?: {
    [kpiName: string]: QuarterlyDataPoint[];
  };
  recommendation?: PolicyRecommendation;
  sectoralImpacts?: SectorImpact[];
  globalCaseStudies?: GlobalCaseStudy[];
  kpiSummary?: string;
  socialListeningAnalysis?: SocialListeningAnalysis;
}