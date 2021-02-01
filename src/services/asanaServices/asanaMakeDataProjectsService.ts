import asana from 'asana';
import Logger from '../../logger';
import DateHelper from '../helperServices/dateHelper';
import AsanaRequestService from './asanaRequestService';
import { Container, Service } from 'typedi';
import { IApiEntity, IGetTaskListParams, IProject, IResponseFullTask } from '../../interfaces/asanaApi';

@Service()
export default class AsanaMakeDataProjectsService {
  private dateService: DateHelper;

  private asanaRequestService: AsanaRequestService;

  constructor(client: asana.Client) {
    this.asanaRequestService = new AsanaRequestService(client);
    this.dateService = Container.get(DateHelper);
  }

  public async getProjectsTasks(isAllTasks = true): Promise<IProject[]> {
    const projects = await this.asanaRequestService.getProjectList();

    return this.dataProjects(projects, isAllTasks);
  }

  private async dataProjects(projects: IApiEntity[], isAllTasks: boolean): Promise<IProject[]> {
    const params = this.createTaskListParams(isAllTasks);

    return await this.fillTheDataProject(projects, params);
  }

  private async fillTheDataProject(projects: IApiEntity[], params: IGetTaskListParams): Promise<IProject[]> {
    const projectData: IProject[] = [];
    for (const project of projects) {
      params.project = project.gid;
      const tasks = await this.asanaRequestService.getTasks(params);
      projectData.push({ projectName: project.name, tasks } as IProject);
    }

    return await this.replacementTasksInProjects(projectData);
  }

  private async replacementTasksInProjects(dataProjects: IProject[]): Promise<IProject[]> {
    const dataProjectsTemp: IProject[] = [...dataProjects];
    for (const dataProject of dataProjectsTemp) {
      dataProject.tasks.data = await this.getFullTasksForProject(dataProject);
    }

    return dataProjectsTemp;
  }

  private async getFullTasksForProject(dataProject: IProject): Promise<IResponseFullTask[]> {
    try {
      const fullTasks: IResponseFullTask[] = [];
      for (const task of dataProject.tasks.data) {
        const fullTask = await this.asanaRequestService.getTaskById(task.gid);
        fullTasks.push(fullTask as IResponseFullTask);
      }

      return fullTasks;
    } catch (error) {
      Logger.error(error);
    }
  }

  private createTaskListParams(isAllTasks: boolean): IGetTaskListParams {
    const params = {} as IGetTaskListParams;

    if (!isAllTasks) {
      params.modified_since = this.dateService.getDateOfLastRequest();
    }

    return params;
  }
}
