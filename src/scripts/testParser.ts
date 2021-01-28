import asana from 'asana';
import express from 'express';
import config from '../config';
import Logger from '../logger';
import loaders from '../loaders';
import writeCsvForParseName from '../services/writeCsvServices/writeCsvForParseName';
import AsanaMakeDataProjects from '../services/asanaServices/asanaMakeDataProjectsService';

async function startServer(): Promise<void> {
  const app = express();
  try {
    await loaders(app);
  } catch (e) {
    Logger.error(e);
  }

  try {
    const client = asana.Client.create().useAccessToken(config.ASANA.PERSONAL_ACCESS_TOKEN);
    const asanaMakeDataProjects = new AsanaMakeDataProjects(client);
    const tasksOfProjects = await asanaMakeDataProjects.getProjectsTasksTest();
    const writeCsvService = new writeCsvForParseName();
    writeCsvService.writeCsv(tasksOfProjects);
    Logger.info(`script executed `);
  } catch (e) {
    Logger.error(e);
  }
}

startServer();
