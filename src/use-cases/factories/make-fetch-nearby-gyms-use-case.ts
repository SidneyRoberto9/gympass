import { FetchNearbyGymsUseCase } from '@/use-cases/cases/fetch-nearby-gyms/fetch-nearby-gyms';
import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository';

export function makeFetchNearbyGymsUseCase(): FetchNearbyGymsUseCase {
  const gymsRepository = new PrismaGymsRepository();
  const useCase = new FetchNearbyGymsUseCase(gymsRepository);

  return useCase;
}
