import express from 'express';
import Logger from './logger';
import config from './config';
import loaders from './loaders';
import CsvService from './services/gcsServices/gcsService';

async function startServer(): Promise<void> {
  const app = express();
  try {
    await loaders(app);
  } catch (e) {
    Logger.error(e);
  }
  await new CsvService().loadCsvInGcs('test.csv', 'dev_data/test.csv');
  app.listen(config.PORT, () => {
    Logger.info(`port: ${config.PORT}`);
  });
}

startServer();
