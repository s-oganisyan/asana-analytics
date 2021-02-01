// Imports the Google Cloud client library
import path from 'path';
import config from '../config';
import { BigQuery } from '@google-cloud/bigquery';

export default (): BigQuery => {
  const jsonFile = path.resolve(__dirname, `../../${config.GCS.FILE_NAME}`);
  // Creates a client
  return new BigQuery({
    projectId: config.GCS.PROJECT_ID,
    keyFilename: jsonFile,
  });
};
