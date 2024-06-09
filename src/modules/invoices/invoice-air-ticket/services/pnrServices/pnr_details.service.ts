import axios from 'axios';
import { Request } from 'express';
import AbstractServices from '../../../../../abstracts/abstract.services';
import CustomError from '../../../../../common/utils/errors/customError';
import { numRound } from '../../../../../common/utils/libraries/lib';
import {
  capitalize,
  extractPaxStr,
  formatFlightDetailsRoute,
} from '../../../../../common/utils/libraries/pnr_lib';
import { IPnrResponse } from '../../types/pnr_invoice.interfaces';

class PnrDetailsService extends AbstractServices {
  constructor() {
    super();
  }

  pnrDetails = async (req: Request, pnrNo?: string) => {
    return await this.models.db.transaction(async (trx) => {
      const pnr = req.params.pnr || (pnrNo as string);

      if (pnr && pnr.trim().length !== 6) {
        throw new CustomError('Invalid pnr no.', 404, 'RESOURCE_NOT_FOUND');
      }

      const conn = this.models.PnrDetailsModels(req, trx);

      const ota_info = await conn.getOtaInfo(req.agency_id);

      if (!ota_info.ota_api_url && !ota_info.ota_token) {
        return { success: true, message: 'Empty token and base url' };
      }

      const api_url = ota_info.ota_api_url + '/' + pnr;

      // const api_url =
      //   'http://192.168.0.158:9008/api/v1/public/get-booking' + '/' + pnr;

      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ota_info.ota_token}`,
      };

      try {
        const response = await axios.get(api_url, { headers });
        const pnrResponse = response.data.data as IPnrResponse;

        if (
          response.data.success &&
          pnrResponse?.flights &&
          pnrResponse?.fares
        ) {
          const creationDetails = pnrResponse?.creationDetails;

          const iata_vendor = await conn.getIataVendorId();

          const invoice_sales_man_id = await conn.getEmployeeByCreationSign(
            creationDetails?.creationUserSine
          );

          const ticket_details: any[] = [];
          // TICKET DETAILS
          for (const [index, ticket] of pnrResponse.flightTickets.entries()) {
            const flightsId = ticket.flightCoupons?.map((item) => item.itemId);

            if (!flightsId) {
              throw new CustomError(
                'The ticket has already been refunded or reissued.',
                400,
                'Invalid PNR'
              );
            }

            // TRAVELERS
            const traveler =
              pnrResponse.travelers[Number(ticket.travelerIndex) - 1];

            const mobile_no = pnrResponse?.specialServices.find(
              (item) =>
                item.code === 'CTCM' &&
                item.travelerIndices?.includes(ticket.travelerIndex)
            );

            const email = pnrResponse?.specialServices.find(
              (item) =>
                item.code === 'CTCE' &&
                item.travelerIndices?.includes(ticket.travelerIndex)
            );

            const pax_passports = {
              passport_no: traveler?.identityDocuments
                ? traveler?.identityDocuments[0]?.documentNumber
                : undefined,
              passport_name: traveler.givenName + ' ' + traveler.surname,
              passport_person_type: capitalize(traveler?.type),
              passport_mobile_no: traveler?.phones
                ? traveler?.phones[0].number
                : extractPaxStr(mobile_no?.message),

              passport_email: traveler?.emails
                ? traveler?.emails[0]
                : extractPaxStr(email?.message),
              identityDocuments: traveler?.identityDocuments
                ? traveler?.identityDocuments[0]
                : undefined,
            };

            // FLIGHT DETAILS
            const flights = pnrResponse.flights.filter((item) =>
              flightsId?.includes(item.itemId)
            );

            const { flight_details, airticket_route_or_sector, route_sectors } =
              await formatFlightDetailsRoute(flights, conn);

            const taxBreakdown =
              pnrResponse.fares?.find((item) => {
                return (
                  item?.travelerIndices &&
                  item?.travelerIndices.includes(ticket.travelerIndex)
                );
              }) ||
              pnrResponse?.fares?.find(
                (item) => item.airlineCode === flights[0].airlineCode
              );

            const breakdown = taxBreakdown?.taxBreakdown.reduce(
              (acc: any, current) => {
                acc[current.taxCode] = Number(current.taxAmount.amount);
                return acc;
              },
              {}
            );

            let totalCountryTax = 0;

            for (const taxType in breakdown) {
              if (['BD', 'UT', 'E5']?.includes(taxType)) {
                totalCountryTax += breakdown[taxType];
              }
            }

            // TAXES COMMISSION
            let taxesCommission;
            if (['TK', 'CZ'].includes(flights[0].airlineCode)) {
              taxesCommission = taxBreakdown?.taxBreakdown?.filter(
                (item) => item.taxCode === 'YQ'
              );
            } else if (['MH', 'AI'].includes(flights[0].airlineCode)) {
              taxesCommission = taxBreakdown?.taxBreakdown?.filter(
                (item) => item.taxCode === 'YR'
              );
            }

            const baseFareCommission = numRound(
              ticket?.commission?.commissionAmount
            );
            const countryTaxAit = Number(1 || 0) * 0.003;
            const grossAit = Number(ticket.payment.total || 0) * 0.003;
            const airticket_ait = Math.round(grossAit - countryTaxAit);
            const airticket_net_commssion = baseFareCommission - airticket_ait;

            const airticket_purchase_price =
              Number(ticket.payment.total || 0) - airticket_net_commssion;

            const airticket_segment = pnrResponse.allSegments.length;

            const airticket_commission_percent = numRound(
              (numRound(baseFareCommission) /
                numRound(ticket.payment.subtotal)) *
                100
            );

            const owningAirline = await conn.airlineIdByCode(
              flights[0].airlineCode
            );

            const airticket_return_date =
              airticket_segment > 1
                ? pnrResponse.allSegments[airticket_segment - 1].endDate
                : undefined;

            const taxes_commission = taxesCommission?.map((item) => {
              return {
                airline_taxes: item.taxAmount.amount,
                airline_commission:
                  numRound(item.taxAmount.amount) *
                  (airticket_commission_percent / 100),
                airline_tax_type: item.taxCode,
              };
            });

            const ticketData = {
              ...breakdown,
              airticket_ticket_no: ticket.number,
              airticket_gross_fare: ticket.payment.total,
              airticket_base_fare: ticket.payment.subtotal,
              airticket_comvendor: iata_vendor,
              airticket_commission_percent,
              airticket_commission_percent_total: baseFareCommission,
              airticket_ait,
              airticket_net_commssion,
              airticket_airline_id: owningAirline,
              airticket_route_or_sector,
              airticket_pnr: pnrResponse.bookingId,
              airticket_gds_id: 'Sabre',
              airticket_tax: ticket.payment.taxes,
              airticket_segment,
              airticket_issue_date: ticket.date,
              airticket_journey_date: pnrResponse.startDate,
              airticket_return_date,
              airticket_classes: flights[0].cabinTypeName,

              airticket_client_price: ticket.payment.total,
              airticket_purchase_price,
              airticket_profit: airticket_net_commssion,

              flight_details,
              pax_passports: [pax_passports],
              taxes_commission,

              route_sectors,
            };

            ticket_details.push(ticketData);
          }

          return {
            success: true,
            data: {
              ticket_details,
              invoice_sales_date: pnrResponse.flightTickets[0].date,
              invoice_sales_man_id,
              creation_sign: creationDetails?.creationUserSine,
            },
          };
        }
        return { success: true, data: [] };
      } catch (error: any) {
        throw new CustomError(
          error.message || 'Booking cannot be found',
          404,
          error.type + '. pnr_details.service'
        );
      }
    });
  };
}

export default PnrDetailsService;
