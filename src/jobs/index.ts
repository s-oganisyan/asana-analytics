const CronJob = require('cron').CronJob;

export default class CronJobs {
  public async handler(): Promise<void> {
    const job = new CronJob(
      '0 0 */12 * * *',
      () => {
        console.log('cron is work');
      },
      null,
      true,
      'America/Los_Angeles'
    );

    job.start();
  }
}
