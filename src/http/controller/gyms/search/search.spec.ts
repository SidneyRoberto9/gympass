import { it, expect, describe, beforeAll, afterAll } from 'vitest';
import request from 'supertest';

import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';
import { app } from '@/app';

describe('Search Gym (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to search gyms by title', async () => {
    const { token } = await createAndAuthenticateUser(app);

    await request(app.server).post('/gyms').set('Authorization', `Bearer ${token}`).send({
      title: 'JavaScript Gym',
      description: 'Same description.',
      phone: '119999999',
      latitude: -7.1680282,
      longitude: -34.8734516,
    });

    await request(app.server).post('/gyms').set('Authorization', `Bearer ${token}`).send({
      title: 'TypeScript Gym',
      description: 'Same description.',
      phone: '119999999',
      latitude: -7.1680282,
      longitude: -34.8734516,
    });

    const response = await request(app.server)
      .get('/gyms/search')
      .query({
        q: 'JavaScript',
      })
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'JavaScript Gym',
      }),
    ]);
  });
});
