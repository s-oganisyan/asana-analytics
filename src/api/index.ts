import fs from 'fs/promises';
import { Router } from 'express';

export default async (): Promise<Router> => {
  const app = Router();
  const fileNames = await fs.readdir(`${__dirname}/routers/`);
  fileNames
    .filter((filename: string) => filename.endsWith('ts') || filename.endsWith('js'))
    .forEach((filename: string) => {
      const controller = require(`./routers/${filename}`).default;
      controller(app);
    });

  return app;
};
