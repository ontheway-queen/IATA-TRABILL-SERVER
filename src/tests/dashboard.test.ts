import request from 'supertest';
import App from '../app/app';

const app = new App().app;

/*/
npx jest --testPathPattern=dashboard.test.ts
/*/

describe('Dashboard data get', () => {
  // GET LOAN DETAILS
  test.only('GET /api/v1/dashboard/loan-details LOAN DETAILS', async () => {
    const response = await request(app).get('/api/v1/dashboard/loan-details');

    const { text, status } = response;

    const { success } = JSON.parse(text);

    expect(status).toBe(200);
    expect(success).toBe(true);
  });
  test.only('GET /api/v1/dashboard/acc-details ACCOUNT DETAILS', async () => {
    const response = await request(app).get('/api/v1/dashboard/acc-details');

    const { text, status } = response;

    const { success } = JSON.parse(text);

    expect(status).toBe(200);
    expect(success).toBe(true);
  });
  test.only('GET /api/v1/dashboard/acc-trans ACCOUNT TRANSACTION FROM DASHBOARD', async () => {
    const response = await request(app).get('/api/v1/dashboard/acc-trans');

    const { text, status } = response;

    const { success } = JSON.parse(text);

    expect(status).toBe(200);
    expect(success).toBe(true);
  });
});
