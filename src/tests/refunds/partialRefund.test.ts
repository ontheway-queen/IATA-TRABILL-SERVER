/*
Create partial refund test script
@Author MD Sabbir <sabbir.m360ict@gmail.com>
*/

// npx jest --testPathPattern=tests/refunds/partialRefund.test.ts

import request from 'supertest';
import App from '../../app/app';

const app = new App().app;

describe('Partial Refund Actions', () => {
  let refundId: number;

  test.only('POST /api/v1/refund/persial-refund create partial refund', async () => {
    const newRefund = {
      invoice_id: 16632,
      comb_client: 'client-16472',
      created_by: 5,
      prfnd_account_id: 1376,
      prfnd_charge_amount: 1,
      prfnd_return_amount: 200,
      prfnd_total_amount: 500,
      prfnd_profit_amount: 432,
      date: '2023-10-12',
      note: 'Oo yeahhhhhh',
      prfnd_payment_method: 1,
      prfnd_payment_type: 'ADJUST',
      vendor_refund_info: [
        {
          vprfnd_airticket_id: 5163,
          vprfnd_account_id: 1376,
          vprfnd_payment_method: 1,
          vprfnd_payment_type: 'ADJUST',
          vprfnd_charge_amount: 50,
          vprfnd_return_amount: 450,
          vprfnd_total_amount: 500,
          comb_vendor: 'vendor-2592',
        },
      ],
    };

    const { status, text } = await request(app)
      .post(`/api/v1/refund/persial-refund`)
      .send(newRefund);

    const { success, refund_id } = JSON.parse(text);

    refundId = refund_id;

    expect(status).toBe(201);
    expect(success).toBe(true);
  });

  test.only('GET /api/v1/refund/persial-refund Get All Refunds', async () => {
    const { status, text } = await request(app).get(
      '/api/v1/refund/persial-refund?page=1&size=200'
    );

    const { success, count } = JSON.parse(text);

    expect(status).toBe(200);
    expect(success).toBe(true);
    expect(typeof count).toBe('number');
  });

  test.only('GET /api/v1/refund/persial-refund/:refund_id Get Single Refund', async () => {
    const { status, text } = await request(app).get(
      `/api/v1/refund/persial-refund/${refundId}`
    );

    const { success, data } = JSON.parse(text);

    expect(status).toBe(200);
    expect(success).toBe(true);
    expect(data?.prfnd_id).toBe(refundId);
  });

  test.only('DELETE /api/v1/refund/persial-refund/:refund_id Delete Refund', async () => {
    const { status, text } = await request(app)
      .delete(`/api/v1/refund/persial-refund/${refundId}`)
      .send({ deleted_by: 5 });

    const { success, message } = JSON.parse(text);

    expect(status).toBe(200);
    expect(success).toBe(true);
    expect(message).toBe('Persial refund deleted successfuly');
  });
});
