import { IApiEntity, IGetTaskListParams, IResponseFullTask, ITasks } from './asanaApi';

export default interface IAsanaRequestService {
  getTasks(params: IGetTaskListParams): Promise<ITasks>;

  getProjectList(): Promise<IApiEntity[]>;

  getTaskById(gid: string): Promise<IResponseFullTask>;
}
