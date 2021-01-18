import express from 'express';
import Logger from '../logger';
import expressLoader from './exspress';

export default async (expressApp: express.Application): Promise<void> => {
  try {
    await expressLoader({ app: expressApp });
  } catch (e) {
    Logger.error(e);
  }
};
