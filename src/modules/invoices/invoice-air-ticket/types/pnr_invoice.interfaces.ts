import { ITaxesCommission } from './invoiceAirticket.interface';

export interface IPnrInvoiceBody {
  invoice_combclient_id: string;
  invoice_walking_customer_name: string;
  // invoice_vat: number;
  invoice_service_charge: number;
  invoice_discount: number;
  invoice_pnr: string;
}

export interface IPnrDetails {
  ticket_details: TicketDetail[];

  invoice_sales_date: string;
  invoice_sales_man_id: number;
  creation_sign: string;
}

export interface PaxPassport {
  passport_name: string;
  passport_person_type: string;
  passport_mobile_no: any;
  passport_email: any;
  identityDocuments: IidentityDocuments;
}

export interface IidentityDocuments {
  documentNumber: string;
  documentType: string;
  expiryDate: string;
  issuingCountryCode: string;
  residenceCountryCode: string;
  givenName: string;
  surname: string;
  birthDate: string;
  gender: string;
  isPrimaryDocumentHolder: boolean;
  itemId: string;
}

export interface TicketDetail {
  airticket_comvendor: string;
  airticket_gds_id: string;
  airticket_ticket_no: string;
  airticket_issue_date: string;
  airticket_base_fare: number;
  airticket_gross_fare: number;
  airticket_classes: string;
  cabin_type: string;
  airticket_tax: number;
  currency: string;
  airticket_segment: number;
  airticket_journey_date: string;
  airticket_commission_percent_total: number;
  airticket_commission_percent: number;
  airticket_route_or_sector: number[];
  route_sectors: string[];
  airticket_airline_id: number;
  airticket_ait: number;
  airticket_client_price: number;
  airticket_purchase_price: number;
  airticket_net_commssion: number;
  airticket_profit: number;
  BD: number;
  UT: number;
  OW: number;
  E5: number;
  AU: number;
  WG: number;
  WY: number;
  YQ: number;
  P8: number;
  P7: number;

  pax_passports: PaxPassport[];
  flight_details: FlightDetail[];
  taxes_commission: ITaxesCommission[];
  total_taxes_commission: number;
}

export interface FlightDetail {
  fltdetails_from_airport_id: number;
  fltdetails_to_airport_id: number;
  fltdetails_flight_no: number;
  fltdetails_fly_date: string;
  fltdetails_departure_time: string;
  fltdetails_arrival_time: string;
  fltdetails_airline_id: number;
}

export interface ITaxBreakdown {
  taxCode: string;
  taxAmount: {
    amount: string;
    currencyCode: string;
  };
}

// =======================
export interface IPnrResponse {
  bookingId: string;
  startDate: string;
  endDate: string;
  isTicketed: boolean;
  creationDetails: CreationDetails;
  contactInfo: ContactInfo;
  travelers: Traveler[];
  flights: Flight[];
  journeys: Journey[];
  fareRules: FareRule[];
  fareOffers: FareOffer[];
  fares: Fare[];
  remarks: Remark[];
  allSegments: AllSegment[];
  flightTickets: FlightTicket[];
  payments: Payments;
  otherServices: OtherService[];
  specialServices: SpecialService[];
  accountingItems: AccountingItem[];
  timestamp: string;
  bookingSignature: string;
  request: Request;
}

export interface CreationDetails {
  creationUserSine: string;
  creationDate: string;
  creationTime: string;
  userWorkPcc: string;
  userHomePcc: string;
  primeHostId: string;
}

export interface ContactInfo {
  emails: string[];
  phones: string[];
}

export interface Traveler {
  givenName: string;
  surname: string;
  type: string;
  passengerCode: string;
  nameAssociationId: string;
  identityDocuments: IdentityDocument[];
  phones?: { number: string }[];
  emails?: string[];
}

export interface IdentityDocument {
  documentNumber: string;
  documentType: string;
  expiryDate: string;
  issuingCountryCode: string;
  residenceCountryCode: string;
  givenName: string;
  surname: string;
  birthDate: string;
  gender: string;
  isPrimaryDocumentHolder: boolean;
  itemId: string;
}

export interface Flight {
  itemId: string;
  confirmationId: string;
  sourceType: string;
  flightNumber: number;
  airlineCode: string;
  airlineName: string;
  operatingFlightNumber: number;
  operatingAirlineCode: string;
  operatingAirlineName: string;
  fromAirportCode: string;
  toAirportCode: string;
  departureDate: string;
  departureTime: string;
  departureTerminalName?: string;
  departureGate?: string;
  arrivalDate: string;
  arrivalTime: string;
  arrivalTerminalName: string;
  arrivalGate: string;
  seats: Seat[];
  numberOfSeats: number;
  cabinTypeName: string;
  cabinTypeCode: string;
  aircraftTypeCode: string;
  aircraftTypeName: string;
  bookingClass: string;
  flightStatusCode: string;
  flightStatusName: string;
  durationInMinutes: number;
  distanceInMiles: number;
  travelerIndices: number[];
  identityDocuments: IdentityDocument2[];
}

export interface Seat {
  number: string;
  characteristics: string[];
  statusCode: string;
  statusName: string;
}

export interface IdentityDocument2 {
  itemId: string;
  status: string;
}

export interface Journey {
  firstAirportCode: string;
  departureDate: string;
  departureTime: string;
  lastAirportCode: string;
  numberOfFlights: number;
}

