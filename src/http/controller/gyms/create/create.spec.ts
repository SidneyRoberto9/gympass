import { it, expect, describe, beforeAll, afterAll } from 'vitest';
import request from 'supertest';

import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';
import { app } from '@/app';

describe('Create Gym (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to create a gym', async () => {
    const { token } = await createAndAuthenticateUser(app, true);

    const createResponse = await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'JavaScript Gym',
        description: 'Same description.',
        phone: '119999999',
        latitude: -7.1680282,
        longitude: -34.8734516,
      });

    expect(createResponse.statusCode).toBe(201);
  });
});
