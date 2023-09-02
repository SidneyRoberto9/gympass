import { it, expect, describe, beforeAll, afterAll } from 'vitest';
import request from 'supertest';

import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';
import { app } from '@/app';

describe('Profile (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to get user profile', async () => {
    const { token } = await createAndAuthenticateUser(app);

    const profileResponse = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}`);

    expect(profileResponse.statusCode).toBe(200);
    expect(profileResponse.body).toEqual({
      user: expect.objectContaining({
        email: 'johnDoe@example.com',
      }),
    });
  });
});
