import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Request, Response } from 'express';
import moment from 'moment-timezone';
import morgan from 'morgan';
import path from 'path';
import AdminAuthRouter from '../auth/admin_auth.router';
import AuthChecker from '../common/middlewares/authChecker/checkAuth';
import ErrorHandler from '../common/middlewares/errorHandlers/errorHandler';
import MiniMW from '../common/middlewares/mini/mini';
import config from '../config/config';
import routes from './routes';

import Logger from '../common/utils/logger/logger';

class App {
  public app = express();
  private port: number = config.PORT;
  private authChecker = new AuthChecker();
  private miniMW = new MiniMW();
  log = new Logger();

  constructor() {
    this.initMiddlewares();
    this.initRouters(new AdminAuthRouter());
    this.moduleRouters();
    this.notFoundRouter();
    this.errorHandler();
    const desiredTimezone = 'Asia/Dhaka';
    moment.tz.setDefault(desiredTimezone);
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`server is listening at ${this.port}....`);
    });
  }

  private initMiddlewares() {
    this.app.use(express.json());
    this.app.use(
      morgan('dev', {
        skip: (req: Request, res: Response) => req.originalUrl === '/metrics',
      })
    );
    this.app.use(cookieParser(config.COOKIE_SECRET));
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cors({ origin: this.miniMW.cors, credentials: true }));
    this.app.use(express.static(path.join(__dirname, 'public')));
  }

  private initRouters(adminRouter: AdminAuthRouter) {
    this.app.get('/', (_req, res) => {
      res.send('app is running successfully...');
    });

    this.app.use('/api/v1/auth', adminRouter.routers);
  }

  private moduleRouters() {
    /**
     * @router {Auth checker}
     */
    this.app.use(this.authChecker.check);

    routes(this.app);
  }

  private notFoundRouter() {
    this.app.use(this.miniMW[404]);
  }

  private errorHandler() {
    const errorHandler = new ErrorHandler();
    this.app.use(errorHandler.handleErrors);
  }
}

export default App;
