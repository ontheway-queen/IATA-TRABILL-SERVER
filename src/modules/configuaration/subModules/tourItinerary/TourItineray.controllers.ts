import { Request, Response } from 'express';

import AbstractController from '../../../../abstracts/abstract.controllers';
import TourItinerayServices from './TourItineray.services';
import TourItinerayValidators from './TourItineray.validators';

class TourItinerayControllers extends AbstractController {
  private services = new TourItinerayServices();
  private validator = new TourItinerayValidators();

  constructor() {
    super();
  }

  public createTourGroups = this.assyncWrapper.wrap(
    this.validator.createTourGroups,
    async (req: Request, res: Response) => {
      const data = await this.services.createTourGroups(req);

      if (data.success) {
        res.status(201).json(data);
      } else {
        this.error('create tour gorups controller');
      }
    }
  );

  public updateTourGroups = this.assyncWrapper.wrap(
    this.validator.updateTourGroups,
    async (req: Request, res: Response) => {
      const data = await this.services.updateTourGroups(req);

      if (data.success) {
        res.status(201).json(data);
      } else {
        this.error('create tour gorups controller');
      }
    }
  );

  public deleteTourGroups = this.assyncWrapper.wrap(
    this.validator.deleteData,
    async (req: Request, res: Response) => {
      const data = await this.services.deleteTourGroups(req);

      if (data.success) {
        res.status(201).json(data);
      } else {
        this.error('create tour gorups controller');
      }
    }
  );

  public viewTourGroups = this.assyncWrapper.wrap(
    this.validator.readData,
    async (req: Request, res: Response) => {
      const data = await this.services.viewTourGroups(req);

      if (data.success) {
        res.status(201).json(data);
      } else {
        this.error('create tour gorups controller');
      }
    }
  );
  public getAllTourGroups = this.assyncWrapper.wrap(
    this.validator.readData,
    async (req: Request, res: Response) => {
      const data = await this.services.getAllTourGroups(req);

      if (data.success) {
        res.status(201).json(data);
      } else {
        this.error('create tour gorups controller');
      }
    }
  );

  public getByIdTourGorup = this.assyncWrapper.wrap(
    this.validator.readData,
    async (req: Request, res: Response) => {
      const data = await this.services.getTourGroupById(req);

      if (data.success) {
        res.status(201).json(data);
      } else {
        this.error('create tour gorups controller');
      }
    }
  );
  public getTourVendorsInfo = this.assyncWrapper.wrap(
    this.validator.readData,
    async (req: Request, res: Response) => {
      const data = await this.services.getTourVendorsInfo(req);

      if (data.success) {
        res.status(201).json(data);
      } else {
        this.error('create tour gorups controller');
      }
    }
  );
  public getTourVendorByAccmId = this.assyncWrapper.wrap(
    this.validator.readData,
    async (req: Request, res: Response) => {
      const data = await this.services.getTourVendorByAccmId(req);

      if (data.success) {
        res.status(201).json(data);
      } else {
        this.error('create tour gorups controller');
      }
    }
  );

  // ======================= CITIES ==============================
  public createTourCities = this.assyncWrapper.wrap(
    this.validator.createTourCities,
    async (req: Request, res: Response) => {
      const data = await this.services.createCities(req);

      if (data.success) {
        res.status(201).json(data);
      } else {
        this.error('create tour gorups controller');
      }
    }
  );

  public updateTourCity = this.assyncWrapper.wrap(
    this.validator.updateTourCities,
    async (req: Request, res: Response) => {
      const data = await this.services.updateCities(req);

      if (data.success) {
        res.status(201).json(data);
      } else {
        this.error('create tour gorups controller');
      }
    }
  );

  public deleteTourCity = this.assyncWrapper.wrap(
    this.validator.deleteData,
    async (req: Request, res: Response) => {
      const data = await this.services.deleteCities(req);
      if (data.success) {
        res.status(201).json(data);
      } else {
        this.error('create tour gorups controller');
      }
    }
  );

  public viewToursCities = this.assyncWrapper.wrap(
    this.validator.readData,
    async (req: Request, res: Response) => {
      const data = await this.services.viewToursCities(req);
      if (data.success) {
        res.status(201).json(data);
      } else {
        this.error('create tour gorups controller');
      }
    }
  );
  public getAllCitites = this.assyncWrapper.wrap(
    this.validator.readData,
    async (req: Request, res: Response) => {
      const data = await this.services.getAllCitites(req);
      if (data.success) {
        res.status(201).json(data);
      } else {
        this.error('create tour gorups controller');
      }
    }
  );

  public getByIdCity = this.assyncWrapper.wrap(
    this.validator.readData,
    async (req: Request, res: Response) => {
      const data = await this.services.getByIdCity(req);
      if (data.success) {
        res.status(201).json(data);
      } else {
        this.error('create tour gorups controller');
      }
    }
  );

  // ============ TICKETS =================

