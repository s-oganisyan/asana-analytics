import asana from 'asana';
import DateService from '../helperServices/dateService';
import AsanaRequestService from './asanaRequestService';
import { Container, Service } from 'typedi';
import { IApiEntity, IGetTaskListParams, IProject, IResponseFullTask, ITaskNameObj } from '../../interfaces/asanaApi';

@Service()
export default class AsanaMakeDataProjectsService {
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

  public async getProjectsTasksTest(): Promise<IProject[]> {
    const projects = await this.asanaRequestService.getProjectList();

    const params = {} as IGetTaskListParams;
    const projectData: IProject[] = [];
    for (const project of projects) {
      params.project = project.gid;
      const tasks = await this.asanaRequestService.getTasks(params);
      projectData.push({ projectName: project.name, tasks } as IProject);
    }
    const b = await this.replacementTasksInProjects(projectData, true);
    return b;
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

  private async replacementTasksInProjects(dataProjects: IProject[], isTest = false): Promise<IProject[]> {
    const dataProjectsTemp: IProject[] = [...dataProjects];
    for (const dataProject of dataProjectsTemp) {
      if (!isTest) {
        dataProject.tasks.data = await this.getFullTasksForProject(dataProject);
      } else {
        dataProject.tasks.data = dataProject.tasks.data.map((t) => ({ ...t, ...this.parseTicketsName(t.name) }));
      }
    }

    return dataProjectsTemp;
  }

  private async getFullTasksForProject(dataProject: IProject): Promise<IResponseFullTask[]> {
    const fullTasks: IResponseFullTask[] = [];

    for (const task of dataProject.tasks.data) {
      let fullTask = await this.asanaRequestService.getTaskById(task.gid);
      fullTask = { ...fullTask, ...this.parseTicketsName(fullTask.name) };
      fullTasks.push(fullTask as IResponseFullTask);
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

  private parseTicketsName(name: string): ITaskNameObj {
    /* clients_name, company_name(если есть такая инфа) / job_post_title 
  // (developers_name  platform_name agency(если присутствует слово agency, значит джоб на агентство))
  */
    const customer = name.slice(0, name.indexOf('/'));
    const [client, company] = customer.split(',');
    const job_title = name.slice(name.indexOf('/') + 1, name.indexOf('//')).trim();
    const devInfo = name.slice(name.indexOf('(') + 1, name.lastIndexOf(')'));
    const [developer, platform] = devInfo.split(' ', 2);
    const agency: boolean = devInfo.toLowerCase().indexOf('agency') !== -1;
    return {
      client: client.trim(),
      company: company.trim(),
      job_title,
      developer: developer.trim(),
      platform: platform && platform.toLowerCase() === 'agency' ? undefined : platform.trim(),
      agency,
    };
  }
}
