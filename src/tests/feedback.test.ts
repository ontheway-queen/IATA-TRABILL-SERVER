import request from 'supertest';
import App from '../app/app';

const app = new App().app;
/*/
npx jest --testPathPattern=feedback.test.ts
/*/

describe('Feedback Add/List of Feedback', () => {
  let feedbackID: number;

  //Create feedback
  test.only('POST /api/v1/feedback creates an feedback', async () => {
    const newFeedback = {
      fd_agency_name: 'Agency Name Test',
      fd_subject: 'Subject Test',
      fd_message: 'Message Test',
      fd_user_experience: 'good',
      fd_customer_support: 'good',
      fd_software_update: 'good',
      fd_refer_other: '5',
      fd_most_useful_features: 'Invoice',
    };

    const response = await request(app)
      .post('/api/v1/feedback')
      .send(newFeedback);

    const { text, status } = response;

    const { success, id } = JSON.parse(text);
    expect(success).toBe(true);
    expect(typeof id).toBe('number');
    feedbackID = id;
  });

  // get all feedback
  test.only('GET /api/v1/feedback get all feedback', async () => {
    const response = await request(app).get('/api/v1/feedback/?page=1&size=4');

    const { text, status } = response;

    const { success, count } = JSON.parse(text);

    expect(success).toBe(true);
    expect(typeof count).toBe('number');
  });

  // delete feedback
  test.only('DELETE /api/v1/feedback/:id delete an account', async () => {
    const { text, status } = await request(app).delete(
      `/api/v1/feedback/${feedbackID}`
    );

    const { success } = JSON.parse(text);
    expect(success).toBe(true);
  });
});
