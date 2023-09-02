import { it, expect, describe, beforeAll, afterAll } from 'vitest';
import request from 'supertest';

import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';
import { prisma } from '@/lib/prisma';
import { app } from '@/app';

describe('Create Check In (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to create a check in', async () => {
    const { token } = await createAndAuthenticateUser(app, true);

    const gym = await prisma.gym.create({
      data: {
        title: 'JavaScript Gym',
        description: 'Same description.',
        phone: '119999999',
        latitude: -7.1680282,
        longitude: -34.8734516,
      },
    });

    const createResponse = await request(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: -7.1680282,
        longitude: -34.8734516,
      });

    expect(createResponse.statusCode).toBe(201);
  });
});
