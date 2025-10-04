import { Router } from 'express';
import { z } from 'zod';
import { IStorage } from '../storage/interface';

const assessmentSchema = z.object({
  organizationName: z.string(),
  frameworkType: z.string(),
  assessmentData: z.any(),
  status: z.enum(['in_progress', 'completed']).optional(),
  overallScore: z.number().optional(),
});

export function createAssessmentRoutes(storage: IStorage) {
  const router = Router();

  // Get all assessments
  router.get('/', async (req, res) => {
    try {
      const assessments = await storage.getAssessments();
      res.json(assessments);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch assessments' });
    }
  });

  // Get assessment by ID
  router.get('/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const assessment = await storage.getAssessment(id);
      if (!assessment) {
        return res.status(404).json({ error: 'Assessment not found' });
      }
      res.json(assessment);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch assessment' });
    }
  });

  // Get assessments by framework type
  router.get('/framework/:frameworkType', async (req, res) => {
    try {
      const { frameworkType } = req.params;
      const assessments = await storage.getAssessmentsByFramework(frameworkType);
      res.json(assessments);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch assessments' });
    }
  });

  // Create assessment
  router.post('/', async (req, res) => {
    try {
      const data = assessmentSchema.parse(req.body);
      const assessment = await storage.createAssessment({
        organizationName: data.organizationName,
        frameworkType: data.frameworkType,
        assessmentData: data.assessmentData,
        userId: null,
        overallScore: data.overallScore || 0,
        status: data.status || 'in_progress',
      });
      res.status(201).json(assessment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid request data', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to create assessment' });
    }
  });

  // Update assessment
  router.put('/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = assessmentSchema.partial().parse(req.body);
      const assessment = await storage.updateAssessment(id, data);
      if (!assessment) {
        return res.status(404).json({ error: 'Assessment not found' });
      }
      res.json(assessment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid request data', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to update assessment' });
    }
  });

  return router;
}
