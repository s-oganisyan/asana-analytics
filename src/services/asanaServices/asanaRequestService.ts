import asana from 'asana';
import config from '../../config';
import Logger from '../../logger';
import DateService from '../helperServices/dateService';
import { Container, Service } from 'typedi';
import { IResponseFullTask, IApiEntity, IGetTaskListParams, ITasks } from '../../interfaces/asanaApi';

@Service()
export default class AsanaRequestService {
  private client: asana.Client;

  private dateService: DateService;

  constructor(client: asana.Client) {
    this.client = client;
    this.dateService = Container.get(DateService);
  }

  public async getTasks(params: IGetTaskListParams): Promise<ITasks> {
    try {
      const tasks = await this.client.tasks.getTasks({ ...params, opt_pretty: true });
      return tasks;
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  }

  public async getProjectList(): Promise<IApiEntity[]> {
    try {
      const projects = await this.client.projects.getProjects({ workspace: config.ASANA.WORKSPACE, opt_pretty: true });
      return projects.data;
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
}
