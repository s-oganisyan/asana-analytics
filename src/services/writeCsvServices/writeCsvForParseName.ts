import WriteCsv from '../../interfaces/writeCsv';
import CreateCsvService from '../createCsvServices/createCsvService';
import ParseStringService from '../helperServices/parseStringService';
import { Writable } from 'stream';
import { IProject } from '../../interfaces/asanaApi';
import { IResponseFullTask } from '../../interfaces/asanaApi';

export default class writeCsvForParseName implements WriteCsv {
  private createCsvService: CreateCsvService;

  private readonly nameCsv: string = 'parseName';
  private readonly file: Writable;

  constructor() {
    this.file = new CreateCsvService().createCsv(this.nameCsv);
    this.createCsvService = new CreateCsvService();
  }

  public writeCsv(projectTasks: IProject[]): void {
    this.writeTaskFields(projectTasks[0].tasks.data[0]);

    projectTasks.forEach((project) => {
      project.tasks.data.forEach((task) => {
        this.write(task);
      });
    });
  }
  write(task: IResponseFullTask): void {
    this.file.write(`${this.getTaskProperty(task)}; \n`);
  }

  public writeTaskFields(task: IResponseFullTask): void {
    this.file.write(`${this.getTaskPropertyNames(task)}; \n`);
  }

  private getTaskPropertyNames(task: IResponseFullTask): string {
    return Object.keys(task).join(';');
  }

  private getTaskProperty(task: IResponseFullTask): string {
    let properties = '';

    for (const key in task) {
      const value = ParseStringService.removeSymbolsInString(task[key]);
      properties = properties === '' ? `${value}` : `${properties}; ${value}`;
    }
    return properties;
  }
}
