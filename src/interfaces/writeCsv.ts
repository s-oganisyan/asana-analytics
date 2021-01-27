import { IResponseFullTask } from './asanaApi';

export default interface WriteCsv {
  write(task: IResponseFullTask): void;
}
