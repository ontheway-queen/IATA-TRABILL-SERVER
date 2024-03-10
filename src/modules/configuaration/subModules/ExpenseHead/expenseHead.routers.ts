import AbstractRouter from '../../../../abstracts/abstract.routers';
import ControllersExpenseHead from './expenseHead.controllers';

class RoutersExpenseHead extends AbstractRouter {
  private controllersExpenseHead = new ControllersExpenseHead();

  constructor() {
    super();

    this.callRouter();
  }

  private callRouter() {
    this.routers.get('/', this.controllersExpenseHead.viewExpenseHeads);

    this.routers.post(
      '/create',
      this.controllersExpenseHead.createControllerExpenseHead
    );
    this.routers.get('/read', this.controllersExpenseHead.getAllExpenseHeads);
    this.routers.patch(
      '/update/:head_id',
      this.controllersExpenseHead.updateControllerExpenseHead
    );
    this.routers.delete(
      '/delete/:head_id',
      this.controllersExpenseHead.deleteControllerExpenseHead
    );
  }
}

export default RoutersExpenseHead;
