import asana from 'asana';
import express from 'express';
import config from '../config';
import Logger from '../logger';
import loaders from '../loaders';
import ParseTicketForStaging from '../services/helperServices/parseStringHelper';
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
    const tasksOfProjects = await asanaMakeDataProjects.getProjectsTasks();
    // const tasksForStaging = ParseTicketForStaging.parseTickets(tasksOfProjects);
    // console.log('tasksForStaging', tasksForStaging);
    Logger.info(`script executed `);
  } catch (e) {
    Logger.error(e);
  }
}

startServer();
