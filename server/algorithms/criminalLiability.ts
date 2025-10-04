/**
 * Criminal Liability Probability Calculator
 * 
 * Analyzes critical questions with criminal prosecution potential
 * Tracks: EAR ECCN 4E091, FDPR violations, SDN screening failures
 * Percentage-based probability calculation
 */

export interface CriminalQuestion {
  id: string;
  category: string;
  hasCriminalRisk: boolean;
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
  response?: 'compliant' | 'partial' | 'non-compliant' | 'not-assessed';
}

export interface CriminalLiabilityResult {
  probability: number;
  criticalViolations: number;
  highRiskViolations: number;
  riskFactors: string[];
}

export function calculateCriminalLiability(questions: CriminalQuestion[]): CriminalLiabilityResult {
  let criticalViolations = 0;
  let highRiskViolations = 0;
  const riskFactors: string[] = [];

  const criminalRiskQuestions = questions.filter(q => q.hasCriminalRisk);
  
  for (const question of criminalRiskQuestions) {
    const response = question.response || 'not-assessed';
    
    if (response === 'non-compliant') {
      if (question.riskLevel === 'critical') {
        criticalViolations++;
        riskFactors.push(`Critical violation: ${question.category}`);
      } else if (question.riskLevel === 'high') {
        highRiskViolations++;
        riskFactors.push(`High-risk violation: ${question.category}`);
      }
    }
  }

  // Calculate probability
  // Critical violations: 40% base probability each
  // High-risk violations: 15% base probability each
  // Cap at 95% maximum
  const probability = Math.min(95, 
    (criticalViolations * 40) + (highRiskViolations * 15)
  );

  return {
    probability,
    criticalViolations,
    highRiskViolations,
    riskFactors,
  };
}
