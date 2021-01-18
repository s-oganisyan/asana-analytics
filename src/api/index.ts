import helthCheck from './routers/helthCheck';
import { Router } from 'express';

export default (): Router => {
  const app = Router();
  helthCheck(app);

  return app;
};
