import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { ComplianceRadarChart } from './ComplianceRadarChart';
import { useFramework, useCreateAssessment, useUpdateAssessment } from '@/lib/api';
import { getRiskLevelColor } from '@/lib/utils';
import { Download, AlertCircle } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

type ResponseType = 'compliant' | 'partial' | 'non-compliant' | 'not-assessed';

interface Question {
  id: string;
  category: string;
  question: string;
  riskLevel: string;
  maxPenalty: number;
  hasCriminalRisk: boolean;
  regulatoryBody: string;
  reference: string;
}

export function ExportControlAssessment() {
  const { data: framework } = useFramework('Export Control');
  const createAssessment = useCreateAssessment();
  const updateAssessment = useUpdateAssessment();

  const [responses, setResponses] = useState<Record<string, ResponseType>>({});
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [assessmentId, setAssessmentId] = useState<number | null>(null);

  const questions: Question[] = framework?.requirements?.questions || [];
  const categories = ['All', ...new Set(questions.map(q => q.category))];

  const filteredQuestions = categoryFilter === 'All'
    ? questions
    : questions.filter(q => q.category === categoryFilter);

  // Calculate scores using proprietary algorithms
  const calculateExportLiabilityIndex = () => {
    const RISK_WEIGHTS = { critical: 10, high: 7, medium: 5, low: 3 };
    const COMPLETION_SCORES = { compliant: 1.0, partial: 0.5, 'non-compliant': 0.0, 'not-assessed': 0.0 };

    let sumWeightedCompliance = 0;
    let sumWeights = 0;
    let sumRiskPenalty = 0;
    let sumRiskWeights = 0;
    let totalAnswered = 0;
    let criticalRisks = 0;

    questions.forEach(q => {
      const weight = RISK_WEIGHTS[q.riskLevel as keyof typeof RISK_WEIGHTS] || 3;
      const response = responses[q.id] || 'not-assessed';
      const completionScore = COMPLETION_SCORES[response];

      if (response !== 'not-assessed') {
        totalAnswered++;
        sumWeightedCompliance += weight * completionScore;
        sumWeights += weight;

        if (response === 'non-compliant') {
          const riskVector = weight / 10;
          const penaltyCoefficient = q.maxPenalty / 1000000;
          sumRiskPenalty += riskVector * penaltyCoefficient;
          sumRiskWeights += riskVector;

          if (q.riskLevel === 'critical') {
            criticalRisks++;
          }
        }
      }
    });

    const completionRate = questions.length > 0 ? totalAnswered / questions.length : 0;
    let score = ((sumWeightedCompliance - sumRiskPenalty) / (sumWeights + sumRiskWeights)) * 100;

    // Bonus for excellent compliance
    const hasBonus = completionRate >= 0.9 && criticalRisks === 0 && score >= 85;
    if (hasBonus) {
      score = Math.min(100, score + 15);
    }

    return Math.max(0, Math.min(100, score || 0));
  };

  const calculatePenaltyExposure = () => {
    const REGULATORY_WEIGHTS = { critical: 1.0, high: 0.8, medium: 0.6, low: 0.4 };
    const MAX_PENALTIES: Record<string, number> = {
      BIS: 1000000,
      EU: 35000000,
      OFAC: 968000000,
      GEOPOLITICAL: 5000000,
    };

    let totalExposure = 0;
    const byCategory: Record<string, number> = {};

    questions.forEach(q => {
      const response = responses[q.id] || 'not-assessed';

      if (response === 'non-compliant' || response === 'partial') {
        const weight = REGULATORY_WEIGHTS[q.riskLevel as keyof typeof REGULATORY_WEIGHTS] || 0.4;
        const likelihood = response === 'non-compliant' ? 0.9 : 0.5;
        const severityFactor = q.riskLevel === 'critical' ? 1.0 :
                              q.riskLevel === 'high' ? 0.8 :
                              q.riskLevel === 'medium' ? 0.6 : 0.4;
        const maxPenalty = MAX_PENALTIES[q.regulatoryBody] || 0;

        const exposure = weight * likelihood * severityFactor * maxPenalty;
        totalExposure += exposure;

        if (!byCategory[q.category]) {
          byCategory[q.category] = 0;
        }
        byCategory[q.category] += exposure;
      }
    });

    return { totalExposure, byCategory };
  };

  const calculateCriminalLiability = () => {
    let criticalViolations = 0;
    let highRiskViolations = 0;

    questions.filter(q => q.hasCriminalRisk).forEach(q => {
      const response = responses[q.id] || 'not-assessed';

      if (response === 'non-compliant') {
        if (q.riskLevel === 'critical') {
          criticalViolations++;
        } else if (q.riskLevel === 'high') {
          highRiskViolations++;
        }
      }
    });

    const probability = Math.min(95, (criticalViolations * 40) + (highRiskViolations * 15));
    return probability;
  };

  const exportLiabilityIndex = calculateExportLiabilityIndex();
  const { totalExposure, byCategory } = calculatePenaltyExposure();
  const criminalLiability = calculateCriminalLiability();

  const formatPenalty = (amount: number): string => {
    if (amount >= 1000000000) {
      return `$${(amount / 1000000000).toFixed(2)}B`;
    } else if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(2)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    } else {
      return `$${amount.toFixed(0)}`;
    }
  };

  // Calculate radar chart data
  const radarData = Object.entries(byCategory).map(([category, exposure]) => ({
    category,
    score: Math.max(0, 100 - (exposure / 10000000) * 100),
    fullMark: 100,
  }));

  const completionPercentage = questions.length > 0
    ? (Object.values(responses).filter(r => r !== 'not-assessed').length / questions.length) * 100
    : 0;

  const handleResponseChange = (questionId: string, value: ResponseType) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
  };

  // Save assessment
  useEffect(() => {
    if (Object.keys(responses).length > 0) {
      const assessmentData = {
        organizationName: 'My Organization',
        frameworkType: 'Export Control',
        assessmentData: { responses },
        overallScore: Math.round(exportLiabilityIndex),
        status: completionPercentage === 100 ? 'completed' as const : 'in_progress' as const,
      };

      if (assessmentId) {
        updateAssessment.mutate({ id: assessmentId, data: assessmentData });
      } else {
        createAssessment.mutate(assessmentData, {
          onSuccess: (data) => setAssessmentId(data.id),
        });
      }
    }
  }, [responses]);

  const generatePDF = async () => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    let yPos = 20;

    // Title
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('AI Export Passport', pageWidth / 2, yPos, { align: 'center' });
    yPos += 10;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text('ConformityXAI - Export Control Assessment Report', pageWidth / 2, yPos, { align: 'center' });
    yPos += 15;

    // Scores
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Compliance Scores', 20, yPos);
    yPos += 8;

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Export Liability Index™: ${exportLiabilityIndex.toFixed(1)}%`, 20, yPos);
    yPos += 6;
    pdf.text(`Civil Penalty Exposure™: ${formatPenalty(totalExposure)}`, 20, yPos);
    yPos += 6;
    pdf.text(`Criminal Liability Probability: ${criminalLiability.toFixed(0)}%`, 20, yPos);
    yPos += 6;
    pdf.text(`Completion Rate: ${completionPercentage.toFixed(0)}%`, 20, yPos);
    yPos += 12;

    // Category Breakdown
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Category Exposure', 20, yPos);
    yPos += 8;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    Object.entries(byCategory).forEach(([category, exposure]) => {
      pdf.text(`${category}: ${formatPenalty(exposure)}`, 20, yPos);
      yPos += 6;
      if (yPos > 270) {
        pdf.addPage();
        yPos = 20;
      }
    });

    yPos += 6;

    // Questions & Responses
    pdf.addPage();
    yPos = 20;
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Assessment Details', 20, yPos);
    yPos += 10;

    pdf.setFontSize(9);
    questions.forEach(q => {
      if (yPos > 260) {
        pdf.addPage();
        yPos = 20;
      }

      pdf.setFont('helvetica', 'bold');
      pdf.text(`${q.category} - ${q.riskLevel.toUpperCase()}`, 20, yPos);
      yPos += 5;

      pdf.setFont('helvetica', 'normal');
      const questionLines = pdf.splitTextToSize(q.question, 170);
      pdf.text(questionLines, 20, yPos);
      yPos += questionLines.length * 5;

      const response = responses[q.id] || 'not-assessed';
      pdf.setFont('helvetica', 'italic');
      pdf.text(`Response: ${response}`, 20, yPos);
      yPos += 5;

      pdf.text(`Reference: ${q.reference}`, 20, yPos);
      yPos += 5;

      pdf.text(`Max Penalty: ${formatPenalty(q.maxPenalty)}`, 20, yPos);
      yPos += 8;
    });

    pdf.save('ai-export-passport.pdf');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-light tracking-tight text-gray-900">Export Control Assessment</h1>
        <p className="text-lg text-gray-600 mt-2">
          {framework?.description || 'Multi-jurisdictional export control compliance'}
        </p>
      </div>

      {/* Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Export Liability Index™</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{exportLiabilityIndex.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Proprietary scoring algorithm</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Penalty Exposure™</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatPenalty(totalExposure)}</div>
            <p className="text-xs text-muted-foreground">Estimated civil liability</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Criminal Liability</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{criminalLiability.toFixed(0)}%</div>
            <p className="text-xs text-muted-foreground">Prosecution probability</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{completionPercentage.toFixed(0)}%</div>
            <p className="text-xs text-muted-foreground">
              {Object.values(responses).filter(r => r !== 'not-assessed').length} of {questions.length} answered
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardHeader>
          <CardTitle>Assessment Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={completionPercentage} className="h-2" />
        </CardContent>
      </Card>

      {/* Category Filter & Export */}
      <div className="flex items-center justify-between">
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button onClick={generatePDF} className="gap-2">
          <Download className="h-4 w-4" />
          Export Passport PDF
        </Button>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {filteredQuestions.map((question, index) => (
          <Card key={question.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base">
                      Question {index + 1}: {question.question}
                    </CardTitle>
                  </div>
                  <CardDescription className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline">{question.category}</Badge>
                    <Badge className={getRiskLevelColor(question.riskLevel)}>
                      {question.riskLevel.toUpperCase()}
                    </Badge>
                    <span className="text-xs">Max Penalty: {formatPenalty(question.maxPenalty)}</span>
                    {question.hasCriminalRisk && (
                      <Badge variant="destructive" className="gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Criminal Risk
                      </Badge>
                    )}
                  </CardDescription>
                  <p className="text-xs text-muted-foreground mt-2">
                    {question.reference}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button
                  variant={responses[question.id] === 'compliant' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleResponseChange(question.id, 'compliant')}
                >
                  Compliant
                </Button>
                <Button
                  variant={responses[question.id] === 'partial' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleResponseChange(question.id, 'partial')}
                >
                  Partial
                </Button>
                <Button
                  variant={responses[question.id] === 'non-compliant' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleResponseChange(question.id, 'non-compliant')}
                >
                  Non-Compliant
                </Button>
                <Button
                  variant={responses[question.id] === 'not-assessed' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleResponseChange(question.id, 'not-assessed')}
                >
                  Not Assessed
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Radar Chart */}
      {radarData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Compliance Radar Analysis</CardTitle>
            <CardDescription>
              Multi-dimensional risk assessment across regulatory categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ComplianceRadarChart data={radarData} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