export interface FareRule {
  originAirportCode: string;
  destinationAirportCode: string;
  owningAirlineCode: string;
  passengerCode: string;
  isRefundable: boolean;
  refundPenalties: RefundPenalty[];
  isChangeable: boolean;
  exchangePenalties: ExchangePenalty[];
}

export interface RefundPenalty {
  applicability: string;
  conditionsApply: boolean;
  penalty: Penalty;
}

export interface Penalty {
  amount: string;
  currencyCode: string;
}

export interface ExchangePenalty {
  applicability: string;
  conditionsApply: boolean;
  penalty: Penalty2;
}

export interface Penalty2 {
  amount: string;
  currencyCode: string;
}

export interface FareOffer {
  travelerIndices: number[];
  flights: Flight2[];
  cabinBaggageAllowance: CabinBaggageAllowance;
  checkedBaggageAllowance: CheckedBaggageAllowance;
  checkedBaggageCharges: CheckedBaggageCharge[];
}

export interface Flight2 {
  itemId: string;
}

export interface CabinBaggageAllowance {
  maximumPieces: number;
  totalWeightInKilograms: number;
}

export interface CheckedBaggageAllowance {
  maximumPieces: number;
  baggagePieces: BaggagePiece[];
}

export interface BaggagePiece {
  maximumSizeInInches: number;
  maximumSizeInCentimeters: number;
  maximumWeightInPounds: number;
  maximumWeightInKilograms: number;
  numberOfPieces: number;
}

export interface CheckedBaggageCharge {
  maximumSizeInInches?: number;
  maximumSizeInCentimeters?: number;
  numberOfPieces: number;
  fee: Fee;
  maximumWeightInPounds?: number;
  maximumWeightInKilograms?: number;
  specialItemDescription?: string;
}

export interface Fee {
  amount: string;
  currencyCode: string;
}

export interface Fare {
  creationDetails: CreationDetails2;
  airlineCode: string;
  fareCalculationLine: string;
  isNegotiatedFare: boolean;
  fareConstruction: FareConstruction[];
  taxBreakdown: TaxBreakdown[];
  totals: Totals;
  pricingTypeCode: string;
  pricingTypeName: string;
  pricingStatusCode: string;
  pricingStatusName: string;
  hasValidPricing: boolean;
  requestedTravelerType: string;
  pricedTravelerType: string;
  recordTypeCode: string;
  recordTypeName: string;
  recordId: string;
  travelerIndices: number[];
}

export interface CreationDetails2 {
  creationUserSine: string;
  creationDate: string;
  creationTime: string;
  purchaseDeadlineDate: string;
  purchaseDeadlineTime: string;
  userWorkPcc: string;
  userHomePcc: string;
}

export interface FareConstruction {
  flights: Flight3[];
  flightIndices: number[];
  fareBasisCode: string;
  baseRate: BaseRate;
  isCurrentItinerary: boolean;
  checkedBaggageAllowance: CheckedBaggageAllowance2;
}

export interface Flight3 {
  itemId: string;
}

export interface BaseRate {
  amount: string;
  currencyCode: string;
}

export interface CheckedBaggageAllowance2 {
  maximumPieces: number;
}

export interface TaxBreakdown {
  taxCode: string;
  taxAmount: TaxAmount;
}

export interface TaxAmount {
  amount: string;
  currencyCode: string;
}

export interface Totals {
  subtotal: string;
  taxes: string;
  total: string;
  currencyCode: string;
}

export interface Remark {
  type: string;
  text: string;
}

export interface AllSegment {
  id: string;
  type: string;
  text?: string;
  vendorCode?: string;
  startDate?: string;
  startTime?: string;
  startLocationCode?: string;
  endDate?: string;
  endTime?: string;
  endLocationCode?: string;
}

export interface FlightTicket {
  number: string;
  date: string;
  agencyIataNumber: string;
  travelerIndex: number;
  flightCoupons: FlightCoupon[];
  payment: Payment;
  ticketStatusName: string;
  ticketStatusCode: string;
  ticketingPcc: string;
  commission: Commission;
}

export interface FlightCoupon {
  itemId: string;
  couponStatus: string;
  couponStatusCode: string;
}

export interface Payment {
  subtotal: string;
  taxes: string;
  total: string;
  currencyCode: string;
}

export interface Commission {
  commissionAmount: string;
  currencyCode: string;
  commissionPercentage: string;
}

export interface Payments {
  flightTotals: FlightTotal[];
  flightCurrentTotals: FlightCurrentTotal[];
}

export interface FlightTotal {
  subtotal: string;
  taxes: string;
  total: string;
  currencyCode: string;
}

export interface FlightCurrentTotal {
  subtotal: string;
  taxes: string;
  total: string;
  currencyCode: string;
}

export interface OtherService {
  airlineCode: string;
  serviceMessage: string;
}

export interface SpecialService {
  code: string;
  message?: string;
  travelerIndices?: number[];
  name?: string;
  statusCode?: string;
  statusName?: string;
  flights?: Flight4[];
}

export interface Flight4 {
  itemId: string;
}

export interface AccountingItem {
  fareApplicationType: string;
  formOfPaymentType: string;
  airlineCode: string;
  ticketNumber: string;
  commission: Commission2;
  fareAmount: string;
  taxAmount: string;
  travelerIndices: number[];
  tariffBasisType: string;
}

export interface Commission2 {
  commissionAmount: string;
}

export interface Request {
  confirmationId: string;
}
