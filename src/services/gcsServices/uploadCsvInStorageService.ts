import path from 'path';
import asana from 'asana';
import fs from 'fs/promises';
import config from '../../config';
import GcsService from './gcsService';
import WriteCsvService from '../writeCsvServices/writeCsvService';
import AsanaMakeDataProjectsService from '../asanaServices/asanaMakeDataProjectsService';

export default class UploadCsvInStorageService {
  private gcsService: GcsService;

  private asanaMakeDataProjects: AsanaMakeDataProjectsService;

  constructor() {
    const client = asana.Client.create().useAccessToken(config.ASANA.PERSONAL_ACCESS_TOKEN);
    this.asanaMakeDataProjects = new AsanaMakeDataProjectsService(client);
    this.gcsService = new GcsService();
  }

  async upload(): Promise<void> {
    const tasksOfProjects = await this.asanaMakeDataProjects.getProjectsTasks();
    const writeCsvService = new WriteCsvService();
    const pathToCsv = path.resolve(__dirname, '../../../csv');

    await writeCsvService.writeCsv(tasksOfProjects);

    const fileNames = await fs.readdir(pathToCsv);
    fileNames.forEach((filename) => {
      this.gcsService.loadCsvInGcs(`${pathToCsv}/${filename}`, `dev/${filename}`);
    });
  }
}
