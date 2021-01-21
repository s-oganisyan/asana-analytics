import AsanaMakeDataProjects from '../../services/asanaMakeDataProjects';
import { Container } from 'typedi';
import { Router, Request, Response } from 'express';

const route = Router();

export default (app: Router): void => {
  app.use('/asana', route);

  route.get('/tasks', async (req: Request, res: Response) => {
    try {
      const asanaMakeDataProjects = Container.get(AsanaMakeDataProjects);
      const tasksOfProjects = await asanaMakeDataProjects.getProjectsTasks();

      return res.status(201).json(tasksOfProjects);
    } catch (e) {
      return res.status(500).json(e);
    }
  });
};
