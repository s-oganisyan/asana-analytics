import AsanaApiService from '../../services/asanaApiService';
import { Container } from 'typedi';
import { Router, Request, Response } from 'express';

const route = Router();

export default (app: Router): void => {
  app.use('/asana', route);

  route.get('/tasks', async (req: Request, res: Response) => {
    try {
      const params = { ...req.query };
      const asanaApiServiceInstance = Container.get(AsanaApiService);
      const tasks = await asanaApiServiceInstance.getTasks(params);

      return res.status(201).json(tasks);
    } catch (e) {
      return res.status(500).json(e);
    }
  });

  route.get('/tasks/:id', async (req: Request, res: Response) => {
    try {
      const taskId = req.params.id;
      const asanaApiServiceInstance = Container.get(AsanaApiService);
      const task = await asanaApiServiceInstance.getTaskById(taskId);

      return res.status(201).json(task);
    } catch (e) {
      return res.status(500).json(e);
    }
  });

  route.get('/users', async (req: Request, res: Response) => {
    try {
      const workspace: string = req.query.workspace as string;
      const asanaApiServiceInstance = Container.get(AsanaApiService);
      const users = await asanaApiServiceInstance.getUserList(workspace);
      return res.status(201).json(users);
    } catch (e) {
      return res.status(500).json(e);
    }
  });

  route.get('/projects', async (req: Request, res: Response) => {
    try {
      const workspace: string = req.query.workspace as string;
      const asanaApiServiceInstance = Container.get(AsanaApiService);
      const projects = await asanaApiServiceInstance.getProjectList(workspace);
      return res.status(201).json(projects);
    } catch (e) {
      return res.status(500).json(e);
    }
  });
};
