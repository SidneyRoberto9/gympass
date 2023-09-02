import { FastifyRequest, FastifyReply } from 'fastify';

import { makeGetUserProfileUseCase } from '@/use-cases/factories/make-get-user-profile-user-case';
import { ResourceNotFoundError } from '@/use-cases/erros/resource-not-found-error';

export async function Profile(request: FastifyRequest, reply: FastifyReply) {
  try {
    const getUserProfile = makeGetUserProfileUseCase();

    const { user } = await getUserProfile.execute({
      userId: request.user.sub,
    });

    return reply.status(200).send({
      user: {
        ...user,
        password_hash: undefined,
      },
    });
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message });
    }

    throw error;
  }
}
