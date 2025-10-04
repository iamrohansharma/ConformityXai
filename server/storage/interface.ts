import { Assessment, ActionItem, ComplianceFramework } from '@db/schema';

export interface IStorage {
  // Assessments
  getAssessments(): Promise<Assessment[]>;
  getAssessment(id: number): Promise<Assessment | undefined>;
  getAssessmentsByFramework(frameworkType: string): Promise<Assessment[]>;
  createAssessment(data: Omit<Assessment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Assessment>;
  updateAssessment(id: number, data: Partial<Assessment>): Promise<Assessment | undefined>;
  
  // Action Items
  getActionItems(): Promise<ActionItem[]>;
  getActionItemsByAssessment(assessmentId: number): Promise<ActionItem[]>;
  getActionItemsByFramework(frameworkType: string): Promise<ActionItem[]>;
  createActionItem(data: Omit<ActionItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<ActionItem>;
  updateActionItem(id: number, data: Partial<ActionItem>): Promise<ActionItem | undefined>;
  
  // Frameworks
  getFrameworks(): Promise<ComplianceFramework[]>;
  getFramework(name: string): Promise<ComplianceFramework | undefined>;
  createFramework(data: Omit<ComplianceFramework, 'id' | 'createdAt'>): Promise<ComplianceFramework>;
}
