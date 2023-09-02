import { ZodError } from 'zod';
import fastify from 'fastify';

import fastifyJwt from '@fastify/jwt';
import { usersRoutes } from '@/http/controller/users/routes';
import { gymsRoutes } from '@/http/controller/gyms/routes';
import { checkInsRoutes } from '@/http/controller/check-ins/routes';
import { env } from '@/env';

export const app = fastify();

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
});

app.register(usersRoutes);
app.register(gymsRoutes);
app.register(checkInsRoutes);

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({ message: 'Validation error.', issues: error.format() });
  }

  if (env.NODE_ENV != 'production') {
    console.error(error);
  } else {
    // TODO: Here we should log to an external tool like Sentry.
  }

  return reply.status(500).send({ message: 'Internal server error.' });
});
