import AbstractController from '../../../../abstracts/abstract.controllers';
import VisaStatusServices from './visaStatus.services';
import VisaStatusValidator from './visaStatus.validator';

class VisaStatusControllers extends AbstractController {
  private services = new VisaStatusServices();
  private validator = new VisaStatusValidator();

  constructor() {
    super();
  }
}
export default VisaStatusControllers;
