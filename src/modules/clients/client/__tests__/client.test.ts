import request from 'supertest';
import App from '../../../../app/app';
import {
  corporateClientPayload,
  individualClientPayload,
  partialCorporateClientPayload,
  partialIndividualClientPayload,
} from './payloads';

const app = new App().app;

expect.extend({
  nullOrAny(received, expected) {
    const pass: boolean =
      received === null || received.constructor === expected;

    return {
      pass,
      message: () =>
        `expected null or instance of ${this.utils.printExpected(
          expected
        )}, but received ${this.utils.printReceived(received)}`,
    };
  },
});

describe('clients', () => {
  describe.skip('coroporate client', () => {
    describe.skip('given all necessary data to create a coroporate client', () => {
      it('should return a success responses', async () => {
        const { body } = await request(app)
          .post('/api/v1/client/create')
          .send(corporateClientPayload)
          .expect(201);

        expect(body).toEqual({
          success: true,
          message: expect.any(String),
          data: {
            category_prefix: expect.any(String),
            client_entry_id: expect.any(String),
            client_id: expect.any(Number),
          },
        });
      });
    });

    describe.skip('given partial data which is not sufficient to create a corporate client', () => {
      it('should return a `Bad Request` response', async () => {
        const { body } = await request(app)
          .post('/api/v1/client/create')
          .send(partialCorporateClientPayload)
          .expect(400);

        expect(body).toEqual({
          success: false,
          message: expect.any(String),
          status: 400,
          type: expect.any(String),
        });
      });
    });
  });

  describe.skip('individual client', () => {
    describe('given all necessary data to create a individual client', () => {
      it('should return a success response', async () => {
        const { body } = await request(app)
          .post('/api/v1/client/create')
          .send(individualClientPayload)
          .expect(201);

        expect(body).toEqual({
          success: true,
          message: expect.any(String),
          data: {
            category_prefix: expect.any(String),
            client_entry_id: expect.any(String),
            client_id: expect.any(Number),
          },
        });
      });
    });

    describe.skip('given paratial data which is not sufficient to create an individual client', () => {
      it('should return a `Bad Request` response', async () => {
        const { body } = await request(app)
          .post('/api/v1/client/create')
          .send(partialIndividualClientPayload)
          .expect(400);

        expect(body).toEqual({
          success: false,
          message: expect.any(String),
          status: 400,
          type: 'Bad Request',
        });
      });
    });
  });

  describe.skip('get routes', () => {
    describe('given a user whats to fetch all the clients', () => {
      it('should return all the clients which is not deleted', async () => {
        const { body } = await request(app).get('/api/client/all').expect(200);

        body.data.forEach((item: any) => {
          expect(item).toEqual(
            expect.objectContaining({
              client_id: expect.any(Number),
              client_name: expect.any(String),
              email: expect.nullOrAny(String),
              mobile: expect.any(String),
              client_activity_status: expect.any(Number),
              client_is_deleted: 0,
              client_created_by_name: expect.any(String),
              client_last_balance: expect.any(String),
            })
          );
        });
      });

      it('should return all the deleted clients', async () => {
        const { body } = await request(app)
          .get('/api/client/deleted-clients')
          .expect(200);

        body.data.forEach((item: any) => {
          expect(item).toEqual(
            expect.objectContaining({
              client_id: expect.any(Number),
              client_name: expect.any(String),
              email: expect.nullOrAny(String),
              mobile: expect.any(String),
              client_activity_status: expect.any(Number),
              client_is_deleted: 1,
              client_created_by_name: expect.any(String),
              client_last_balance: expect.any(String),
            })
          );
        });
      });
    });

    describe('given client id, by which a user wants to fetch all information of  a corporate client client', () => {
      it('should return a not found router error', async () => {
        await request(app).get(`/api/clientssssss/${607}`).expect(404);
      });

      it('should return an not found router error', async () => {
        await request(app).get(`/api/client/${1}`).expect(400);
      });

      it('should return a success response', async () => {
        const { body } = await request(app).get(`/api/client/${607}`);

        const exp = {
          category_title: expect.any(String),
          client_activity_status: expect.any(Number),
          client_address: expect.nullOrAny(String),
          client_category_id: expect.any(Number),
          client_created_date: expect.any(String),
          client_designation: expect.nullOrAny(String),
          client_family_members: expect.nullOrAny(Number),
          client_gender: expect.nullOrAny(String),
          client_id: expect.any(Number),
          client_name: expect.any(String),
          client_trade_license: expect.nullOrAny(String),
          client_type: 'CORPORATE',
          company_address: expect.nullOrAny(String),
          company_contact_person: expect.arrayContaining([
            expect.objectContaining({
              company_contact_gender: expect.any(String),
              company_contact_mobile: expect.any(String),
              company_contact_person: expect.any(String),
            }),
          ]),
          company_name: expect.any(String),
          email: expect.nullOrAny(String),
          mobile: expect.any(String),
          source_title: expect.any(String),
        };

        expect(body.data).toEqual(expect.objectContaining(exp));
      });
    });
  });

  describe.skip('delete routes', () => {
    describe('given an invlaid client id', () => {
      it('should return an error response with status code 400', async () => {
        await request(app).delete('/api/client/:client_id').expect(400);
      });
    });

    describe('given a client id which has some balance remaining', () => {
      it('should return an error response with status code 400', async () => {
        await request(app).delete('/api/client/616').expect(400);
      });
    });

    describe('given a client id which has already been deleted', () => {
      it('should return a error response', async () => {
        await request(app).delete('/api/client/620').expect(400);
      });
    });

    describe.skip('given a client id which has no remaining balance', () => {
      it('should return a success response', async () => {
        await request(app).delete('/api/client/620').expect(200);
      });
    });

    describe('given an invalid client id to restore a client', () => {
      it('should an error response', async () => {
        await request(app).patch('/api/client/restore/:client_id').expect(400);
      });
    });

    describe('given a client id which is not deleted to restore a client', () => {
      it('should an error response', async () => {
        await request(app).patch('/api/client/restore/619').expect(400);
      });
    });

    describe.skip('given a client id which is deleted to restore a client', () => {
      it('should an success response', async () => {
        await request(app).patch('/api/client/restore/620').expect(200);
      });
    });
  });
});
