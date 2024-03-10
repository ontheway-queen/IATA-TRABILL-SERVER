import request from 'supertest';
import App from '../../app/app';
import { portInvoiceUmmrah } from '../demoData/invoicesTestData';

const app = new App().app;

describe('INVOICES , Invoice ummrah', () => {
  let invoiceId = 2258;

  // create account
  test.only('POST /api/v1/invoice-ummrah', async () => {
    const response = await request(app)
      .post('/api/v1/invoice-ummrah')
      .send(portInvoiceUmmrah);

    const { success, data } = JSON.parse(response.text);

    expect(response.status).toBe(200);
    expect(success).toBe(true);
    expect(typeof data.invoice_id).toBe('number');

    invoiceId = data.invoice_id;
  });

  test.only('GET /api/v1/invoice-ummrah/:id GET FOR EDIT', async () => {
    const response = await request(app).get(
      `/api/v1/invoice-ummrah/${invoiceId}`
    );

    const { success, data } = JSON.parse(response.text);

    expect(response.status).toBe(200);
    expect(success).toBe(true);
  });

  test.only('GET /api/v1/invoice-ummrah/view/:id GET VIEW', async () => {
    const response = await request(app).get(
      `/api/v1/invoice-ummrah/view/${invoiceId}`
    );

    const { success } = JSON.parse(response.text);

    expect(response.status).toBe(200);
    expect(success).toBe(true);
  });

  test.only('GET /api/v1/invoice-ummrah?size=100&page=1 get all invoice ummrah', async () => {
    const response = await request(app).get(
      '/api/v1/invoice-ummrah?size=100&page=1'
    );

    const { text, status } = response;

    const { success, count } = JSON.parse(text);

    expect(status).toBe(200);
    expect(success).toBe(true);
    expect(typeof count).toBe('number');
  });

  test.only('PATCH /api/v1/invoice-ummrah/:id', async () => {
    const response = await request(app)
      .patch(`/api/v1/invoice-ummrah/${invoiceId}`)
      .send(portInvoiceUmmrah);

    const { success, data } = JSON.parse(response.text);

    expect(response.status).toBe(200);
    expect(success).toBe(true);
  });

  //   test.only('VOID /api/v1/invoice-ummrah/void/:id', async () => {
  //     const response = await request(app)
  //       .delete(`/api/v1/invoice-ummrah/void/${invoiceId}`)
  //       .send({
  //         invoice_has_deleted_by: 5,
  //         void_charge: 300,
  //       });

  //     const { success } = JSON.parse(response.text);

  //     expect(response.status).toBe(200);
  //     expect(success).toBe(true);
  //   });
  //   test.only('VOID, SHOULD RETURN FALSE /api/v1/invoice-ummrah/void/:id', async () => {
  //     const response = await request(app)
  //       .delete(`/api/v1/invoice-ummrah/void/2257`)
  //       .send({
  //         invoice_has_deleted_by: 5,
  //         void_charge: 300,
  //       });

  //     const { success } = JSON.parse(response.text);

  //     expect(response.status).toBe(400);
  //     expect(success).toBe(false);
  //   });

  test.only('DELETE /api/v1/invoice-ummrah/:id', async () => {
    const response = await request(app)
      .delete(`/api/v1/invoice-ummrah/${invoiceId}`)
      .send({
        invoice_has_deleted_by: 5,
      });

    const { success } = JSON.parse(response.text);

    expect(response.status).toBe(200);
    expect(success).toBe(true);
  });

  test.only('DELETE , SHOULD RETURN SUCCESS FALSE /api/v1/invoice-ummrah/:id ', async () => {
    const response = await request(app)
      .delete(`/api/v1/invoice-ummrah/${invoiceId}`)
      .send({
        invoice_has_deleted_by: 5,
      });

    const { success } = JSON.parse(response.text);

    expect(response.status).toBe(400);
    expect(success).toBe(false);
  });
});
