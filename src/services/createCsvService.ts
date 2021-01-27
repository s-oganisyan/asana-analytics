import fs from 'fs';
import path from 'path';
import { Writable } from 'stream';

export default class CreateCsvService {
  private readonly dirName: string;

  constructor(dirName = 'csv') {
    this.dirName = dirName;
  }

  public createCsv(fileName: string): Writable {
    this.createCsvDirectory(path.resolve(__dirname, `../../${this.dirName}`));
    return this.createStreamForWriteCsv(fileName);
  }

  private createCsvDirectory(path: string): void {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }
  }

  private createStreamForWriteCsv(fileName: string): Writable {
    return fs.createWriteStream(this.getPath(fileName));
  }

  private getPath(fileName: string): string {
    return path.resolve(__dirname, `../../${this.dirName}/${fileName}.csv`);
  }
}
