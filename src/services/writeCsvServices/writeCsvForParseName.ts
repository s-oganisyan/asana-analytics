import WriteCsv from '../../interfaces/writeCsv';
import ParseStringHelper from '../helperServices/parseStringHelper';
import CreateCsvService from '../createCsvServices/createCsvService';
import { Writable } from 'stream';
import { IResponseFullTask, ITaskNameObj } from '../../interfaces/asanaApi';

export default class writeCsvForParseName implements WriteCsv {
  public readonly file: Writable;

  readonly nameCsv: string = 'parseName';

  private readonly fields: string = 'task_gid;task_name;client;company;job_title;developer;platform;agency\n';

  constructor(dirName: string) {
    this.file = new CreateCsvService(dirName).createCsv(this.nameCsv);
    this.file.write(this.fields);
  }

  write(task: IResponseFullTask): void {
    const taskForWrite: ITaskNameObj = this.parseTicketsName(task.name);
    this.file.write(
      // eslint-disable-next-line
      `${task.gid.trim()};${ParseStringHelper.removeSymbolsInString(task.name)};${taskForWrite.client};${taskForWrite.company};${taskForWrite.job_title};${taskForWrite.developer};${taskForWrite.platform};${taskForWrite.agency}\n`
    );
  }

  replacer(name: string): string[] {
    const customer = name.slice(0, name.indexOf('/'));
    const job_title = name.slice(name.indexOf('/') + 1, name.indexOf('//'));
    const devInfo = name.slice(name.lastIndexOf('(') + 1, name.lastIndexOf(')')).trim();
    return [customer, job_title, devInfo];
  }

  private parseTicketsName(name: string): ITaskNameObj {
    const [customer, job_title, devInfo] = this.replacer(name);
    const [client, company] = customer.split(',');
    const [developer, platform] = devInfo.split(' ', 2);
    const agency = devInfo.toLowerCase().indexOf('agency') !== -1;
    const res = {
      client: client ? (ParseStringHelper.removeSymbolsInString(client) as string) : null,
      company: company ? (ParseStringHelper.removeSymbolsInString(company) as string) : null,
      job_title: job_title ? (ParseStringHelper.removeSymbolsInString(job_title) as string) : null,
      developer: developer ? (ParseStringHelper.removeSymbolsInString(developer) as string) : null,
      platform:
        platform && platform.toLowerCase() !== 'agency'
          ? (ParseStringHelper.removeSymbolsInString(platform) as string)
          : null,
      agency,
    };
    return res;
  }
}
