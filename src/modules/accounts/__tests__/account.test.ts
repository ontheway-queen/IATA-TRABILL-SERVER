import request from 'supertest';
import App from '../../../app/app';

const app = new App().app;

describe('accounts', () => {
  describe.skip('create account', () => {
    describe('given all the invalid information', () => {
      const partialAccountPayload = {
        // acctype_id: 1,
        // account_created_by: 2,
        account_name: 'My new Account',
        account_number: 'PKC3652SDK14',
        account_bank_name: 'Eastern Bank Ltd',
        account_branch_name: 'Gulshan',
        opening_balance: '5000000',
      };

      it('should return an error response with 400 status code', async () => {
        await request(app)
          .post('/api/v1/accounts/create')
          .send(partialAccountPayload)
          .expect(400);
      });
    });

    const accountPayload = {
      acctype_id: 1,
      account_created_by: 2,
      account_name: 'My new Account',
      account_number: 'PKC3652SDK14',
      account_bank_name: 'Eastern Bank Ltd',
      account_branch_name: 'Gulshan',
      opening_balance: '5000000',
    };

    describe('given all valid information', () => {
      test('should return a success response', async () => {
        await request(app)
          .post('/api/v1/accounts/create')
          .send(accountPayload)
          .expect(201);
      });
    });
  });

  describe('get account', () => {
    describe('get all accounts', () => {
      describe('given account category id', () => {
        test('should return all the accounts belongs to that account category', async () => {
          await request(app).get('');
        });
      });
    });
  });
});
