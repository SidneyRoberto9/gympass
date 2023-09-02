import { FastifyInstance } from 'fastify';

import { verifyJwt } from '@/http/middleware/verify-jwt';
import { validate } from '@/http/controller/check-ins/validate/validate';
import { metrics } from '@/http/controller/check-ins/metrics/metrics';
import { history } from '@/http/controller/check-ins/history/history';
import { create } from '@/http/controller/check-ins/create/create';

export async function checkInsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt);

  app.get('/check-ins/history', history);
  app.get('/check-ins/metrics', metrics);

  app.post('/gyms/:gymId/check-ins', create);
  app.patch('/check-ins/:checkInId/validate', validate);
}
