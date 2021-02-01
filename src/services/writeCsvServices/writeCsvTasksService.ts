import WriteCsv from '../../interfaces/writeCsv';
import writeCsv from '../../interfaces/writeCsv';
import ParseStringHelper from '../helperServices/parseStringHelper';
import CreateCsvService from '../createCsvServices/createCsvService';
import { Writable } from 'stream';
import { IResponseFullTask } from '../../interfaces/asanaApi';

export default class WriteCsvTasksService implements WriteCsv {
  public readonly file: Writable;

  readonly nameCsv: string = 'tasks';

  constructor(dirName: string) {
    this.file = new CreateCsvService(dirName).createCsv(this.nameCsv);
  }

  write(task: IResponseFullTask): void {
    this.file.write(`${this.getTaskProperty(task)};${this.doneRequestTime(task)}\n`);
  }

  public writeTaskFields(services: writeCsv[], task: IResponseFullTask): void {
    services.forEach((service) => {
      if (service.nameCsv === this.nameCsv) {
        this.writeFields(service, task);
      }
    });
  }

  public writeFields(service: writeCsv, task: IResponseFullTask): void {
    service.file.write(`${this.getTaskPropertyNames(task)};done_request_time\n`);
  }

  private getTaskPropertyNames(task: IResponseFullTask): string {
    return Object.keys(task).join(';');
  }

  private getTaskProperty(task: IResponseFullTask): string {
    let properties = '';

    for (const key in task) {
      const value = ParseStringHelper.removeSymbolsInString(task[key]);
      properties = properties === '' ? `${value}` : `${properties}; ${value}`;
    }

    return properties;
  }

  private doneRequestTime(task: IResponseFullTask): number {
    const createAt = new Date(task.created_at);
    const modifiedAt = new Date(task.modified_at);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return modifiedAt - createAt;
  }
}
