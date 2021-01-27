import WriteCsv from '../../interfaces/writeCsv';
import CreateCsvService from '../createCsvServices/createCsvService';
import { Writable } from 'stream';
import { IResponseFullTask } from '../../interfaces/asanaApi';

export default class WriteCsvTagsService implements WriteCsv {
  private readonly file: Writable;

  private readonly nameCsv: string = 'tags';

  private readonly fields: string = 'task_gid;gid;name;resource_type \n';

  constructor() {
    this.file = new CreateCsvService().createCsv(this.nameCsv);
    this.file.write(this.fields);
  }

  write(task: IResponseFullTask): void {
    if (!task.tags) {
      return;
    }

    task.tags.forEach((tags) => {
      this.file.write(`${task.gid.trim()};${tags.gid.trim()};${tags.name.trim()};${tags.resource_type.trim()} \n`);
    });
  }
}