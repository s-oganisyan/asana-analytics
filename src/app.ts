import express from 'express';
import Logger from './logger';
import config from './config';
import loaders from './loaders';

async function startServer(): Promise<void> {
  const app = express();
  try {
    await loaders(app);
  } catch (e) {
    Logger.error(e);
  }
  app.listen(config.PORT, () => {
    Logger.info(`port: ${config.PORT}`);
  });
}

startServer();
