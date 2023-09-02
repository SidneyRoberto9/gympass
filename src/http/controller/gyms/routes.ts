import { FastifyInstance } from 'fastify';

import { verifyJwt } from '@/http/middleware/verify-jwt';
import { search } from '@/http/controller/gyms/search/search';
import { nearby } from '@/http/controller/gyms/nearby/nearby';
import { create } from '@/http/controller/gyms/create/create';

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt);

  app.post('/gyms', create);
  app.get('/gyms/search', search);
  app.get('/gyms/nearby', nearby);
}
