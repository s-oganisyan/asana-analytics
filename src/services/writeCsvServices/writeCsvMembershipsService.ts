import WriteCsv from '../../interfaces/writeCsv';
import CreateCsvService from '../createCsvServices/createCsvService';
import { Writable } from 'stream';
import { IResponseFullTask } from '../../interfaces/asanaApi';

export default class WriteCsvWorkspacesService implements WriteCsv {
  private readonly file: Writable;

  readonly nameCsv: string = 'memberships';

  private readonly fields: string =
    'task_gid;project_gid;project_name;project_resource_type;section_gid;section_name;section_resource_type \n';

  constructor(dirName: string) {
    this.file = new CreateCsvService(dirName).createCsv(this.nameCsv);
    this.file.write(this.fields);
  }

  write(task: IResponseFullTask): void {
    if (!task.memberships) {
      return;
    }

    task.memberships.forEach((memberships) => {
      this.file.write(
        `${task.gid.trim()};${memberships.project.gid.trim()};${memberships.project.name.trim()};${memberships.project.resource_type.trim()};${memberships.section.gid.trim()};${memberships.section.name.trim()};${memberships.section.resource_type.trim()} \n`
      );
    });
  }
}
