import { FastifyInstance } from 'fastify';

import { verifyJwt } from '@/http/middleware/verify-jwt';
import { register } from '@/http/controller/users/register/register';
import { refresh } from '@/http/controller/users/refresh/refresh';
import { Profile } from '@/http/controller/users/profile/profile';
import { authenticate } from '@/http/controller/users/authenticate/authenticate';

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', register);
  app.post('/sessions', authenticate);
  app.patch('/token/refresh', refresh);

  app.get('/me', { onRequest: [verifyJwt] }, Profile);
}
