import { NextFunction, Request, Response } from 'express';

class DBSetter {
  public setDb(req: Request, _res: Response, next: NextFunction) {
    // const [user] = req.subdomains;

    // req.user = req.headers.tenant as string;
    req.role_id = 1;

    next();
  }
}

export default DBSetter;
