import asanaMock from '../mock/asanaMock';
import AsanaMakeDataProjects from '../../src/services/asanaMakeDataProjects';

const asanaClient = asanaMock();
const asanaRequestService = new AsanaMakeDataProjects(asanaClient);

test('getProjectsTasks', async () => {
  const projectsTasks = await asanaRequestService.getProjectsTasks();
  const projectName = await asanaClient.projects.getProjects();
  expect(projectsTasks[0].projectName).toEqual(projectName.data[0].name);
});
