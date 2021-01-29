import { IResponseFullTask } from './asanaApi';

export default interface WriteCsv {
  readonly nameCsv: string;
  write(task: IResponseFullTask): void;
  setProjectName?(projectName: string): void;
}
