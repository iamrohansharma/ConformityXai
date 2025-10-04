import { Router } from 'express';
import { IStorage } from '../storage/interface';
import { frameworksData } from '../data/frameworks';

export function createFrameworkRoutes(storage: IStorage) {
  const router = Router();

  // Initialize frameworks on startup
  (async () => {
    for (const fw of frameworksData) {
      const existing = await storage.getFramework(fw.name);
      if (!existing) {
        await storage.createFramework(fw);
      }
    }
  })();

  // Get all frameworks
  router.get('/', async (req, res) => {
    try {
      const frameworks = await storage.getFrameworks();
      res.json(frameworks);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch frameworks' });
    }
  });

  // Get framework by name
  router.get('/:name', async (req, res) => {
    try {
      const { name } = req.params;
      const framework = await storage.getFramework(name);
      if (!framework) {
        return res.status(404).json({ error: 'Framework not found' });
      }
      res.json(framework);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch framework' });
    }
  });

  return router;
}
