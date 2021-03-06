import { Router } from 'express';

const router = Router();

/* healthCheck */
export default (app: Router): void => {
  app.use('/', router);
  router.get('/', function (req, res) {
    res.status(200).send('Ok');
  });
};
