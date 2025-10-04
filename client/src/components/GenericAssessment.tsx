import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ComplianceRadarChart } from './ComplianceRadarChart';
import { useFramework, useCreateAssessment, useUpdateAssessment } from '@/lib/api';
import { getRiskLevelColor } from '@/lib/utils';

type ResponseType = 'compliant' | 'partial' | 'non-compliant' | 'not-assessed';

interface Question {
  id: string;
  category?: string;
  article?: string;
  question: string;
  riskLevel: string;
  maxPenalty?: number;
  reference: string;
}

interface GenericAssessmentProps {
  frameworkName: string;
}

export function GenericAssessment({ frameworkName }: GenericAssessmentProps) {
  const { data: framework } = useFramework(frameworkName);
  const createAssessment = useCreateAssessment();
  const updateAssessment = useUpdateAssessment();

  const [responses, setResponses] = useState<Record<string, ResponseType>>({});
  const [assessmentId, setAssessmentId] = useState<number | null>(null);

  const questions: Question[] = framework?.requirements?.questions || [];

  // Calculate overall score
  const calculateScore = () => {
    const COMPLETION_SCORES = { 
      compliant: 100, 
      partial: 50, 
      'non-compliant': 0, 
      'not-assessed': 0 
    };

    const answeredQuestions = Object.entries(responses).filter(
      ([_, response]) => response !== 'not-assessed'
    );

    if (answeredQuestions.length === 0) return 0;

    const totalScore = answeredQuestions.reduce(
      (sum, [_, response]) => sum + COMPLETION_SCORES[response],
      0
    );

    return totalScore / answeredQuestions.length;
  };

  const overallScore = calculateScore();

  // Calculate radar chart data by category
  const getRadarData = () => {
    const categoryKey = questions[0]?.category ? 'category' : 'article';
    const categories = [...new Set(questions.map(q => q[categoryKey as keyof Question] as string))];

    return categories.map(cat => {
      const catQuestions = questions.filter(q => q[categoryKey as keyof Question] === cat);
      const catResponses = catQuestions
        .map(q => responses[q.id])
        .filter(r => r && r !== 'not-assessed');

      const score = catResponses.length > 0
        ? (catResponses.filter(r => r === 'compliant').length / catResponses.length) * 100
        : 0;

      return {
        category: cat,
        score: Math.round(score),
        fullMark: 100,
      };
    });
  };

  const radarData = getRadarData();

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
        frameworkType: frameworkName,
        assessmentData: { responses },
        overallScore: Math.round(overallScore),
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-light tracking-tight text-gray-900">{frameworkName}</h1>
        <p className="text-lg text-gray-600 mt-2">
          {framework?.description || 'Compliance assessment framework'}
        </p>
      </div>

      {/* Score Card */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle>Overall Compliance Score</CardTitle>
          <CardDescription>
            Current assessment progress and score
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-4xl font-bold">{overallScore.toFixed(1)}%</div>
              <p className="text-sm text-muted-foreground mt-1">
                {Object.values(responses).filter(r => r !== 'not-assessed').length} of {questions.length} questions answered
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-semibold text-muted-foreground">
                {completionPercentage.toFixed(0)}%
              </div>
              <p className="text-xs text-muted-foreground">Complete</p>
            </div>
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </CardContent>
      </Card>

      {/* Questions */}
      <div className="space-y-4">
        {questions.map((question, index) => (
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
                    {question.category && (
                      <Badge variant="outline">{question.category}</Badge>
                    )}
                    {question.article && (
                      <Badge variant="outline">{question.article}</Badge>
                    )}
                    <Badge className={getRiskLevelColor(question.riskLevel)}>
                      {question.riskLevel.toUpperCase()}
                    </Badge>
                    {question.maxPenalty && (
                      <span className="text-xs">
                        Max Penalty: €{(question.maxPenalty / 1000000).toFixed(0)}M
                      </span>
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
      {radarData.length > 0 && radarData.some(d => d.score > 0) && (
        <Card>
          <CardHeader>
            <CardTitle>Compliance Radar Analysis</CardTitle>
            <CardDescription>
              Category-level compliance breakdown
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
