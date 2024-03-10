import request from 'supertest';
import App from '../../app/app';
import { postInvoiceAirticket } from '../demoData/invoicesTestData';

const app = new App().app;

describe('API Endpoints for invoice airitckets', () => {
  let invoiceid: number;

  describe('POST /api/v1/invoice-air-ticket', () => {
    it('should create a invoice airticket', async () => {
      const response = await request(app)
        .post('/api/v1/invoice-air-ticket')
        .send(postInvoiceAirticket);

      const { success, data, message } = JSON.parse(response.text);

      expect(response.status).toBe(200);
      expect(success).toBe(true);
      expect(message).toBe('Invoice airticket has been added');

      invoiceid = data.invoice_id;
    });
  });

  it('should return a list of airtickets', async () => {
    const response = await request(app).get('/api/v1/invoice-air-ticket');

    const { success, message } = JSON.parse(response.text);

    expect(response.status).toBe(200);
    expect(success).toBe(true);
    expect(message).toBe('All Invoices Airticket');
  });

  describe('TEST ALL API WITH ID FOR INVOICE AIRTICKET', () => {
    it('should return a single invoice for edit', async () => {
      const response = await request(app).get(
        `/api/v1/invoice-air-ticket/${invoiceid}`
      );

      const { success } = JSON.parse(response.text);

      expect(response.status).toBe(200);
      expect(success).toBe(true);
    });
  });
});
