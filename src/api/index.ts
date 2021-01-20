import asanaApi from './routers/asanaApi';
import helthCheck from './routers/helthCheck';
import { Router } from 'express';

export default (): Router => {
  const app = Router();
  helthCheck(app);
  asanaApi(app);

  return app;
};
