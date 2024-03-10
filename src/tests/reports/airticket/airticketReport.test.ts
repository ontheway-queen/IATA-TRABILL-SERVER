import request from 'supertest';
import App from '../../../app/app';
/*/
npx jest --testPathPattern=airticketReport.test.ts
/*/
const app = new App().app;

describe('Report:Air ticket report test', () => {
  test.only('GET /api/v1/report/air-ticket-summary', async () => {
    const response = await request(app).get(
      '/api/v1/report/air-ticket-summary'
    );

    const { text, status } = response;

    const { success, count, data } = JSON.parse(text);

    if (count < 20) {
      expect(data.length).toBe(count);
    }
    expect(status).toBe(200);
    expect(success).toBe(true);
    expect(typeof count).toBe('number');
  });

  // GET SUMMARY WITH WRONG CLIENT ID
  test.only('GET GET SUMMARY WITH WRONG CLIENT ID', async () => {
    const response = await request(app).get(
      '/api/v1/report/air-ticket-summary?client=client-10101010'
    );

    const { text, status } = response;

    const { success, count, data } = JSON.parse(text);

    expect(data.length).toBe(0);
    expect(count).toBe(0);
    expect(status).toBe(200);
    expect(success).toBe(true);
    expect(typeof count).toBe('number');
  });
});
