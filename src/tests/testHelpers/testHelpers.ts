import request from 'supertest';
import App from '../../app/app';

const app = new App().app;

export const GETapiTest = (urlPath: string) => {
  test.only(`GET /${urlPath}`, async () => {
    const response = await request(app).get(`/${urlPath}`);

    const { text, status } = response;

    const { success } = JSON.parse(text);

    expect(status).toBe(200);
    expect(success).toBe(true);
  });
};

export const POSTapiTest = (
  urlPath: string,
  statusCode: number,
  bodyValue: any
) => {
  test.only('POST /api/v1/accounts/create creates an account', async () => {
    const response = await request(app).post(`/${urlPath}`).send(bodyValue);

    const { success } = JSON.parse(response.text);

    expect(response.status).toBe(statusCode);
    expect(success).toBe(true);
  });
};
