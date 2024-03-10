import AssyncWrapper from '../common/middlewares/assyncWrapper/assyncWrapper';
import CustomError from '../common/utils/errors/customError';

abstract class AbstractController {
  protected assyncWrapper: AssyncWrapper;

  constructor() {
    this.assyncWrapper = new AssyncWrapper();
  }

  protected error(message?: string, status?: number, type?: string) {
    throw new CustomError(
      message || 'Something went wrong',
      status || 500,
      type || 'Internal server Error'
    );
  }
}

export default AbstractController;
