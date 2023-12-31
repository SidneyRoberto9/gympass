import { CreateGymUseCase } from '@/use-cases/cases/create-gym/create-gym';
import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository';

export function makeCreateGymUseCase(): CreateGymUseCase {
  const gymsRepository = new PrismaGymsRepository();
  const useCase = new CreateGymUseCase(gymsRepository);

  return useCase;
}
