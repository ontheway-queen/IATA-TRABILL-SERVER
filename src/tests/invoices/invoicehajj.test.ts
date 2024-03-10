import request from 'supertest';
import App from '../../app/app';
import {
  postInvoiceHajj,
  updateInvoiceHajj,
} from '../demoData/invoicesTestData';

const app = new App().app;

describe('INVOICES , Invoice ummrah', () => {
  let invoiceId: number;

  // create account
  test.only('POST /api/v1/invoic-hajj/post', async () => {
    const response = await request(app)
      .post('/api/v1/invoic-hajj/post')
      .send(postInvoiceHajj);

    const { success, data } = JSON.parse(response.text);

    expect(response.status).toBe(200);
    expect(success).toBe(true);
    expect(typeof data.invoice_id).toBe('number');

    invoiceId = data.invoice_id;
  });

  test.only('GET (FOR EDIT) /api/v1/invoic-hajj/get-for-edit/:id', async () => {
    const response = await request(app).get(
      `/api/v1/invoic-hajj/get-for-edit/${invoiceId}`
    );

    const { success } = JSON.parse(response.text);

    expect(response.status).toBe(200);
    expect(success).toBe(true);
  });

  test.only('GET view /api/v1/invoic-hajj/view/:id', async () => {
    const response = await request(app).get(
      `/api/v1/invoic-hajj/view/${invoiceId}`
    );

    const { success } = JSON.parse(response.text);

    expect(response.status).toBe(200);
    expect(success).toBe(true);
  });

  test.only('GET ALL DATA /api/v1/invoic-hajj/all/31?trash=0&size=100&page=1', async () => {
    const response = await request(app).get(
      `/api/v1/invoic-hajj/all/31?trash=0&size=100&page=1`
    );

    const { success, message, count } = JSON.parse(response.text);

    expect(response.status).toBe(200);
    expect(success).toBe(true);
    expect(message).toBe('All Invoices Hajj');
    expect(count > 0).toBe(true);
  });

  test.only('PATCH /api/v1/invoic-hajj/edit/:id', async () => {
    const response = await request(app)
      .patch(`/api/v1/invoic-hajj/edit/${invoiceId}`)
      .send(updateInvoiceHajj);

    const { success, data } = JSON.parse(response.text);

    expect(response.status).toBe(200);
    expect(success).toBe(true);
    expect(data).toBe('Invoice updated successfully...');
  });

  test.only('DLETE /api/v1/invoic-hajj/delete/:id ', async () => {
    const response = await request(app)
      .delete(`/api/v1/invoic-hajj/delete/${invoiceId}`)
      .send({
        invoice_has_deleted_by: 5,
      });

    const { success, data } = JSON.parse(response.text);

    expect(response.status).toBe(200);
    expect(success).toBe(true);
    expect(data).toBe('Invoice deleted successfully...');
  });
});
