import asana from 'asana';
import config from '../config';
import Logger from '../logger';
import { Service } from 'typedi';
import { IResponseTask, IResponseFullTask, IApiEntity, IGetTaskListPamams } from '../interfaces/asanaApi';

@Service()
export default class EntitiesService {
  client: any;
  constructor() {
    this.client = asana.Client.create().useAccessToken(config.ASANA_PERSONAL_ACCESS_TOKEN);
  }

  public async getTasks(params: IGetTaskListPamams): Promise<IResponseTask[]> {
    try {
      console.log('typeof( this.client )', this.client);
      const tasks = await this.client.tasks.getTasks({ ...params, opt_pretty: true });
      return tasks;
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  }

  public async getTaskById(gid: string): Promise<IResponseFullTask> {
    try {
      const task = await this.client.tasks.getTask(gid, { opt_pretty: true });
      return task;
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  }

  public async getUserList(workspace: string): Promise<IApiEntity> {
    try {
      const users = await this.client.users.getUsers({ workspace, opt_pretty: true });
      return users.data;
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  }

  public async getProjectList(workspace: string): Promise<IApiEntity> {
    try {
      const projects = await this.client.projects.getProjects({ workspace, opt_pretty: true });
      return projects.data;
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  }
}
