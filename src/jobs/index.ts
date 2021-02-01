import Logger from '../logger';
import config from '../config';
import UploadCsvInStorageService from '../services/gcsServices/uploadCsvInStorageService';
import { Container } from 'typedi';

const CronJob = require('cron').CronJob;

export default class CronJobs {
  public async handler(): Promise<void> {
    const job = new CronJob(
      `0 0 */${config.TIME_RESPONSE_DATA} * * *`,
      await this.cronCallBack,
      null,
      true,
      'America/Los_Angeles'
    );

    job.start();
  }

  private async cronCallBack() {
    try {
      await Container.get(UploadCsvInStorageService).upload();
    } catch (e) {
      Logger.error(e);
    }
  }
}
