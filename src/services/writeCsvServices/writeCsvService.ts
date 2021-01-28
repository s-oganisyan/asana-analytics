import DateService from '../helperServices/dateService';
import WriteCsvTagsService from './writeCsvTagsService';
import WriteCsvUsersService from './writeCsvUsersService';
import WriteCsvTasksService from './writeCsvTasksService';
import WriteCsvProjectsService from './writeCsvProjectsService';
import WriteCsvWorkspacesService from './writeCsvWorkspacesService';
import CreateCsvService from '../createCsvServices/createCsvService';
import WriteCsvMembershipsService from './writeCsvMembershipsService';
import { IProject, IResponseFullTask } from '../../interfaces/asanaApi';

export default class WriteCsvService {
  private createCsvService: CreateCsvService;

  private writeCsvUsersService: WriteCsvUsersService;

  private writeCsvTasksService: WriteCsvTasksService;

  private writeCsvWorkspacesService: WriteCsvWorkspacesService;

  private writeCsvProjectsService: WriteCsvProjectsService;

  private writeCsvTagsService: WriteCsvTagsService;

  private writeCsvMembershipsService: WriteCsvMembershipsService;

  constructor(dirName = 'csv') {
    this.createCsvService = new CreateCsvService(dirName);
    this.writeCsvUsersService = new WriteCsvUsersService(dirName);
    this.writeCsvTasksService = new WriteCsvTasksService(dirName);
    this.writeCsvWorkspacesService = new WriteCsvWorkspacesService(dirName);
    this.writeCsvProjectsService = new WriteCsvProjectsService(dirName);
    this.writeCsvTagsService = new WriteCsvTagsService(dirName);
    this.writeCsvMembershipsService = new WriteCsvMembershipsService(dirName);
  }

  public writeCsv(projectTasks: IProject[]): void {
    this.writeCsvTasksService.writeTaskFields(projectTasks[0].tasks.data[0]);

    projectTasks.forEach((project) => {
      this.writeCsvProjectsService.setProjectName(project.projectName);

      project.tasks.data.forEach((task) => {
        this.fixPropertyDateTask(task);

        this.writeCsvTasksService.write(task);
        this.writeCsvUsersService.write(task);
        this.writeCsvWorkspacesService.write(task);
        this.writeCsvProjectsService.write(task);
        this.writeCsvTagsService.write(task);
        this.writeCsvMembershipsService.write(task);
      });
    });
  }

  private fixPropertyDateTask(task: IResponseFullTask): void {
    const properties = Object.keys(task);
    properties.forEach((property) => {
      if (task[property] != null && (property.endsWith('_at') || property.endsWith('_on'))) {
        task[property] = DateService.changeTimezone(task[property]);
      }
    });
  }
}
