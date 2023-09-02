import { it, expect, describe, beforeAll, afterAll } from 'vitest';
import request from 'supertest';

import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';
import { app } from '@/app';

describe('Nearby Gym (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to list nearby gym', async () => {
    const { token } = await createAndAuthenticateUser(app);

    await request(app.server).post('/gyms').set('Authorization', `Bearer ${token}`).send({
      title: 'Near Gym',
      latitude: -7.1680282,
      longitude: -34.8734516,
      phone: '',
      description: '',
    });

    await request(app.server).post('/gyms').set('Authorization', `Bearer ${token}`).send({
      title: 'Far Gym',
      latitude: -7.2154544,
      longitude: -35.9021861,
      phone: '',
      description: '',
    });

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({
        latitude: -7.1680282,
        longitude: -34.8734516,
      })
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'Near Gym',
      }),
    ]);
  });
});
