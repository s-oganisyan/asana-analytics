import fs from 'fs';
import path from 'path';
import asanaMock from '../mock/asanaMock';
import WriteCsvService from '../../src/services/writeCsvService';
import AsanaMakeDataProjectsService from '../../src/services/asanaMakeDataProjectsService';

const asanaClient = asanaMock();
const asanaRequestService = new AsanaMakeDataProjectsService(asanaClient);
const dirName = 'csvTest';

beforeEach(async () => {
  const writeCsvService = new WriteCsvService();
  const projectsTasks = await asanaRequestService.getProjectsTasks();
  writeCsvService.writeCsv(projectsTasks);
});

test('writeCsv', async () => {
  const pathTest = `../../${dirName}`;
  const testFileNames = ['memberships.csv', 'project.csv', 'tags.csv', 'tasks.csv', 'users.csv', 'workspaces.csv'];
  const existDir = fs.existsSync(path.resolve(__dirname, pathTest));
  expect(existDir).toBeTruthy();

  const fileNames = fs.readdirSync(path.resolve(__dirname, pathTest));
  for (const fileName of fileNames) {
    const existFile = testFileNames.some((testFileName) => fileName === testFileName);
    expect(existFile).toBeTruthy();
  }
});
