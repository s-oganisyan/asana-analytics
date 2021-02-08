import path from 'path';
import fs from 'fs/promises';
import writeCsv from '../../interfaces/writeCsv';
import DateHelper from '../helperServices/dateHelper';
import WriteCsvTasksService from './writeCsvTasksService';
import WriteCsvProjectsService from './writeCsvProjectsService';
import { IProject, IResponseFullTask } from '../../interfaces/asanaApi';

export default class WriteCsvService {
  private readonly dirName: string;

  private writeCsvTasksService: WriteCsvTasksService;

  private writeCsvProjectsService: WriteCsvProjectsService;

  private csvServices: writeCsv[];

  constructor(dirName = 'csv') {
    this.dirName = dirName;
    this.writeCsvTasksService = new WriteCsvTasksService(dirName);
    this.writeCsvProjectsService = new WriteCsvProjectsService(dirName);
  }

  public async writeCsv(projectTasks: IProject[]): Promise<void> {
    this.csvServices = await this.getCsvServices();
    this.writeCsvTasksService.writeTaskFields(this.csvServices, projectTasks[0].tasks.data[0]);

    projectTasks.forEach((project) => {
      project.tasks.data.forEach((task: IResponseFullTask) => {
        this.fixPropertyDateTask(task);
        this.csvServices.forEach((service: writeCsv) => {
          if (service.nameCsv === 'projects') {
            service.setProjectName(project.projectName);
          }
          service.write(task);
        });
      });
    });
  }

  private fixPropertyDateTask(task: IResponseFullTask): void {
    const properties = Object.keys(task);
    properties.forEach((property) => {
      if (task[property] != null && (property.endsWith('_at') || property.endsWith('_on'))) {
        task[property] = DateHelper.changeTimezone(task[property]);
      }
    });
  }

  private async getCsvServices(): Promise<writeCsv[]> {
    const fileNames = await fs.readdir(__dirname);
    const currentPathFile = __filename.split(/\/|\\/);
    const csvServices: writeCsv[] = [];

    fileNames
      .filter(
        (fileName) =>
          fileName !== currentPathFile[currentPathFile.length - 1] &&
          (fileName.endsWith('ts') || fileName.endsWith('js'))
      )
      .forEach((filename) => {
        const csvServiceClass = require(path.resolve(__dirname, filename)).default;
        csvServices.push(new csvServiceClass(this.dirName));
      });

    return csvServices;
  }
}
