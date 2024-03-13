"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_controllers_1 = __importDefault(require("../../../../abstracts/abstract.controllers"));
const TourItineray_services_1 = __importDefault(require("./TourItineray.services"));
const TourItineray_validators_1 = __importDefault(require("./TourItineray.validators"));
class TourItinerayControllers extends abstract_controllers_1.default {
    constructor() {
        super();
        this.services = new TourItineray_services_1.default();
        this.validator = new TourItineray_validators_1.default();
        this.createTourGroups = this.assyncWrapper.wrap(this.validator.createTourGroups, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.createTourGroups(req);
            if (data.success) {
                res.status(201).json(data);
            }
            else {
                this.error('create tour gorups controller');
            }
        }));
        this.updateTourGroups = this.assyncWrapper.wrap(this.validator.updateTourGroups, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.updateTourGroups(req);
            if (data.success) {
                res.status(201).json(data);
            }
            else {
                this.error('create tour gorups controller');
            }
        }));
        this.deleteTourGroups = this.assyncWrapper.wrap(this.validator.deleteData, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.deleteTourGroups(req);
            if (data.success) {
                res.status(201).json(data);
            }
            else {
                this.error('create tour gorups controller');
            }
        }));
        this.viewTourGroups = this.assyncWrapper.wrap(this.validator.readData, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.viewTourGroups(req);
            if (data.success) {
                res.status(201).json(data);
            }
            else {
                this.error('create tour gorups controller');
            }
        }));
        this.getAllTourGroups = this.assyncWrapper.wrap(this.validator.readData, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getAllTourGroups(req);
            if (data.success) {
                res.status(201).json(data);
            }
            else {
                this.error('create tour gorups controller');
            }
        }));
        this.getByIdTourGorup = this.assyncWrapper.wrap(this.validator.readData, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getTourGroupById(req);
            if (data.success) {
                res.status(201).json(data);
            }
            else {
                this.error('create tour gorups controller');
            }
        }));
        this.getTourVendorsInfo = this.assyncWrapper.wrap(this.validator.readData, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getTourVendorsInfo(req);
            if (data.success) {
                res.status(201).json(data);
            }
            else {
                this.error('create tour gorups controller');
            }
        }));
        this.getTourVendorByAccmId = this.assyncWrapper.wrap(this.validator.readData, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getTourVendorByAccmId(req);
            if (data.success) {
                res.status(201).json(data);
            }
            else {
                this.error('create tour gorups controller');
            }
        }));
        // ======================= CITIES ==============================
        this.createTourCities = this.assyncWrapper.wrap(this.validator.createTourCities, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.createCities(req);
            if (data.success) {
                res.status(201).json(data);
            }
            else {
                this.error('create tour gorups controller');
            }
        }));
        this.updateTourCity = this.assyncWrapper.wrap(this.validator.updateTourCities, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.updateCities(req);
            if (data.success) {
                res.status(201).json(data);
            }
            else {
                this.error('create tour gorups controller');
            }
        }));
        this.deleteTourCity = this.assyncWrapper.wrap(this.validator.deleteData, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.deleteCities(req);
            if (data.success) {
                res.status(201).json(data);
            }
            else {
                this.error('create tour gorups controller');
            }
        }));
        this.viewToursCities = this.assyncWrapper.wrap(this.validator.readData, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.viewToursCities(req);
            if (data.success) {
                res.status(201).json(data);
            }
            else {
                this.error('create tour gorups controller');
            }
        }));
        this.getAllCitites = this.assyncWrapper.wrap(this.validator.readData, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getAllCitites(req);
            if (data.success) {
                res.status(201).json(data);
            }
            else {
                this.error('create tour gorups controller');
            }
        }));
        this.getByIdCity = this.assyncWrapper.wrap(this.validator.readData, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getByIdCity(req);
            if (data.success) {
                res.status(201).json(data);
            }
            else {
                this.error('create tour gorups controller');
            }
        }));
        // ============ TICKETS =================
        this.createTourTicket = this.assyncWrapper.wrap(this.validator.creteTourTickets, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.createTourTicket(req);
            if (data.success) {
                res.status(201).json(data);
            }
            else {
                this.error('create tour gorups controller');
            }
        }));
        this.updateTourTicket = this.assyncWrapper.wrap(this.validator.updateTourTickets, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.updateTourTicket(req);
            if (data.success) {
                res.status(201).json(data);
            }
            else {
                this.error('create tour gorups controller');
            }
        }));
        this.viewToursItineraries = this.assyncWrapper.wrap(this.validator.readData, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.viewToursItineraries(req);
            if (data.success) {
                res.status(201).json(data);
            }
            else {
                this.error('create tour gorups controller');
            }
        }));
        this.getAllTourTicket = this.assyncWrapper.wrap(this.validator.readData, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getAllTourTicket(req);
            if (data.success) {
                res.status(201).json(data);
            }
            else {
                this.error('create tour gorups controller');
            }
        }));
        this.deleteTourTicket = this.assyncWrapper.wrap(this.validator.deleteData, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.deleteTourTicket(req);
            if (data.success) {
                res.status(201).json(data);
            }
            else {
                this.error('create tour gorups controller');
            }
        }));
        // ==================== ACCOMMODATIAON
        this.createTourAccmmdtoins = this.assyncWrapper.wrap(this.validator.createAccommodation, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.createTourAccmmdtoins(req);
            if (data.success) {
                res.status(201).json(data);
            }
            else {
                this.error('create tour gorups controller');
            }
        }));
        this.updateTourAccmmdtoins = this.assyncWrapper.wrap(this.validator.updateAccommodation, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.updateTourAccmmdtoins(req);
            if (data.success) {
                res.status(201).json(data);
            }
            else {
                this.error('create tour gorups controller');
            }
        }));
        this.viewAccommodatioiins = this.assyncWrapper.wrap(this.validator.readData, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.viewAccommodatioiins(req);
            if (data.success) {
                res.status(201).json(data);
            }
            else {
                this.error('create tour gorups controller');
            }
        }));
        this.getAllAccommodation = this.assyncWrapper.wrap(this.validator.readData, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getAllAccommodation(req);
            if (data.success) {
                res.status(201).json(data);
            }
            else {
                this.error('create tour gorups controller');
            }
        }));
        this.getAllCountries = this.assyncWrapper.wrap(this.validator.readData, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getAllCountries(req);
            if (data.success) {
                res.status(201).json(data);
            }
            else {
                this.error('create tour gorups controller');
            }
        }));
        this.getAllCityByCountries = this.assyncWrapper.wrap(this.validator.readData, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getAllCityByCountries(req);
            if (data.success) {
                res.status(201).json(data);
            }
            else {
                this.error('create tour gorups controller');
            }
        }));
        this.deleteTourAccmmdtoins = this.assyncWrapper.wrap(this.validator.deleteData, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.deleteTourAccmmdtoins(req);
            if (data.success) {
                res.status(201).json(data);
            }
            else {
                this.error('create tour gorups controller');
            }
        }));
        // ============ PLACES ===================
        this.insertPlaces = this.assyncWrapper.wrap(this.validator.createPlaces, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.insertPlaces(req);
            if (data.success) {
                res.status(201).json(data);
            }
            else {
                this.error('create tour gorups controller');
            }
        }));
        this.updatePlaces = this.assyncWrapper.wrap(this.validator.updatePlaces, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.updatePlaces(req);
            if (data.success) {
                res.status(201).json(data);
            }
            else {
                this.error('create tour gorups controller');
            }
        }));
        this.deletePlaces = this.assyncWrapper.wrap(this.validator.deleteData, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.deletePlaces(req);
            if (data.success) {
                res.status(201).json(data);
            }
            else {
                this.error('create tour gorups controller');
            }
        }));
        this.viewToursPlaces = this.assyncWrapper.wrap(this.validator.readData, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.viewToursPlaces(req);
            if (data.success) {
                res.status(201).json(data);
            }
            else {
                this.error('create tour gorups controller');
            }
        }));
        this.getAllPlaces = this.assyncWrapper.wrap(this.validator.readData, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getAllPlaces(req);
            if (data.success) {
                res.status(201).json(data);
            }
            else {
                this.error('create tour gorups controller');
            }
        }));
    }
}
exports.default = TourItinerayControllers;
//# sourceMappingURL=TourItineray.controllers.js.map