import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAssessments, useActionItems } from '@/lib/api';
import { formatScore, getRiskLevelColor } from '@/lib/utils';
import { Shield, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

export function Dashboard() {
  const { data: assessments = [] } = useAssessments();
  const { data: actionItems = [] } = useActionItems();

  const overallScore = assessments.length > 0
    ? Math.round(assessments.reduce((sum, a) => sum + a.overallScore, 0) / assessments.length)
    : 0;

  const completedAssessments = assessments.filter(a => a.status === 'completed').length;
  const inProgressAssessments = assessments.filter(a => a.status === 'in_progress').length;

  const criticalActions = actionItems.filter(a => a.priority === 'critical' && a.status !== 'completed').length;
  const openActions = actionItems.filter(a => a.status === 'open').length;

  const frameworks = [
    { name: 'NIST AI-RMF', progress: 0, status: 'Not Started' },
    { name: 'EU AI Act', progress: 0, status: 'Not Started' },
    { name: 'GDPR', progress: 0, status: 'Not Started' },
    { name: 'Export Control', progress: 0, status: 'Not Started' },
    { name: 'SOC 2', progress: 0, status: 'Not Started' },
    { name: 'ISO/IEC 42001', progress: 0, status: 'Not Started' },
    { name: 'Singapore Model AI Governance', progress: 0, status: 'Not Started' },
  ];

  assessments.forEach(assessment => {
    const framework = frameworks.find(f => f.name === assessment.frameworkType);
    if (framework) {
      framework.progress = assessment.overallScore;
      framework.status = assessment.status === 'completed' ? 'Completed' : 'In Progress';
    }
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-light tracking-tight text-gray-900">Dashboard</h1>
        <p className="text-lg text-gray-600 mt-2">
          Comprehensive AI compliance assessment across multiple regulatory frameworks
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Compliance</CardTitle>
            <Shield className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatScore(overallScore)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across {assessments.length} framework{assessments.length !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{completedAssessments}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {inProgressAssessments} in progress
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Actions</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{criticalActions}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Require immediate attention
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Tasks</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{openActions}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Action items pending
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Framework Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Framework Compliance Status</CardTitle>
          <CardDescription>
            Track progress across all regulatory frameworks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {frameworks.map((framework) => (
              <div key={framework.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{framework.name}</div>
                    <div className="text-sm text-muted-foreground">{framework.status}</div>
                  </div>
                  <Badge variant={framework.status === 'Completed' ? 'default' : 'secondary'}>
                    {formatScore(framework.progress)}
                  </Badge>
                </div>
                <Progress value={framework.progress} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Action Items */}
      {actionItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Action Items</CardTitle>
            <CardDescription>
              Latest compliance tasks and recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {actionItems.slice(0, 5).map((item) => (
                <div key={item.id} className="flex items-start gap-4 pb-4 border-b last:border-0">
                  <div className={`px-2 py-1 rounded text-xs font-medium ${getRiskLevelColor(item.priority)}`}>
                    {item.priority.toUpperCase()}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="font-medium">{item.title}</div>
                    <div className="text-sm text-muted-foreground">{item.description}</div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="outline">{item.frameworkType}</Badge>
                      <Badge variant="outline">{item.status}</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
