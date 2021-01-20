import Cron from '../jobs';
import express from 'express';
import Logger from '../logger';
import expressLoader from './exspress';
import { Container } from 'typedi';

export default async (expressApp: express.Application): Promise<void> => {
  try {
    await expressLoader({ app: expressApp });
    Container.get(Cron).handler();
  } catch (e) {
    Logger.error(e);
  }
};
