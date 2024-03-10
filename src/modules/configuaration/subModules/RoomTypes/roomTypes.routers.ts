import AbstractRouter from '../../../../abstracts/abstract.routers';
import ControllersRoomTypes from './roomTypes.controllers';

class RoutersRoomTypes extends AbstractRouter {
  private controllersRoomTypes = new ControllersRoomTypes();

  constructor() {
    super();

    this.callRouter();
  }

  private callRouter() {
    this.routers.get('/', this.controllersRoomTypes.viewRoomTypes);

    this.routers.post('/create', this.controllersRoomTypes.createRoomType);

    this.routers.get('/get-all', this.controllersRoomTypes.getAllRoomTypes);

    this.routers.delete(
      '/delete/:id',
      this.controllersRoomTypes.deleteRoomType
    );

    this.routers.patch('/edit/:id', this.controllersRoomTypes.editRoomType);
  }
}

export default RoutersRoomTypes;
