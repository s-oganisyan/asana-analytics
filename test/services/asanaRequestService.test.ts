import asanaMock from '../mock/asanaMock';
import AsanaRequestService from '../../src/services/asanaServices/asanaRequestService';
import { IGetTaskListParams } from '../../src/interfaces/asanaApi';

const asanaClient = asanaMock();
const asanaRequestService = new AsanaRequestService(asanaClient);

test('getProjectList', async () => {
  const projectList = await asanaRequestService.getProjectList();
  const mockProjectList = await asanaClient.projects.getProjects();
  expect(projectList).toEqual(mockProjectList.data);
});

test('getTasks', async () => {
  const tasks = await asanaRequestService.getTasks({} as IGetTaskListParams);
  const mockTasks = await asanaClient.tasks.getTasks();
  expect(tasks).toEqual(mockTasks);
});

test('getTaskById', async () => {
  const task = await asanaRequestService.getTaskById('11111111');
  const mockTask = await asanaClient.tasks.getTask();
  expect(task).toEqual(mockTask);
});
