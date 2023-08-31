import { FetchUserCheckInsHistoryUseCase } from '@/use-cases/cases/fetch-user-check-ins-history/fetch-user-check-ins-history';
import { PrismaCheckInRepository } from '@/repositories/prisma/prisma-check-in-repository';

export function makeFetchUserCheckInsHistoryUseCase(): FetchUserCheckInsHistoryUseCase {
  const checkInRepository = new PrismaCheckInRepository();
  const useCase = new FetchUserCheckInsHistoryUseCase(checkInRepository);

  return useCase;
}
