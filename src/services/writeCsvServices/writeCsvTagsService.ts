import WriteCsv from '../../interfaces/writeCsv';
import CreateCsvService from '../createCsvServices/createCsvService';
import { Writable } from 'stream';
import { IResponseFullTask } from '../../interfaces/asanaApi';

export default class WriteCsvTagsService implements WriteCsv {
  private readonly file: Writable;

  readonly nameCsv: string = 'tags';

  private readonly fields: string = 'task_gid;gid;name;resource_type \n';

  constructor(dirName: string) {
    this.file = new CreateCsvService(dirName).createCsv(this.nameCsv);
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
