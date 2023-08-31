import { FastifyInstance } from 'fastify';

import { verifyJwt } from '@/http/middlewares/verify-jwt';
import { register } from '@/http/controllers/register';
import { Profile } from '@/http/controllers/profile';
import { authenticate } from '@/http/controllers/authenticate';

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', register);
  app.post('/sessions', authenticate);

  app.get('/me', { onRequest: [verifyJwt] }, Profile);
}