  public createTourTicket = this.assyncWrapper.wrap(
    this.validator.creteTourTickets,
    async (req: Request, res: Response) => {
      const data = await this.services.createTourTicket(req);
      if (data.success) {
        res.status(201).json(data);
      } else {
        this.error('create tour gorups controller');
      }
    }
  );
  public updateTourTicket = this.assyncWrapper.wrap(
    this.validator.updateTourTickets,
    async (req: Request, res: Response) => {
      const data = await this.services.updateTourTicket(req);
      if (data.success) {
        res.status(201).json(data);
      } else {
        this.error('create tour gorups controller');
      }
    }
  );
  public viewToursItineraries = this.assyncWrapper.wrap(
    this.validator.readData,
    async (req: Request, res: Response) => {
      const data = await this.services.viewToursItineraries(req);
      if (data.success) {
        res.status(201).json(data);
      } else {
        this.error('create tour gorups controller');
      }
    }
  );
  public getAllTourTicket = this.assyncWrapper.wrap(
    this.validator.readData,
    async (req: Request, res: Response) => {
      const data = await this.services.getAllTourTicket(req);
      if (data.success) {
        res.status(201).json(data);
      } else {
        this.error('create tour gorups controller');
      }
    }
  );
  public deleteTourTicket = this.assyncWrapper.wrap(
    this.validator.deleteData,
    async (req: Request, res: Response) => {
      const data = await this.services.deleteTourTicket(req);
      if (data.success) {
        res.status(201).json(data);
      } else {
        this.error('create tour gorups controller');
      }
    }
  );

  // ==================== ACCOMMODATIAON
  public createTourAccmmdtoins = this.assyncWrapper.wrap(
    this.validator.createAccommodation,
    async (req: Request, res: Response) => {
      const data = await this.services.createTourAccmmdtoins(req);
      if (data.success) {
        res.status(201).json(data);
      } else {
        this.error('create tour gorups controller');
      }
    }
  );
  public updateTourAccmmdtoins = this.assyncWrapper.wrap(
    this.validator.updateAccommodation,
    async (req: Request, res: Response) => {
      const data = await this.services.updateTourAccmmdtoins(req);
      if (data.success) {
        res.status(201).json(data);
      } else {
        this.error('create tour gorups controller');
      }
    }
  );

  public viewAccommodatioiins = this.assyncWrapper.wrap(
    this.validator.readData,
    async (req: Request, res: Response) => {
      const data = await this.services.viewAccommodatioiins(req);
      if (data.success) {
        res.status(201).json(data);
      } else {
        this.error('create tour gorups controller');
      }
    }
  );
  public getAllAccommodation = this.assyncWrapper.wrap(
    this.validator.readData,
    async (req: Request, res: Response) => {
      const data = await this.services.getAllAccommodation(req);
      if (data.success) {
        res.status(201).json(data);
      } else {
        this.error('create tour gorups controller');
      }
    }
  );

  public getAllCountries = this.assyncWrapper.wrap(
    this.validator.readData,
    async (req: Request, res: Response) => {
      const data = await this.services.getAllCountries(req);
      if (data.success) {
        res.status(201).json(data);
      } else {
        this.error('create tour gorups controller');
      }
    }
  );
  public getAllCityByCountries = this.assyncWrapper.wrap(
    this.validator.readData,
    async (req: Request, res: Response) => {
      const data = await this.services.getAllCityByCountries(req);
      if (data.success) {
        res.status(201).json(data);
      } else {
        this.error('create tour gorups controller');
      }
    }
  );
  public deleteTourAccmmdtoins = this.assyncWrapper.wrap(
    this.validator.deleteData,
    async (req: Request, res: Response) => {
      const data = await this.services.deleteTourAccmmdtoins(req);
      if (data.success) {
        res.status(201).json(data);
      } else {
        this.error('create tour gorups controller');
      }
    }
  );
  // ============ PLACES ===================
  public insertPlaces = this.assyncWrapper.wrap(
    this.validator.createPlaces,
    async (req: Request, res: Response) => {
      const data = await this.services.insertPlaces(req);
      if (data.success) {
        res.status(201).json(data);
      } else {
        this.error('create tour gorups controller');
      }
    }
  );
  public updatePlaces = this.assyncWrapper.wrap(
    this.validator.updatePlaces,
    async (req: Request, res: Response) => {
      const data = await this.services.updatePlaces(req);
      if (data.success) {
        res.status(201).json(data);
      } else {
        this.error('create tour gorups controller');
      }
    }
  );
  public deletePlaces = this.assyncWrapper.wrap(
    this.validator.deleteData,
    async (req: Request, res: Response) => {
      const data = await this.services.deletePlaces(req);
      if (data.success) {
        res.status(201).json(data);
      } else {
        this.error('create tour gorups controller');
      }
    }
  );
  public viewToursPlaces = this.assyncWrapper.wrap(
    this.validator.readData,
    async (req: Request, res: Response) => {
      const data = await this.services.viewToursPlaces(req);
      if (data.success) {
        res.status(201).json(data);
      } else {
        this.error('create tour gorups controller');
      }
    }
  );
  public getAllPlaces = this.assyncWrapper.wrap(
    this.validator.readData,
    async (req: Request, res: Response) => {
      const data = await this.services.getAllPlaces(req);
      if (data.success) {
        res.status(201).json(data);
      } else {
        this.error('create tour gorups controller');
      }
    }
  );
}

export default TourItinerayControllers;
