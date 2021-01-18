import express from 'express';
import Logger from './logger';
import loaders from './loaders';

async function startServer(): Promise<void> {
  const app = express();
  try {
    await loaders(app);
  } catch (e) {
    Logger.error(e);
  }

  app.listen(process.env.PORT, () => {
    Logger.info(`port: ${process.env.PORT ? process.env.PORT : 3000}`);
  });
}

startServer();
