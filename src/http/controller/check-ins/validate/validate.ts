import { z } from 'zod';
import { FastifyRequest, FastifyReply } from 'fastify';

import { makeValidateCheckInUseCase } from '@/use-cases/factories/make-validate-check-in-use-case';

export async function validate(request: FastifyRequest, reply: FastifyReply) {
  const validateCheckInParamsSchema = z.object({
    checkInId: z.string().uuid(),
  });

  const { checkInId } = validateCheckInParamsSchema.parse(request.params);

  const validateCheckInUseCas = makeValidateCheckInUseCase();

  await validateCheckInUseCas.execute({
    checkInId,
  });

  return reply.status(204).send();
}
