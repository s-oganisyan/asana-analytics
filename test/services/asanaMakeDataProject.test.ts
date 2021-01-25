import asanaMock from '../mock/asanaMock';
import AsanaMakeDataProjectsService from '../../src/services/asanaMakeDataProjectsService';

const asanaClient = asanaMock();
const asanaRequestService = new AsanaMakeDataProjectsService(asanaClient);

test('getProjectsTasks', async () => {
  const projectsTasks = await asanaRequestService.getProjectsTasks();
  const projectName = await asanaClient.projects.getProjects();
  const task = await asanaClient.tasks.getTask();
  expect(projectsTasks[0].projectName).toEqual(projectName.data[0].name);
  expect(projectsTasks[0].tasks.data[0]).toEqual(task);
});
