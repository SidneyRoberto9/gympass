import { SearchGymUseCase } from '@/use-cases/cases/search-gyms/search-gyms';
import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository';

export function makeSearchGymUseCase(): SearchGymUseCase {
  const gymsRepository = new PrismaGymsRepository();
  const useCase = new SearchGymUseCase(gymsRepository);

  return useCase;
}
