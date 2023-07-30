import { z } from 'zod';
import { FastifyRequest, FastifyReply } from 'fastify';

import { InvalidCredentialsError } from '@/use-cases/erros/invalid-credentials-error';
import { AuthenticateUserCase } from '@/use-cases/authenticate/authenticate';
import { PrismaUserRepository } from '@/repositories/prisma/prisma-users-repository';

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { email, password } = authenticateBodySchema.parse(request.body);

  try {
    const prismaUserRepository = new PrismaUserRepository();
    const authenticateUserCase = new AuthenticateUserCase(prismaUserRepository);

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
