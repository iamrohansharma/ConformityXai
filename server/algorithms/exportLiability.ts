/**
 * Automated Export Liability Index™
 * Proprietary Formula by Rohan Sharma, ZenoLabs.AI
 * 
 * S_Export = (Σ(w_i × c_i) - Σ(r_j × p_j)) / (Σ(w_i) + Σ(r_j)) × 100
 * 
 * Components:
 * - w_i: Regulatory weight (Critical=10, High=7, Medium=5, Low=3)
 * - c_i: Completion status (Compliant=1.0, Partial=0.5, Non-compliant=0.0)
 * - r_j: Risk vector (dynamically scaled by violation severity)
 * - p_j: Penalty coefficient (scales with fine brackets)
 * 
 * Features:
 * - Weighted compliance assessment
 * - Dynamic risk vectorization
 * - Response-based penalty integration
 * - Normalized scoring (0-100%)
 * - Bonus scoring for excellent compliance (≥90% completion + no critical risks = +15%)
 */

export interface ExportQuestion {
  id: string;
  category: string;
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
  response?: 'compliant' | 'partial' | 'non-compliant' | 'not-assessed';
  maxPenalty: number;
}

export interface ExportLiabilityResult {
  score: number;
  hasBonus: boolean;
  weightedCompliance: number;
  riskPenalty: number;
  completionRate: number;
}

const RISK_WEIGHTS = {
  critical: 10,
  high: 7,
  medium: 5,
  low: 3,
};

const COMPLETION_SCORES = {
  compliant: 1.0,
  partial: 0.5,
  'non-compliant': 0.0,
  'not-assessed': 0.0,
};

export function calculateExportLiabilityIndex(questions: ExportQuestion[]): ExportLiabilityResult {
  let sumWeightedCompliance = 0;
  let sumWeights = 0;
  let sumRiskPenalty = 0;
  let sumRiskWeights = 0;
  let compliantCount = 0;
  let criticalRisks = 0;
  let totalAnswered = 0;

  for (const question of questions) {
    const weight = RISK_WEIGHTS[question.riskLevel];
    const response = question.response || 'not-assessed';
    const completionScore = COMPLETION_SCORES[response];

    if (response !== 'not-assessed') {
      totalAnswered++;
      sumWeightedCompliance += weight * completionScore;
      sumWeights += weight;

      if (response === 'compliant') {
        compliantCount++;
      }

      if (response === 'non-compliant') {
        const riskVector = weight / 10;
        const penaltyCoefficient = question.maxPenalty / 1000000;
        sumRiskPenalty += riskVector * penaltyCoefficient;
        sumRiskWeights += riskVector;

        if (question.riskLevel === 'critical') {
          criticalRisks++;
        }
      }
    }
  }

  const completionRate = totalAnswered / questions.length;
  const weightedCompliance = sumWeights > 0 ? sumWeightedCompliance / sumWeights : 0;
  const riskPenalty = sumRiskWeights > 0 ? sumRiskPenalty / sumRiskWeights : 0;

  let score = ((sumWeightedCompliance - sumRiskPenalty) / (sumWeights + sumRiskWeights)) * 100;
  
  // Apply bonus for excellent compliance
  const hasBonus = completionRate >= 0.9 && criticalRisks === 0 && score >= 85;
  if (hasBonus) {
    score = Math.min(100, score + 15);
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    hasBonus,
    weightedCompliance,
    riskPenalty,
    completionRate,
  };
}
