import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

import CustomError from '../../utils/errors/customError';
import ValidationErr from '../../utils/errors/validationError';
import Logger from '../../utils/logger/logger';

type Func = (req: Request, res: Response, next: NextFunction) => Promise<void>;
type Validator = (req: Request, res: Response, next: NextFunction) => void;

class AssyncWrapper {
  log = new Logger();

  // CONTROLLER ASYNCWRAPPER
  public wrap(validators: Validator[], cb: Func) {
    const middleware = async (
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
      try {
        const errors = validationResult(req);

        /**
         * throw error if there are any invalid inputs
         */
        if (!errors.isEmpty()) {
          throw new ValidationErr(errors);
        }

        await cb(req, res, next);
      } catch (err: any) {
        console.log({ error: err.sqlMessage, message: err });

        if (err.code === 'ER_ROW_IS_REFERENCED_2') {
          const str = (err.sqlMessage as string)
            .split(' FOREIGN KEY ')[1]
            .slice(0, 50)
            .split('`')[1];

          this.log.logger.error({
            message: 'This row is already being used and cannot be deleted',
            error: {
              message: `Please provide a valid data for ${str}.`,
              stack: err.stack,
            },
            req: req.originalUrl,
            method: req.method,
          });

          return next(
            new CustomError(
              `This row is already being used and cannot be deleted`,
              400,
              `Please provide a valid data for ${str}.`
            )
          );
        }

        if (err.code === 'ER_BAD_FIELD_ERROR') {
          this.log.logger.error({
            message: err.message || 'Bad field error',
            error: {
              stack: err.stack,
            },
            req: req.originalUrl,
            method: req.method,
          });

          return next(new CustomError(err.sqlMessage, 400, 'Bad field error'));
        }

        if (err.code === 'ER_NO_REFERENCED_ROW_2') {
          const str = (err.sqlMessage as string)
            .split(' FOREIGN KEY ')[1]
            .slice(0, 50)
            .split('`')[1];

          this.log.logger.error({
            message: 'Invalid data',
            error: {
              message: `Please provide a valid data for ${str}.`,
              stack: err.stack,
            },
            req: req.originalUrl,
            method: req.method,
          });

          return next(
            new CustomError(
              `Please provide a valid data for ${str}`,
              400,
              'Invalid data'
            )
          );
        }

        if (err.name === 'TokenExpiredError') {
          this.log.logger.info({
            message: err.massage || 'Token expired',
            error: {
              stack: err.stack,
            },
            req: req.originalUrl,
            method: req.method,
          });

          return next(
            new CustomError(
              'The token you provided has been expired',
              400,
              'Token expired'
            )
          );
        }

        if (err.code === 'ER_DATA_TOO_LONG') {
          this.log.logger.error({
            message: err.massage || 'data Too long',
            error: {
              stack: err.stack,
            },
            req: req.originalUrl,
            method: req.method,
          });

          return next(new CustomError(err.sqlMessage, 400, 'Too long data'));
        }

        if (err.code === 'ER_WARN_DATA_OUT_OF_RANGE') {
          this.log.logger.info({
            message: err.massage || 'Out of range input value',
            error: {
              stack: err.stack,
            },
            req: req.originalUrl,
            method: req.method,
          });

          return next(new CustomError(err.sqlMessage, 400, 'Out of range'));
        }

        this.log.logger.error({
          message: err.massage || 'No specific massage found',
          error: {
            stack: err.stack,
          },
          req: req.originalUrl,
          method: req.method,
        });

        next(new CustomError(err.message, err.status, err.type));
      }
    };

    return [...validators, middleware];
  }
}

export default AssyncWrapper;
