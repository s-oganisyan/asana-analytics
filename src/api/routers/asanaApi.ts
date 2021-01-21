import asana from 'asana';
import config from '../../config';
import AsanaMakeDataProjects from '../../services/asanaMakeDataProjects';
import { Router, Request, Response } from 'express';

const route = Router();

export default (app: Router): void => {
  app.use('/asana', route);

  route.get('/tasks', async (req: Request, res: Response) => {
    try {
      const client = asana.Client.create().useAccessToken(config.ASANA.PERSONAL_ACCESS_TOKEN);
      const asanaMakeDataProjects = new AsanaMakeDataProjects(client);
      const tasksOfProjects = await asanaMakeDataProjects.getProjectsTasks();

      return res.status(201).json(tasksOfProjects);
    } catch (e) {
      return res.status(500).json(e);
    }
  });
};
