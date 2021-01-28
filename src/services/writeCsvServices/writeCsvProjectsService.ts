import WriteCsv from '../../interfaces/writeCsv';
import CreateCsvService from '../createCsvServices/createCsvService';
import { Writable } from 'stream';
import { IResponseFullTask } from '../../interfaces/asanaApi';

export default class WriteCsvProjectsService implements WriteCsv {
  private readonly file: Writable;

  private projectName: string;

  private readonly nameCsv: string = 'projects';

  private readonly fields: string = 'project_name;task_gid \n';

  constructor(dirName: string) {
    this.file = new CreateCsvService(dirName).createCsv(this.nameCsv);
    this.file.write(this.fields);
  }

  write(task: IResponseFullTask): void {
    this.file.write(`${this.projectName};${task.gid} \n`);
  }

  setProjectName(projectName: string): void {
    this.projectName = projectName;
  }
}
