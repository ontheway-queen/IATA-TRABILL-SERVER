import AbstractModels from '../../../../abstracts/abstract.models';
import { idType } from '../../../../common/types/common.types';
import CustomError from '../../../../common/utils/errors/customError';

class PnrDetailsModels extends AbstractModels {
  public async getOtaInfo(agency_id: idType) {
    const [data] = await this.query()
      .select('ota_api_url', 'ota_token')
      .from('trabill_agency_ota_info')
      .whereNot('ota_is_deleted', 1)
      .andWhere('ota_org_id', agency_id);

    if (data) {
      return data as { ota_api_url: string; ota_token: string };
    }
    throw new CustomError('PNR details not found!', 404, 'Not authorized!');
  }

  getIataVendorId = async () => {
    const [vendor_id] = await this.query()
      .select('vendor_id')
      .from('trabill_vendors')
      .where('vendor_type', 'IATA')
      .andWhere('vendor_org_agency', this.org_agency)
      .andWhereNot('vendor_is_deleted', 1);

    if (vendor_id) {
      return 'vendor-' + vendor_id?.vendor_id;
    }
    return null;
  };

  public async airportIdByCode(airportCode: string) {
    const [data] = await this.query()
      .select('airline_id')
      .from('trabill_airports')
      .whereNot('airline_is_deleted', 1)
      .andWhere('airline_iata_code', airportCode);

    return data?.airline_id;
  }

  public async airlineIdByCode(airlineCode: string) {
    const [data] = await this.query()
      .select('airline_id')
      .from('trabill_airlines')
      .whereNot('airline_is_deleted', 1)
      .andWhere('airline_code', airlineCode);

    return data?.airline_id;
  }

  public async getEmployeeByCreationSign(sign: string) {
    const [data] = await this.query()
      .select('employee_id')
      .from('trabill_employees')
      .where('employee_creation_sign', sign);

    return data?.employee_id;
  }

  public async getClTransData(transId: idType, isClient: boolean) {
    let data;
    if (isClient) {
      let [cTrans] = await this.query()
        .select(
          'ctrxn_voucher as voucher',
          'ctrxn_airticket_no as ticket_no',
          'ctrxn_route as route',
          'ctrxn_pnr as pnr'
        )
        .from('trxn.client_trxn')
        .where('ctrxn_id', transId);

      data = cTrans;
    } else {
      let [comTrans] = await this.query()
        .select(
          'comtrxn_voucher_no as voucher',
          'comtrxn_airticket_no as ticket_no',
          'comtrxn_route as route',
          'comtrxn_pnr as pnr'
        )
        .from('trxn.comb_trxn')
        .where('comtrxn_id', transId);

      data = comTrans;
    }
    return data as {
      voucher: string;
      ticket_no: string;
      route: string;
      pnr: string;
    };
  }

  public async getPreviousInvoices(invoice_id: idType) {
    const [data] = await this.query()
      .from('trabill_invoices')
      .select(
        'invoice_no',
        'invoice_sub_total',
        'invoice_total_profit',
        'invoice_total_vendor_price',
        'invoice_sales_date'
      )
      .where('invoice_id', invoice_id)
      .leftJoin('trabill_invoices_extra_amounts', {
        extra_amount_invoice_id: 'invoice_id',
      });

    return data as {
      invoice_sub_total: string;
      invoice_total_profit: string;
      invoice_total_vendor_price: string;
      invoice_sales_date: string;
      invoice_no: string;
    };
  }
}

export default PnrDetailsModels;
