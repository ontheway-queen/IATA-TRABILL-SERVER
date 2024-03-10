import request from 'supertest';
import App from '../app/app';

const app = new App().app;

describe('Quoation actions', () => {
  test.only('GET api/v1/quotation/products get all quation ', async () => {
    const response = await request(app).get('/api/v1/quotation/products');

    const text = response.text;

    const { success } = JSON.parse(text);

    expect(response.statusCode).toBe(200);
    expect(success).toBe(true);
  });
});
