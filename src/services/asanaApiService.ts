import asana from 'asana';
import config from '../config';
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
      const tasks = this.client.tasks.getTasks({ ...params, opt_pretty: true }).then((result) => {
        console.log(result);
        return result.data;
      });
      return tasks;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async getTaskById(gid: string): Promise<IResponseFullTask> {
    try {
      const task = this.client.tasks.getTask(gid, { opt_pretty: true }).then((result) => {
        console.log(result);
        return result;
      });
      return task;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async getUserList(workspace: string): Promise<IApiEntity> {
    try {
      const users = this.client.users.getUsers({ workspace, opt_pretty: true }).then((result) => {
        return result.data;
      });
      return users;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async getProjectList(workspace: string): Promise<IApiEntity> {
    try {
      const projects = this.client.projects
        .getProjects({ workspace, opt_pretty: true })
        .then((result: { data: IApiEntity[] }) => {
          return result.data;
        });
      return projects;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
