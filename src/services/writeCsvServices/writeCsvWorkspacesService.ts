import WriteCsv from '../../interfaces/writeCsv';
import CreateCsvService from '../createCsvServices/createCsvService';
import { Writable } from 'stream';
import { IResponseFullTask } from '../../interfaces/asanaApi';

export default class WriteCsvWorkspacesService implements WriteCsv {
  public readonly file: Writable;

  private workspaces: string[] = [];

  readonly nameCsv: string = 'workspaces';

  private readonly fields: string = 'gid;name;resource_type\n';

  constructor(dirName: string) {
    this.file = new CreateCsvService(dirName).createCsv(this.nameCsv);
    this.file.write(this.fields);
  }

  write(task: IResponseFullTask): void {
    if (!task.workspace) {
      return;
    }

    this.checkExistRecordAndWrite(
      task.workspace.gid,
      `${task.workspace.gid.trim()};${task.workspace.name.trim()};${task.workspace.resource_type.trim()}\n`
    );
  }

  private checkExistRecordAndWrite(gid: string, writeString: string) {
    if (!this.workspaces.some((arrayGid) => arrayGid == gid)) {
      this.workspaces.push(gid);
      this.file.write(writeString);
    }
  }
}
