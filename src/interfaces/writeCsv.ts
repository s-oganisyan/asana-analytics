import { Writable } from 'stream';
import { IResponseFullTask } from './asanaApi';

export default interface WriteCsv {
  readonly file?: Writable;
  readonly nameCsv: string;
  write(task: IResponseFullTask): void;
  setProjectName?(projectName: string): void;
}
