import axios from 'axios';
import { Request } from 'express';
import AbstractServices from '../../../../../abstracts/abstract.services';
import CustomError from '../../../../../common/utils/errors/customError';
import { numRound } from '../../../../../common/utils/libraries/lib';
import {
  capitalize,
  extractPaxStr,
  formatFlightDetailsRoute,
  formatTicketDetails,
} from '../../../../../common/utils/libraries/pnr_lib';
import { staticPnrData } from '../../demo/data';

class PnrDetailsService extends AbstractServices {
  constructor() {
    super();
  }

  // GET PNR DETAILS
  pnrDetails = async (req: Request, pnrNo?: string) => {
    return await this.models.db.transaction(async (trx) => {
      const pnr = req.params.pnr || (pnrNo as string);

      if (pnr.trim().length !== 6) {
        throw new CustomError('Invalid pnr no.', 404, 'RESOURCE_NOT_FOUND');
      }

      const conn = this.models.PnrDetailsModels(req, trx);

      const ota_info = await conn.getOtaInfo(req.agency_id);

      // const api_url = ota_info.ota_api_url + '/' + pnr;
      const api_url =
        'http://192.168.0.158:9008/api/v1/public/get-booking' + '/' + pnr;

      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ota_info.ota_token}`,
      };

      try {
        const response = await axios.get(api_url, { headers });

        const pnrResponse = response.data.data;

        if (
          response.data.success &&
          pnrResponse?.flights &&
          pnrResponse?.fares
        ) {
          const creationDetails = pnrResponse?.creationDetails;

          const invoice_sales_man_id = await conn.getEmployeeByCreationSign(
            creationDetails?.creationUserSine
          );

          const pax_passports = pnrResponse?.travelers?.map((traveler: any) => {
            const mobile_no = pnrResponse?.specialServices.find(
              (item: any) =>
                item.code === 'CTCM' &&
                item.travelerIndices.includes(
                  numRound(traveler.nameAssociationId)
                )
            );

            const email = pnrResponse?.specialServices.find(
              (item: any) =>
                item.code === 'CTCE' &&
                item.travelerIndices.includes(
                  numRound(traveler.nameAssociationId)
                )
            );

            return {
              passport_no: traveler?.identityDocuments[0]?.documentNumber,
              passport_name: traveler.givenName + ' ' + traveler.surname,
              passport_person_type: capitalize(traveler?.type),
              passport_mobile_no: traveler?.phones
                ? traveler?.phones[0].number
                : extractPaxStr(mobile_no?.message),

              passport_email: traveler?.emails
                ? traveler?.emails[0]
                : extractPaxStr(email?.message),
            };
          });

          const flightRoute = await formatFlightDetailsRoute(
            pnrResponse?.flights,
            conn
          );

          const ticket_details = await formatTicketDetails(
            conn,
            pnrResponse,
            flightRoute.route_or_sector
          );

          const data = {
            ...flightRoute,
            pax_passports,
            ticket_details,
            invoice_sales_date: creationDetails?.creationDate,
            invoice_sales_man_id,
            creation_sign: creationDetails?.creationUserSine,
          };
          return { success: true, data };
        }
        return { success: true, data: [] };
      } catch (error: any) {
        throw new CustomError(
          'Booking cannot be found',
          404,
          'BOOKING_NOT_FOUND'
        );
      }
    });
  };

  // TEST ========================
  testPnrDetails = async (req: Request, pnrNo?: string) => {
    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.PnrDetailsModels(req, trx);

      try {
        const pnrResponse = staticPnrData;

        if (pnrResponse?.flights && pnrResponse?.fares) {
          const creationDetails = pnrResponse?.creationDetails;

          const invoice_sales_man_id = await conn.getEmployeeByCreationSign(
            creationDetails?.creationUserSine
          );

          const airticket_classes = pnrResponse.flights[0].cabinTypeName;
          const cabin_type = pnrResponse.flights[0].cabinTypeCode;
          const owningAirline = await conn.airlineIdByCode(
            pnrResponse.fareRules[0].owningAirlineCode
          );

          const ticket_details = pnrResponse.flightTickets.map((ticket) => {
            const taxBreakdown = pnrResponse.fares.find((item) =>
              item.travelerIndices.includes(ticket.travelerIndex)
            );

            console.log(taxBreakdown);

            const baseFareCommission = Number(
              ticket.commission.commissionAmount
            );
            const countryTaxAit = Number(1 || 0) * 0.003;
            const grossAit = Number(ticket.payment.total || 0) * 0.003;
            const airticket_ait = Math.round(grossAit - countryTaxAit);
            const airticket_net_commssion = baseFareCommission - airticket_ait;

            const airticket_purchase_price =
              Number(ticket.payment.total || 0) - airticket_net_commssion;

            const ticketData = {
              airticket_comvendor: 'iata_vendor', // -----------
              airticket_gds_id: 'Sabre',
              airticket_ticket_no: ticket.number,
              airticket_issue_date: ticket.date,
              airticket_base_fare: ticket.payment.subtotal,
              airticket_gross_fare: ticket.payment.total,
              airticket_classes,
              cabin_type,
              airticket_tax: ticket.payment.taxes,
              currency: ticket.payment.currencyCode,
              airticket_segment: pnrResponse.allSegments.length,
              airticket_journey_date: pnrResponse.startDate,
              airticket_commission_percent_total: numRound(baseFareCommission),
              // airticket_route_or_sector: route_or_sector,
              airticket_airline_id: owningAirline,
              airticket_ait,
              airticket_client_price: ticket.payment.total,
              airticket_purchase_price,
              airticket_net_commssion,
              airticket_profit: airticket_net_commssion,
              airticket_commission_percent: numRound(
                (numRound(baseFareCommission) /
                  numRound(ticket.payment.subtotal)) *
                  100
              ),
              // ...taxesBreakdown[index],
            };
          });

          const pax_passports = pnrResponse?.travelers?.map((traveler: any) => {
            const mobile_no = pnrResponse?.specialServices.find(
              (item: any) =>
                item.code === 'CTCM' &&
                item.travelerIndices.includes(
                  numRound(traveler.nameAssociationId)
                )
            );

            const email = pnrResponse?.specialServices.find(
              (item: any) =>
                item.code === 'CTCE' &&
                item.travelerIndices.includes(
                  numRound(traveler.nameAssociationId)
                )
            );

            return {
              passport_no: traveler?.identityDocuments[0]?.documentNumber,
              passport_name: traveler.givenName + ' ' + traveler.surname,
              passport_person_type: capitalize(traveler?.type),
              passport_mobile_no: traveler?.phones
                ? traveler?.phones[0].number
                : extractPaxStr(mobile_no?.message as string),

              passport_email: traveler?.emails
                ? traveler?.emails[0]
                : extractPaxStr(email?.message as string),
            };
          });

          const flightRoute = await formatFlightDetailsRoute(
            pnrResponse?.flights,
            conn
          );

          const ticket_details12 = await formatTicketDetails(
            conn,
            pnrResponse,
            flightRoute.route_or_sector
          );

          const data = {
            ...flightRoute,
            pax_passports,
            ticket_details,
            invoice_sales_date: creationDetails?.creationDate,
            invoice_sales_man_id,
            creation_sign: creationDetails?.creationUserSine,
          };
          return { success: true, data };
        }
        return { success: true, data: [] };
      } catch (error: any) {
        throw new CustomError('Booking cannot be found', 404, error.message);
      }
    });
  };
}

export default PnrDetailsService;
