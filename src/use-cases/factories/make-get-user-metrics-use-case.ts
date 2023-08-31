import { GetUserMetricsUseCase } from '@/use-cases/cases/get-user-metrics/get-user-metrics';
import { PrismaCheckInRepository } from '@/repositories/prisma/prisma-check-in-repository';

export function makeGetUserMetricsUseCase(): GetUserMetricsUseCase {
  const checkInRepository = new PrismaCheckInRepository();
  const useCase = new GetUserMetricsUseCase(checkInRepository);

  return useCase;
}
