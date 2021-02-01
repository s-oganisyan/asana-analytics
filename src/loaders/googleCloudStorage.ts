import path from 'path';
import config from '../config';
import { Storage } from '@google-cloud/storage';

export default (): Storage => {
  const jsonFile = path.resolve(__dirname, `../../${config.GCS.FILE_NAME}`);
  return new Storage({
    projectId: config.GCS.PROJECT_ID,
    keyFilename: jsonFile,
  });
};
