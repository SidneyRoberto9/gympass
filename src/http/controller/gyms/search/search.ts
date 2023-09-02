import { z } from 'zod';
import { FastifyRequest, FastifyReply } from 'fastify';

import { makeSearchGymUseCase } from '@/use-cases/factories/make-search-gyms-use-case';

export async function search(request: FastifyRequest, reply: FastifyReply) {
  const searchGymsQuerySchema = z.object({
    q: z.string(),
    page: z.coerce.number().min(1).default(1),
  });

  const { page, q } = searchGymsQuerySchema.parse(request.query);

  const searchGymUseCase = makeSearchGymUseCase();

  const { gyms } = await searchGymUseCase.execute({
    query: q,
    page,
  });

  return reply.status(200).send({
    gyms,
  });
}
