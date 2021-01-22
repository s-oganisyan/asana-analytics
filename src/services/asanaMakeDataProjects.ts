import asana from 'asana';
import DateService from './dateService';
import AsanaRequestService from './asanaRequestService';
import { Container, Service } from 'typedi';
import { IApiEntity, IGetTaskListParams, IProject, IResponseFullTask } from '../interfaces/asanaApi';

@Service()
export default class AsanaMakeDataProjects {
  private dateService: DateService;

  private asanaRequestService: AsanaRequestService;

  constructor(client: asana.Client) {
    this.asanaRequestService = new AsanaRequestService(client);
    this.dateService = Container.get(DateService);
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
    for (const dataProject of dataProjects) {
      dataProject.tasks.data = await this.getFullTasksForProject(dataProject);
    }

    return dataProjects;
  }

  private async getFullTasksForProject(dataProject: IProject): Promise<IResponseFullTask[]> {
    const fullTasks: IResponseFullTask[] = [];

    for (let task of dataProject.tasks.data) {
      task = await this.asanaRequestService.getTaskById(task.gid);
      fullTasks.push(task as IResponseFullTask);
    }

    return fullTasks;
  }

  private createTaskListParams(isAllTasks: boolean): IGetTaskListParams {
    const params = {} as IGetTaskListParams;

    if (!isAllTasks) {
      params.modified_since = this.dateService.getDateOfLastRequest();
    }

    return params;
  }
}
