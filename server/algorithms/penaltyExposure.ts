/**
 * Statutory Civic Penalty Exposure™
 * Proprietary Formula by Rohan Sharma, ZenoLabs.AI
 * 
 * P_Civil = Σ(w_k · l_k · v_k) · F_k
 * 
 * Components:
 * - w_k: Regulatory weight (Critical=1.0, High=0.8, Medium=0.6, Low=0.4)
 * - l_k: Likelihood score (0-1 based on risk and compliance)
 * - v_k: Violation severity factor
 * - F_k: Maximum statutory penalty ($1M BIS, €35M EU, $968M OFAC)
 * 
 * Output:
 * - Estimated penalty range in millions
 * - Non-compliant area count
 * - Formatted exposure display
 */

export interface PenaltyQuestion {
  id: string;
  category: string;
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
  response?: 'compliant' | 'partial' | 'non-compliant' | 'not-assessed';
  regulatoryBody: 'BIS' | 'EU' | 'OFAC' | 'GEOPOLITICAL';
}

export interface PenaltyExposureResult {
  totalExposure: number;
  byCategory: Record<string, number>;
  nonCompliantCount: number;
  formattedExposure: string;
}

const REGULATORY_WEIGHTS = {
  critical: 1.0,
  high: 0.8,
  medium: 0.6,
  low: 0.4,
};

const MAX_PENALTIES = {
  BIS: 1000000, // $1M USD
  EU: 35000000, // €35M
  OFAC: 968000000, // $968M USD
  GEOPOLITICAL: 5000000, // Estimated $5M for reputational/market access
};

export function calculatePenaltyExposure(questions: PenaltyQuestion[]): PenaltyExposureResult {
  let totalExposure = 0;
  const byCategory: Record<string, number> = {};
  let nonCompliantCount = 0;

  for (const question of questions) {
    const response = question.response || 'not-assessed';
    
    if (response === 'non-compliant' || response === 'partial') {
      const weight = REGULATORY_WEIGHTS[question.riskLevel];
      const likelihood = response === 'non-compliant' ? 0.9 : 0.5;
      const severityFactor = question.riskLevel === 'critical' ? 1.0 : 
                            question.riskLevel === 'high' ? 0.8 :
                            question.riskLevel === 'medium' ? 0.6 : 0.4;
      const maxPenalty = MAX_PENALTIES[question.regulatoryBody];
      
      const exposure = weight * likelihood * severityFactor * maxPenalty;
      totalExposure += exposure;
      
      if (!byCategory[question.category]) {
        byCategory[question.category] = 0;
      }
      byCategory[question.category] += exposure;
      
      if (response === 'non-compliant') {
        nonCompliantCount++;
      }
    }
  }

  return {
    totalExposure,
    byCategory,
    nonCompliantCount,
    formattedExposure: formatPenalty(totalExposure),
  };
}

function formatPenalty(amount: number): string {
  if (amount >= 1000000000) {
    return `$${(amount / 1000000000).toFixed(2)}B`;
  } else if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(2)}M`;
  } else if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`;
  } else {
    return `$${amount.toFixed(0)}`;
  }
}
