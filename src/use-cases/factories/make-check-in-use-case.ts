import { CheckInUseCase } from '@/use-cases/cases/check-in/check-in';
import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository';
import { PrismaCheckInRepository } from '@/repositories/prisma/prisma-check-in-repository';

export function makeCheckInUseCase(): CheckInUseCase {
  const checkInRepository = new PrismaCheckInRepository();
  const gymsRepository = new PrismaGymsRepository();
  const useCase = new CheckInUseCase(checkInRepository, gymsRepository);

  return useCase;
}
