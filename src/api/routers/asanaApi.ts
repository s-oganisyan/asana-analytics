import AsanaApiService from '../../services/asanaApiService';
import { Container } from 'typedi';
import { Router, Request, Response } from 'express';

const route = Router();

export default (app: Router): void => {
  app.use('/asana', route);

  route.get('/tasks', async (req: Request, res: Response) => {
    try {
      const asanaApiServiceInstance = Container.get(AsanaApiService);
      const ProjectsAndTasks = await asanaApiServiceInstance.getProjectsTasks();

      return res.status(201).json(ProjectsAndTasks);
    } catch (e) {
      return res.status(500).json(e);
    }
  });
};
