import { z } from 'zod';
import { FastifyRequest, FastifyReply } from 'fastify';

import { makeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case';
import { InvalidCredentialsError } from '@/use-cases/erros/invalid-credentials-error';

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { email, password } = authenticateBodySchema.parse(request.body);

  try {
    const authenticateUserCase = makeAuthenticateUseCase();

    await authenticateUserCase.execute({
      email,
      password,
    });
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: error.message });
    }

    throw error;
  }

  return reply.status(200).send();
}