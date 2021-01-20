import Logger from '../logger';
import config from '../config';

const CronJob = require('cron').CronJob;

export default class CronJobs {
  public async handler(): Promise<void> {
    const job = new CronJob(
      `0 0 */${config.TIME_RESPONSE_DATA} * * *`,
      () => {
        Logger.info('cron is work');
      },
      null,
      true,
      'America/Los_Angeles'
    );

    job.start();
  }
}
