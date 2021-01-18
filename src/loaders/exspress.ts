import cors from 'cors';
import routers from '../api';
import express from 'express';
import bodyParser from 'body-parser';

export default async ({ app }: { app: express.Application }): Promise<express.Application> => {
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cors());

  app.use('/', await routers());

  return app;
};
