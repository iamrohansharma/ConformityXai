import { IStorage } from './interface';
import { Assessment, ActionItem, ComplianceFramework } from '@db/schema';

export class MemStorage implements IStorage {
  private assessments: Map<number, Assessment> = new Map();
  private actionItems: Map<number, ActionItem> = new Map();
  private frameworks: Map<string, ComplianceFramework> = new Map();
  private nextAssessmentId = 1;
  private nextActionItemId = 1;
  private nextFrameworkId = 1;

  async getAssessments(): Promise<Assessment[]> {
    return Array.from(this.assessments.values());
  }

  async getAssessment(id: number): Promise<Assessment | undefined> {
    return this.assessments.get(id);
  }

  async getAssessmentsByFramework(frameworkType: string): Promise<Assessment[]> {
    return Array.from(this.assessments.values())
      .filter(a => a.frameworkType === frameworkType);
  }

  async createAssessment(data: Omit<Assessment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Assessment> {
    const assessment: Assessment = {
      ...data,
      id: this.nextAssessmentId++,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.assessments.set(assessment.id, assessment);
    return assessment;
  }

  async updateAssessment(id: number, data: Partial<Assessment>): Promise<Assessment | undefined> {
    const existing = this.assessments.get(id);
    if (!existing) return undefined;
    
    const updated = {
      ...existing,
      ...data,
      updatedAt: new Date(),
    };
    this.assessments.set(id, updated);
    return updated;
  }

  async getActionItems(): Promise<ActionItem[]> {
    return Array.from(this.actionItems.values());
  }

  async getActionItemsByAssessment(assessmentId: number): Promise<ActionItem[]> {
    return Array.from(this.actionItems.values())
      .filter(item => item.assessmentId === assessmentId);
  }

  async getActionItemsByFramework(frameworkType: string): Promise<ActionItem[]> {
    return Array.from(this.actionItems.values())
      .filter(item => item.frameworkType === frameworkType);
  }

  async createActionItem(data: Omit<ActionItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<ActionItem> {
    const item: ActionItem = {
      ...data,
      id: this.nextActionItemId++,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.actionItems.set(item.id, item);
    return item;
  }

  async updateActionItem(id: number, data: Partial<ActionItem>): Promise<ActionItem | undefined> {
    const existing = this.actionItems.get(id);
    if (!existing) return undefined;
    
    const updated = {
      ...existing,
      ...data,
      updatedAt: new Date(),
    };
    this.actionItems.set(id, updated);
    return updated;
  }

  async getFrameworks(): Promise<ComplianceFramework[]> {
    return Array.from(this.frameworks.values());
  }

  async getFramework(name: string): Promise<ComplianceFramework | undefined> {
    return this.frameworks.get(name);
  }

  async createFramework(data: Omit<ComplianceFramework, 'id' | 'createdAt'>): Promise<ComplianceFramework> {
    const framework: ComplianceFramework = {
      ...data,
      id: this.nextFrameworkId++,
      createdAt: new Date(),
    };
    this.frameworks.set(data.name, framework);
    return framework;
  }
}
