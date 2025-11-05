
import { GoogleGenAI } from "@google/genai";
import type { SimulationData, Source, Region, UserRole } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const getCitizenPrompt = (policy: string, language: 'en' | 'th', region: Region, userContext?: string): string => `
You are a socio-economic policy simulator designed for the general public. Your task is to analyze a policy from a neutral, comprehensive viewpoint and return a simplified, easy-to-understand summary of its potential impact as a single, valid JSON object. Do not include any text outside the JSON object.

**POLICY DETAILS**
- Policy: "${policy}"
- Language for Output: ${language === 'th' ? 'Thai' : 'English'}.
- Region for Analysis: ${region}.
${userContext ? `
**USER CONTEXT FOR SIMULATION**
- User's role/situation: "${userContext}"
- **Crucially, analyze the policy's impact specifically for this person/situation.** Tailor the metrics and summaries to be directly relevant to their context.
` : ''}
**SIMULATION REQUIREMENTS**
1.  **Simplify Metrics:** Translate complex economic indicators into relatable, outcome-focused metrics. Provide a maximum of three.
2.  **Focus on Tangible Impact:** Explain what the policy means for a person's daily life (e.g., finances, time, service quality).
3.  **Topic-Based Summary:** The 'overallSummary' must be a JSON object containing 2-3 topics. Each key should be a topic title, and the value should be a descriptive paragraph.

**JSON OUTPUT STRUCTURE**
{
  "metrics": [
    {
      "name": "string", // Relatable metric name, e.g., "Household Costs", "Job Market Health", "Public Service Quality".
      "value": "string", // Simple status, e.g., "May Increase Slightly", "Improving", "Faster".
      "change": "string", // "positive", "negative", or "neutral".
      "summary": "string" // 1-sentence summary of the impact on a person.
    }
  ],
  "overallSummary": {
    "Topic Title 1": "A paragraph explaining the first key impact on citizens.",
    "Topic Title 2": "A paragraph explaining the second key impact or consideration."
  },
  "keyVariable": null
}
`;

const getPolicymakerPrompt = (policy: string, language: 'en' | 'th', region: Region, userContext?: string): string => `
You are a sophisticated, expert-level socio-economic policy simulator designed for policymakers. Your task is to provide a granular, data-driven simulation of a policy's impact from a neutral, holistic viewpoint. Your entire response must be a single, valid JSON object, strictly adhering to the specified schema. **Crucially, ensure there are no trailing commas in any arrays or objects.** Do not include any text, explanation, or markdown formatting like "\`\`\`json" outside of the JSON object.

**POLICY DETAILS**
- Policy: "${policy}"
- Language for Output: ${language === 'th' ? 'Thai' : 'English'}. All text must be in this language.
- Region for Analysis: ${region}.
${userContext ? `
**USER CONTEXT FOR SIMULATION**
- User's role/situation: "${userContext}"
- **Crucially, analyze the policy's impact specifically for this user's context.** While maintaining a policymaker's perspective, ensure the analysis, summaries, and recommendations consider the implications for this specific group or individual.
` : ''}
**SIMULATION & ANALYSIS REQUIREMENTS**
1.  **Grounding & Sourcing:** You MUST actively use Google Search to find recent, relevant data, reports, and news articles to ground your analysis. All key statistics, forecasts, and assessments must be informed by real-world information.
2.  **Policy Classification:** First, classify the policy into ONE primary category: "Economic/Fiscal", "Social/Welfare", "Security/Regulation", or "Infrastructure/Resource".
3.  **KPI Generation:** Based on the classification, generate predictions for 3-4 relevant Key Performance Indicators (KPIs). For each KPI, provide its name, predicted value, the change (delta), and a qualitative impact assessment.
4.  **5-Year Quarterly Forecast:** For EACH generated KPI, provide a 5-year (20 quarters) time-series forecast. The forecast must include the mean predicted value, and a 90% confidence interval (lower and upper bounds) for each quarter.
5.  **Structured Recommendation:** Generate one highly-structured, actionable policy recommendation based on your analysis, following the detailed schema. You must infer the appropriate ministry.
6.  **Topic-Based Summary:** The 'overallSummary' must be a JSON object containing 2-4 key topics (e.g., "Strategic Analysis", "Implementation Challenges"). The content should be deep, nuanced, and advanced for a policymaker audience.
7.  **Sectoral Impact Analysis:** Analyze the policy's impact on five key sectors: 'Retail', 'Tourism', 'Manufacturing', 'Logistics', 'Agricultural'. For each, provide a concise summary and an 'impactScore' on a scale from -5 (highly negative) to +5 (highly positive).
8.  **Historical Precedent Analysis:** Using Google Search, identify 1-2 highly relevant historical examples of similar policies implemented in other countries. For each, describe the country, the policy, its outcome, and its relevance to the current proposal.
9.  **KPI Summary:** After generating all other data, write a single, concise paragraph that synthesizes the key insights from the four main KPIs. This must be a high-level executive summary.
10. **Social Listening Analysis:** Predict the public's reaction on social media platforms like X (Twitter) and Facebook. Analyze the likely overall sentiment (Positive, Negative, Mixed, Neutral), key discussion points that will emerge, potential viral hashtags, and provide a summary of the expected online discourse.

**MANDATORY JSON OUTPUT STRUCTURE**
{
  "policyCategory": "Economic/Fiscal",
  "metrics": [
    {
      "name": "Unemployment Rate",
      "value": "3.9%",
      "change": "negative",
      "delta": "+0.1%",
      "impactAssessment": "Moderate Headwind",
      "summary": "The policy is projected to cause a slight increase in the unemployment rate."
    },
    {
      "name": "GDP Growth",
      "value": "2.5%",
      "change": "positive",
      "delta": "+0.3%",
      "impactAssessment": "Moderate Improvement",
      "summary": "A moderate boost to GDP growth is expected."
    }
  ],
  "forecastData": {
    "Unemployment Rate": [
      { "quarter": 1, "year": 1, "value": 3.8, "lowerBound": 3.7, "upperBound": 3.9 },
      { "quarter": 2, "year": 1, "value": 3.8, "lowerBound": 3.7, "upperBound": 3.9 }
    ],
    "GDP Growth": [
      { "quarter": 1, "year": 1, "value": 2.2, "lowerBound": 2.1, "upperBound": 2.3 }
    ]
  },
  "overallSummary": {
    "Strategic Analysis": "A paragraph on the strategic implications.",
    "Implementation Challenges": "A paragraph outlining potential hurdles."
  },
  "recommendation": {
    "PolicyActionID": "REC-001",
    "RecommendationSummary": "A summary of the policy recommendation.",
    "ProposedMinistryAgency": "Ministry of Finance",
    "AssociatedPolicyCategory": "Fiscal Policy",
    "PredictedImpactScore": 7.2,
    "ImplementationTimeline": "6-12 Months",
    "AI_GovernanceRiskScore": "Medium",
    "ImplementationSteps": [
      "First implementation step.",
      "Second implementation step."
    ],
    "AssociatedRisksTradeoffs": [
      "A potential risk or tradeoff."
    ]
  },
  "sectoralImpacts": [
    { "sector": "Retail", "impactScore": -2, "summary": "A brief summary of the impact on the retail sector." },
    { "sector": "Tourism", "impactScore": 3, "summary": "A brief summary of the impact on the tourism sector." }
  ],
  "globalCaseStudies": [
    { "country": "Example Country", "policy": "Similar Policy Name", "outcome": "Observed outcome.", "relevance": "Relevance to the current proposal." }
  ],
  "socialListeningAnalysis": {
    "overallSentiment": "Mixed",
    "keyDiscussionPoints": [
      "Debates on the fairness of the policy.",
      "Concerns about the impact on specific demographics."
    ],
    "potentialViralHashtags": [
      "#PolicyDebate",
      "#EconomicImpact"
    ],
    "summary": "The policy is expected to generate significant online debate, with sentiment likely divided."
  },
  "kpiSummary": "A concise, single-paragraph summary of the main KPI takeaways.",
  "keyVariable": null
}
`;

