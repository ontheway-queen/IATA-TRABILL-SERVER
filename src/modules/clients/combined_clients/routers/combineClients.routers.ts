import AbstractRouter from '../../../../abstracts/abstract.routers';
import CombineClientsControllers from '../controllers/combineClients.controllers';

class CombineClientsRouters extends AbstractRouter {
  private controllers = new CombineClientsControllers();

  constructor() {
    super();

    this.callRouter();
  }
  private callRouter() {
    this.routers.post('/create', this.controllers.createCombineClients);

    this.routers.get('/combines', this.controllers.getAllCombines);

    this.routers.get('/view-combine', this.controllers.viewAllCombine);

    this.routers.get(
      '/excel/report',
      this.controllers.getCombineClientExcelReport
    );

    this.routers
      .route('/combines/:id')
      .patch(this.controllers.updateClientStatus)
      .delete(this.controllers.deleteCombineClients);

    this.routers.get(
      '/combine_for_edit/:combine_id',
      this.controllers.getCombinesForEdit
    );

    this.routers.patch(
      '/update-client/:id',
      this.controllers.editCombineClients
    );
  }
}
export default CombineClientsRouters;
