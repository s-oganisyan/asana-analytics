import config from '../../config';
import gcs from '../../loaders/googleCloudStorage';
import { Router } from 'express';
const router = Router();

/* healthCheck */
export default (app: Router): void => {
  app.use('/', router);
  router.get('/', async (req, res) => {
    const bucket = await gcs().bucket(config.GCS.PROJECT_NAME);
    res.status(200).send({
      node: true,
      googleCloudStorage: !!bucket.getId(),
    });
  });
};
