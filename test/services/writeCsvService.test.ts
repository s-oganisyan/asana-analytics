import fs from 'fs';
import path from 'path';
import asanaMock from '../mock/asanaMock';
import WriteCsvService from '../../src/services/writeCsvServices/writeCsvService';
import AsanaMakeDataProjectsService from '../../src/services/asanaServices/asanaMakeDataProjectsService';

const asanaClient = asanaMock();
const asanaRequestService = new AsanaMakeDataProjectsService(asanaClient);
const dirName = 'csvTest';

beforeEach(async () => {
  const writeCsvService = new WriteCsvService(dirName);
  const projectsTasks = await asanaRequestService.getProjectsTasks();
  await writeCsvService.writeCsv(projectsTasks);
});

test('writeCsv', async () => {
  const pathTest = `../../${dirName}`;
  const pathDir = path.resolve(__dirname, pathTest);
  const testFileNames = [
    'memberships.csv',
    'projects.csv',
    'tags.csv',
    'tasks.csv',
    'users.csv',
    'workspaces.csv',
    'parseName.csv',
  ];
  const existDir = fs.existsSync(pathDir);
  expect(existDir).toBeTruthy();

  const fileNames = fs.readdirSync(pathDir);
  for (const fileName of fileNames) {
    const existFile = testFileNames.some((testFileName) => fileName === testFileName);
    expect(existFile).toBeTruthy();
    fs.unlinkSync(`${pathDir}/${fileName}`);
  }

  fs.rmdirSync(pathDir);
});
