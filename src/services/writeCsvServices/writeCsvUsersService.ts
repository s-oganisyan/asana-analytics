import WriteCsv from '../../interfaces/writeCsv';
import CreateCsvService from '../createCsvServices/createCsvService';
import { Writable } from 'stream';
import { IApiEntity, IResponseFullTask } from '../../interfaces/asanaApi';

export default class WriteCsvUsersService implements WriteCsv {
  private readonly file: Writable;

  private users: string[] = [];

  readonly nameCsv: string = 'users';

  private readonly fields: string = 'gid;name;resource_type \n';

  constructor(dirName: string) {
    this.file = new CreateCsvService(dirName).createCsv(this.nameCsv);
    this.file.write(this.fields);
  }

  write(task: IResponseFullTask): void {
    if (!task.followers) {
      return;
    }

    task.followers.forEach((user) => {
      this.writeRecord(user);
    });

    this.writeRecord(task.assignee);
  }

  private writeRecord(userField: IApiEntity) {
    if (!userField) {
      return;
    }
    this.checkExistRecordAndWrite(
      userField.gid,
      `${userField.gid.trim()};${userField.name.trim()};${userField.resource_type.trim()} \n`
    );
  }

  private checkExistRecordAndWrite(gid: string, writeString: string) {
    if (!this.users.some((arrayGid) => arrayGid == gid)) {
      this.users.push(gid);
      this.file.write(writeString);
    }
  }
}
