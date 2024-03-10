import App from '../../app/app';
import request from 'supertest';

const app = new App().app;

describe('Airticket refund action', () => {
  let refundId: number;

  test.only('POST /api/v1/refund/air-ticket-refund', async () => {
    const newRefund = {
      vouchar_no: 'AT_REF_1684044196',
      comb_client: 'client-2',
      invoice_id: 79,
      created_by: 5,
      date: '2023-05-14',
      profit: 400,
      client_refund_info: {
        crefund_payment_type: 'ADJUST',
        payment_method: 1,
        crefund_account_id: 1,
        crefund_date: '2023-05-14',
        crefund_total_amount: 125000,
        crefund_charge_amount: 100,
        trxn_charge_amount: 140,
        crefund_return_amount: 124900,
        withdraw_date: '2023-05-14',
      },
      vendor_refund_info: [
        {
          airticket_invoice_id: 79,
          invoice_category_id: 1,
          airticket_id: 12,
          airticket_vendor_id: 'vendor-2',
          airticket_ticket_no: '001',
          combined_last_balance: '-103775.00',
          combine_name: 'Sefat Alam Comb',
          client_charge: 100,
          vrefund_charge_amount: 200,
          vrefund_payment_type: 'ADJUST',
          payment_method: 1,
          trxn_charge_amount: 123,
          vrefund_account_id: 1,
          advance_amount: 113175,
          vrefund_return_amount: 113175,
          vrefund_date: '2023-05-14',
          vrefund_total_amount: 113375,
          vrefund_adjust: null,
          withdraw_date: '2023-05-14',
        },
      ],
    };

    const { status, text } = await request(app)
      .post('/api/v1/refund/air-ticket-refund')
      .send(newRefund);

    const { success, message, refund_id } = JSON.parse(text);
    refundId = refund_id;
    expect(typeof refund_id).toBe('number');
    expect(status).toBe(201);
    expect(success).toBe(true);
  });

  test.only('GET /api/v1/refund/air-ticket-refund get all airticket refund', async () => {
    const { status, text } = await request(app).get(
      `/api/v1/refund/air-ticket-refund?trash=0&page=1&size=100`
    );

    const { success, count } = JSON.parse(text);

    expect(status).toBe(200);
    expect(success).toBe(true);
    expect(typeof count).toBe('number');
  });

  test.only('GET /api/v1/refund/air-ticket-refund get all with search airticket refund', async () => {
    const { status, text } = await request(app).get(
      `/api/v1/refund/air-ticket-refund?trash=0&page=1&size=100&from_date=2023-01-01&to_date=2024-12-12&search=AR-REF`
    );

    const { success, count } = JSON.parse(text);

    expect(status).toBe(200);
    expect(success).toBe(true);
    expect(typeof count).toBe('number');
  });

  const deleted_by = {
    atrefund_is_deleted: 5,
  };

  test.only('GET /api/v1/refund/air-ticket-refund/:refund_id get as refund', async () => {
    const { status, text } = await request(app).get(
      `/api/v1/refund/air-ticket-refund/${refundId}`
    );

    const { success } = JSON.parse(text);

    expect(status).toBe(200);
    expect(success).toBe(true);
  });

  test.only('DELETE /api/v1/refund/air-ticket-refund/:refund_id', async () => {
    const { status, text } = await request(app)
      .delete(`/api/v1/refund/air-ticket-refund/${refundId}`)
      .send(deleted_by);

    const { success, message } = JSON.parse(text);

    expect(status).toBe(200);
    expect(success).toBe(true);
    expect(message).toBe('Airticket refund has been deleted');
  });
});
