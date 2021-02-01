import config from '../../config';
import Logger from '../../logger';
import gbq from '../../loaders/googleBigquery';
import gcs from '../../loaders/googleCloudStorage';
import { Router } from 'express';
const router = Router();

/* healthCheck */
export default (app: Router): void => {
  app.use('/', router);
  router.get('/', async (req, res) => {
    let googleCloudStorage = false;
    let googleBigquery = false;

    try {
      await gbq().getDatasets();
      googleBigquery = true;
    } catch (e) {
      Logger.error(e);
    }

    try {
      const bucket = await gcs().bucket(config.GCS.PROJECT_NAME);
      await bucket.get();
      googleCloudStorage = true;
    } catch (e) {
      Logger.error(e);
    }

    res.status(200).send({
      node: true,
      googleCloudStorage,
      googleBigquery,
    });
  });
};
