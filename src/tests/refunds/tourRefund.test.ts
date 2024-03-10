import request from 'supertest';
import App from '../../app/app';

const app = new App().app;

describe('Tour Refund Actions', () => {
  let refundId: number;

  test.only('POST /api/v1/refund/invoice-tour-refund create tour pakage refund', async () => {
    const newRefund = {
      voucher_no: 'TR_REF_1682998838',
      created_by: 5,
      invoice_id: 146,
      invoice_category_id: 5,
      note: 'Tour refund created by me (:',
      comb_client: 'client-2',
      client_refund_info: {
        payment_method: 1,
        trxn_charge_amount: 100,
        crefund_account_id: 1,
        crefund_payment_type: 'ADJUST',
        crefund_total_amount: 2000,
        crefund_charge_amount: 22,
        crefund_return_amount: 1980,
        date: '2023-05-02',
        withdraw_date: '2023-05-02',
      },
      itineraries: [
        [
          'accm',
          [
            {
              vrefund_account_id: 1,
              comb_vendor_id: 'vendor-2',
              vrefund_payment_type: 'ADJUST',
              vrefund_total_amount: 200,
              vrefund_return_amount: 188,
              vrefund_charge_amount: 12,
              vrefund_moneyreturn_type: 1,
              trxn_charge_amount: 130,
              date: '2023-05-02',
            },
          ],
        ],
        [
          'food',
          [
            {
              vrefund_account_id: 1,
              comb_vendor_id: 'vendor-2',
              vrefund_payment_type: 'ADJUST',
              vrefund_total_amount: 200,
              vrefund_return_amount: 188,
              vrefund_charge_amount: 12,
              vrefund_moneyreturn_type: 1,
              trxn_charge_amount: 309,
              date: '2023-05-02',
            },
          ],
        ],
        [
          'guide',
          [
            {
              vrefund_account_id: 1,
              comb_vendor_id: 'vendor-2',
              vrefund_payment_type: 'ADJUST',
              vrefund_total_amount: 200,
              vrefund_return_amount: 178,
              vrefund_charge_amount: 22,
              vrefund_moneyreturn_type: 1,
              trxn_charge_amount: 323,
              date: '2023-05-02',
            },
          ],
        ],
        [
          'other_trans',
          [
            {
              vrefund_account_id: 1,
              comb_vendor_id: 'vendor-2',
              vrefund_payment_type: 'ADJUST',
              vrefund_total_amount: 200,
              vrefund_return_amount: 178,
              vrefund_charge_amount: 22,
              vrefund_moneyreturn_type: 1,
              trxn_charge_amount: 32,
              date: '2023-05-02',
            },
          ],
        ],
        [
          'ticket',
          [
            {
              vrefund_account_id: 1,
              comb_vendor_id: 'vendor-2',
              vrefund_payment_type: 'ADJUST',
              vrefund_total_amount: 200,
              vrefund_return_amount: 178,
              vrefund_charge_amount: 22,
              vrefund_moneyreturn_type: 1,
              trxn_charge_amount: 30,
              date: '2023-05-02',
            },
          ],
        ],
        [
          'transport',
          [
            {
              vrefund_account_id: 1,
              comb_vendor_id: 'vendor-2',
              vrefund_payment_type: 'ADJUST',
              vrefund_total_amount: 200,
              vrefund_return_amount: 178,
              vrefund_charge_amount: 22,
              vrefund_moneyreturn_type: 1,
              trxn_charge_amount: 23,
              date: '2023-05-02',
            },
          ],
        ],
      ],
    };
    const { status, text } = await request(app)
      .post(`/api/v1/refund/invoice-tour-refund`)
      .send(newRefund);

    const { success, refund_id } = JSON.parse(text);

    refundId = refund_id;

    expect(status).toBe(201);
    expect(success).toBe(true);
  });

  test.only('GET /api/v1/refund/invoice-tour-refund get all refunds', async () => {
    const { status, text } = await request(app).get(
      `/api/v1/refund/invoice-tour-refund?trash=0&page=1&size=100`
    );

    const { success, count } = JSON.parse(text);

    expect(status).toBe(200);
    expect(success).toBe(true);
    expect(typeof count).toBe('number');
  });

  test.only('GET /api/v1/refund/invoice-tour-refund get all refunds with search', async () => {
    const { status, text } = await request(app).get(
      `/api/v1/refund/invoice-tour-refund?trash=0&page=1&size=100&from_date=2023-01-01&to_date=2023-12-12&search=TOUR-REF`
    );

    const { success, count } = JSON.parse(text);

    expect(status).toBe(200);
    expect(success).toBe(true);
    expect(typeof count).toBe('number');
  });

  test.only('GET /api/v1/refund/invoice-tour-refund/:refund_id get single refund', async () => {
    const { status, text } = await request(app).get(
      `/api/v1/refund/invoice-tour-refund?trash=0&page=1&size=100`
    );

    const { success } = JSON.parse(text);

    expect(status).toBe(200);
    expect(success).toBe(true);
  });

  test.only('DELETE /api/v1/refund/invoice-tour-refund/:refund_id delete single refund', async () => {
    const deleted_by = {
      refund_deleted_by: 5,
    };
    const { status, text } = await request(app)
      .delete(`/api/v1/refund/invoice-tour-refund/${refundId}`)
      .send(deleted_by);

    const { success, message } = JSON.parse(text);

    expect(status).toBe(200);
    expect(success).toBe(true);
    expect(message).toBe('Tour refund has been deleted');
  });
});
