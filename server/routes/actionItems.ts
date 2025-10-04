import { Router } from 'express';
import { z } from 'zod';
import { IStorage } from '../storage/interface';

const actionItemSchema = z.object({
  assessmentId: z.number().nullable(),
  title: z.string(),
  description: z.string(),
  priority: z.enum(['critical', 'high', 'medium', 'low']),
  status: z.enum(['open', 'in_progress', 'completed']).optional(),
  dueDate: z.string().datetime().optional(),
  frameworkType: z.string(),
});

export function createActionItemRoutes(storage: IStorage) {
  const router = Router();

  // Get all action items
  router.get('/', async (req, res) => {
    try {
      const items = await storage.getActionItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch action items' });
    }
  });

  // Get action items by assessment ID
  router.get('/assessment/:assessmentId', async (req, res) => {
    try {
      const assessmentId = parseInt(req.params.assessmentId);
      const items = await storage.getActionItemsByAssessment(assessmentId);
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch action items' });
    }
  });

  // Get action items by framework type
  router.get('/framework/:frameworkType', async (req, res) => {
    try {
      const { frameworkType } = req.params;
      const items = await storage.getActionItemsByFramework(frameworkType);
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch action items' });
    }
  });

  // Create action item
  router.post('/', async (req, res) => {
    try {
      const data = actionItemSchema.parse(req.body);
      const item = await storage.createActionItem({
        ...data,
        status: data.status || 'open',
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
      });
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid request data', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to create action item' });
    }
  });

  // Update action item
  router.put('/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = actionItemSchema.partial().parse(req.body);
      const item = await storage.updateActionItem(id, {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      });
      if (!item) {
        return res.status(404).json({ error: 'Action item not found' });
      }
      res.json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid request data', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to update action item' });
    }
  });

  return router;
}