export const simulatePolicy = async (policy: string, language: 'en' | 'th', region: Region, userRole: UserRole, userContext?: string): Promise<SimulationData> => {
  
  const prompt = userRole === 'policymaker'
    ? getPolicymakerPrompt(policy, language, region, userContext)
    : getCitizenPrompt(policy, language, region, userContext);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{googleSearch: {}}],
        temperature: 0.3,
      },
    });

    let jsonText = response.text.trim();
    
    if (jsonText.startsWith("```json")) {
      jsonText = jsonText.slice(7, -3).trim();
    }
    
    const data = JSON.parse(jsonText);

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
    const sources: Source[] = groundingChunks
      .map(chunk => chunk.web)
      .filter((web): web is { uri: string; title: string } => !!web?.uri && !!web?.title)
      .map(web => ({ title: web.title, uri: web.uri }));
    
    if (!data.metrics || !data.overallSummary || typeof data.overallSummary !== 'object') {
      throw new Error("Invalid data structure received from API.");
    }
    
    data.sources = sources;

    // Ensure forecastData keys match metric names for policymakers
    if (userRole === 'policymaker' && data.forecastData && data.metrics) {
        const forecastKeys = Object.keys(data.forecastData);
        const metricNames = data.metrics.map((m: any) => m.name);
        if (forecastKeys.length !== metricNames.length || !metricNames.every((name: string) => forecastKeys.includes(name))) {
            console.warn("Mismatch between KPI names in metrics and forecastData keys. Attempting to align.");
            // This is a failsafe. A good prompt should prevent this.
            const alignedForecastData: { [key: string]: any } = {};
            metricNames.forEach((name: string, index: number) => {
                if (forecastKeys[index]) {
                    alignedForecastData[name] = data.forecastData[forecastKeys[index]];
                }
            });
            data.forecastData = alignedForecastData;
        }
    }


    return data as SimulationData;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof SyntaxError) {
      console.error("Failed to parse JSON response from API. Response text:", (error as any).source);
      throw new Error("The simulation returned data in an unexpected format. Please try rephrasing your policy.");
    }
    throw new Error("Failed to get simulation results. Please try again.");
  }
};