import { Request } from 'express';
import { Knex } from 'knex';

import {
  IHajiPilgrimsDB,
  IInvoiceHajjReq,
} from '../../Type/InvoiceHajj.Interfaces';
import AbstractServices from '../../../../../abstracts/abstract.services';
import Trxns from '../../../../../common/helpers/Trxns';
import {
  generateVoucherNumber,
  isNotEmpty,
} from '../../../../../common/helpers/invoice.helpers';
import {
  IHotelInfoDB,
  ITransportInfoDB,
} from '../../../../../common/types/Invoice.common.interface';
import { IVTrxn } from '../../../../../common/interfaces/Trxn.interfaces';
import { separateCombClientToId } from '../../../../../common/helpers/common.helper';
import { IOtherBillingInfoDb } from '../../../invoice_other/types/invoiceOther.interface';

class CommonHajjDetailsInsert extends AbstractServices {
  constructor() {
    super();
  }

  public CommonHajjDetailsInsert = async (
    req: Request,
    invoice_id: number,
    trx: Knex.Transaction<any, any[]>
  ) => {
    const {
      invoice_created_by,
      billing_information,
      hotel_information,
      pilgrims_information,
      transport_info,
      invoice_sales_date,
      invoice_no,
    } = req.body as IInvoiceHajjReq;

    return await this.models.db.transaction(async () => {
      const common_conn = this.models.CommonInvoiceModel(req, trx);
      const conn = this.models.InvoiceHajjModels(req, trx);
      const trxns = new Trxns(req, trx);

      const ctrxn_pnr =
        pilgrims_information[0] &&
        pilgrims_information.map((item) => item.ticket_pnr).join(', ');

      const ctrnx_ticket_no =
        pilgrims_information[0] &&
        pilgrims_information.map((item) => item.ticket_no).join(', ');

      const routes =
        pilgrims_information &&
        pilgrims_information.map((item) => item.ticket_route as number[]);
      const flattenedRoutes = ([] as number[]).concat(...routes);

      let ctrxn_route;
      if (flattenedRoutes.length > 0) {
        ctrxn_route = await common_conn.getRoutesInfo(flattenedRoutes);
      }

      if (isNotEmpty(pilgrims_information)) {
        for (const item of pilgrims_information) {
          const haji_info_vouchar_no = generateVoucherNumber(4);

          const pilgrimsId = item.haji_info_id;

          const hajjHajjiInfo: IHajiPilgrimsDB = {
            hajiinfo_gender: item.hajiinfo_gender,
            haji_info_invoice_id: invoice_id,
            haji_info_passport_id: item.haji_info_passport_id,
            hajiinfo_serial: item.hajiinfo_serial,
            hajiinfo_tracking_number: item.hajiinfo_tracking_number,
            ticket_airline_id: item.ticket_airline_id,
            ticket_journey_date: item.ticket_journey_date,
            ticket_no: item.ticket_no,
            ticket_pnr: item.ticket_pnr,
            ticket_reference_no: item.ticket_reference_no,
            ticket_return_date: item.ticket_return_date,
            haji_info_vouchar_no,
          };

          if (pilgrimsId && item.is_deleted) {
            await conn.dleteHajjHajiInfoRoutes(pilgrimsId, invoice_created_by);
            await conn.deleteHajjHajiInfoByHajiId(
              pilgrimsId,
              invoice_created_by
            );
          } else if (pilgrimsId) {
            await conn.dleteHajjHajiInfoRoutes(pilgrimsId, invoice_created_by);

            await conn.updateHajjHajiInfo(hajjHajjiInfo, pilgrimsId);

            const ummrahPassengerRoutes = item?.ticket_route?.map((airpot) => {
              return { ih_haji_info_id: pilgrimsId, iu_airport_id: airpot };
            });

            if (ummrahPassengerRoutes?.length) {
              await conn.insertHajjHajiInfoRoutes(ummrahPassengerRoutes);
            }
          } else {
            const hajj_haji_id = await conn.insertHajjHajiInfo(hajjHajjiInfo);

            const ummrahPassengerRoutes = item?.ticket_route?.map((airpot) => {
              return { ih_haji_info_id: hajj_haji_id, iu_airport_id: airpot };
            });

            if (ummrahPassengerRoutes?.length) {
              await conn.insertHajjHajiInfoRoutes(ummrahPassengerRoutes);
            }
          }
        }
      }

      // HOTEL INFORMATION
      if (isNotEmpty(hotel_information)) {
        for (const item of hotel_information) {
          const hotel_id = item.hotel_id;

          const hotelData: IHotelInfoDB = {
            hotel_invoice_id: invoice_id,
            hotel_check_in_date: item.hotel_check_in_date,
            hotel_check_out_date: item.hotel_check_out_date,
            hotel_name: item.hotel_name,
            hotel_reference_no: item.hotel_reference_no,
            hotel_room_type_id: item.hotel_room_type_id,
          };

          if (hotel_id && item.is_deleted) {
            await conn.deleteInvoiceHajjHotelByHotelId(
              hotel_id,
              invoice_created_by
            );
          } else if (hotel_id) {
            await conn.updateInvoiceHajjHotelByHotelId(hotelData, hotel_id);
          } else {
            await conn.insertInvoiceHajjHotelInfos(hotelData);
          }
        }
      }

      // TRANSPORT INFORMATION
      if (isNotEmpty(transport_info)) {
        for (const item of transport_info) {
          const transport_id = item.transport_id;

          const transportData: ITransportInfoDB = {
            transport_invoice_id: invoice_id,
            transport_dropoff_place: item.transport_dropoff_place,
            transport_dropoff_time: item.transport_dropoff_time,
            transport_pickup_place: item.transport_pickup_place,
            transport_pickup_time: item.transport_pickup_time,
            transport_type_id: item.transport_type_id,
          };

          if (transport_id && item.is_deleted) {
            await conn.deleteHajjTranportByTransportId(
              transport_id,
              invoice_created_by
            );
          } else if (transport_id) {
            await conn.updateHajjTranportByTransportId(
              transportData,
              transport_id
            );
          } else {
            await conn.insertInTransportInfos(transportData);
          }
        }
      }

      // BILLING & PURCHASES INFORMATION
      for (const item of billing_information) {
        const {
          billing_id,
          is_deleted,
          billing_comvendor,
          billing_cost_price,
          billing_quantity,
          billing_product_id,
          billing_profit,
          billing_unit_price,
          pax_name,
          billing_description,
        } = item;

        const billing_subtotal = billing_quantity * billing_unit_price;

        const billingInfoData: IOtherBillingInfoDb = {
          billing_invoice_id: invoice_id,
          billing_sales_date: invoice_sales_date,
          billing_remaining_quantity: billing_quantity,
          billing_cost_price,
          billing_quantity,
          billing_subtotal,
          billing_product_id,
          billing_profit,
          billing_unit_price,
          pax_name,
          billing_description,
        };

        let VTrxnBody: IVTrxn | null = null;

        if (billing_cost_price && billing_comvendor) {
          const billing_total_cost = billing_cost_price * billing_quantity;
          const { combined_id, vendor_id } =
            separateCombClientToId(billing_comvendor);

          billingInfoData.billing_vendor_id = vendor_id;
          billingInfoData.billing_combined_id = combined_id;

          VTrxnBody = {
            comb_vendor: billing_comvendor,
            vtrxn_amount: billing_total_cost,
            vtrxn_created_at: invoice_sales_date,
            vtrxn_note: billing_description,
            vtrxn_particular_id: 11,
            vtrxn_pax: pax_name,
            vtrxn_type: combined_id ? 'CREDIT' : 'DEBIT',
            vtrxn_user_id: invoice_created_by,
            vtrxn_voucher: invoice_no,
            vtrxn_airticket_no: ctrnx_ticket_no,
            vtrxn_pnr: ctrxn_pnr,
            vtrxn_route: ctrxn_route,
          };
        }

        if (billing_id) {
          const previousBillingInfo = await conn.getHajiBillingInfoByBillingId(
            billing_id
          );
          // DELETE BILLING INFORMATION
          if (is_deleted) {
            await conn.deleteBillingInfosByBillingId(
              billing_id,
              invoice_created_by
            );

            await trxns.deleteInvVTrxn([previousBillingInfo]);
          } else if (VTrxnBody) {
            if (previousBillingInfo?.prevTrxnId) {
              await trxns.VTrxnUpdate({
                ...VTrxnBody,
                trxn_id: previousBillingInfo?.prevTrxnId as number,
              });
              billingInfoData.billing_vtrxn_id =
                previousBillingInfo?.prevTrxnId;
            } else {
              billingInfoData.billing_vtrxn_id = await trxns.VTrxnInsert(
                VTrxnBody
              );
            }

            await conn.updateBillingInfosByBillingId(
              billingInfoData,
              billing_id
            );
          } else {
            billingInfoData.billing_vendor_id = null;
            billingInfoData.billing_combined_id = null;
            billingInfoData.billing_vtrxn_id = null;
            billingInfoData.billing_cost_price = 0;

            await trxns.deleteVTrxn(
              previousBillingInfo?.prevTrxnId,
              previousBillingInfo?.prevComvendor as string
            );

            await conn.updateBillingInfosByBillingId(
              billingInfoData,
              billing_id
            );
          }
        } else {
          if (VTrxnBody) {
            billingInfoData.billing_vtrxn_id = await trxns.VTrxnInsert(
              VTrxnBody
            );
          }

          await conn.insertInBillingInfos(billingInfoData);
        }
      }
    });
  };
}

export default CommonHajjDetailsInsert;
