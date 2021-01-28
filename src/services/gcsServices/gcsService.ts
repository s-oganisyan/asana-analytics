import fs from 'fs';
import path from 'path';
import Logger from '../../logger';
import config from '../../config/index';
import { Bucket, Storage } from '@google-cloud/storage';

export default class GcsService {
  storage: Storage;

  pathDir: string;

  constructor() {
    this.pathDir = path.resolve(__dirname, '../../../csv/');

    const asanaFilePath = path.resolve(__dirname, `../../../${config.ASANA_FILE_NAME}`);
    this.storage = new Storage({
      projectId: config.PROJECT_ID,
      keyFilename: asanaFilePath,
    });
  }

  async loadCsvInGcs(readFile: string, writeFile: string): Promise<void> {
    const bucket = await this.storage.bucket(config.PROJECT_NAME);
    const pathFile = path.resolve(this.pathDir, readFile);

    this.uploadFile(bucket, pathFile, writeFile);
  }

  private uploadFile(bucket: Bucket, pathFile: string, writeFile: string) {
    fs.createReadStream(pathFile).pipe(
      bucket
        .file(writeFile)
        .createWriteStream({
          gzip: true,
        })
        .on('error', (err) => {
          Logger.error(err.message);
        })
        .on('finish', () => {
          Logger.info('Done');
        })
    );
  }
}
