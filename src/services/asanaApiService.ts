import asana from 'asana';
import config from '../config';
import Logger from '../logger';
import dateService from './dateService';
import { Container, Service } from 'typedi';
import { IResponseTask, IResponseFullTask, IApiEntity, IGetTaskListParams, IProject } from '../interfaces/asanaApi';

@Service()
export default class EntitiesService {
  client: any;

  dateService: dateService;

  constructor() {
    this.client = asana.Client.create().useAccessToken(config.ASANA.PERSONAL_ACCESS_TOKEN);
    this.dateService = Container.get(dateService);
  }

  public async getProjectsTasks(isAllTasks = true): Promise<IProject[]> {
    const projects = await this.getProjectList();

    return this.dataProjects(projects, isAllTasks);
  }

  private async getTasks(params: IGetTaskListParams): Promise<IResponseTask[]> {
    try {
      const tasks = await this.client.tasks.getTasks({ ...params, opt_pretty: true });
      return tasks;
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  }

  private async getProjectList(): Promise<IApiEntity[]> {
    try {
      const projects = await this.client.projects.getProjects({ workspace: config.ASANA.WORKSPACE, opt_pretty: true });
      return projects.data;
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  }

  private async getTaskById(gid: string): Promise<IResponseFullTask> {
    try {
      const task = await this.client.tasks.getTask(gid, { opt_pretty: true });
      return task;
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  }

  private async dataProjects(projects, isAllTasks: boolean): Promise<IProject[]> {
    const projectData: IProject[] = [];

    for (const project of projects) {
      const params = { project: project.gid } as IGetTaskListParams;

      if (!isAllTasks) {
        params.modified_since = this.dateService.getDateOfLastRequest();
      }

      const tasks = await this.getTasks(params);
      projectData.push({ projectName: project.name, tasks } as IProject);
    }

    return projectData;
  }
}
