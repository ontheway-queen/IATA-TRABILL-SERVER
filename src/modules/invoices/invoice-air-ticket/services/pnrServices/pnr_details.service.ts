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

class PnrDetailsService extends AbstractServices {
  constructor() {
    super();
  }

  // GET PNR DETAILS
  pnrDetails = async (req: Request, pnrNo?: string) => {
    return await this.models.db.transaction(async (trx) => {
      const pnr = req.params.pnr || (pnrNo as string);

      if (pnr.trim().length !== 6) {
        throw new CustomError('RESOURCE_NOT_FOUND', 404, 'Invalid pnr no.');
      }

      const conn = this.models.PnrDetailsModels(req, trx);

      const ota_info = await conn.getOtaInfo(req.agency_id);

      const api_url = ota_info.ota_api_url + '/' + pnr;

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
          'BOOKING_NOT_FOUND',
          404,
          'Booking cannot be found'
        );
      }
    });
  };
}

export default PnrDetailsService;
