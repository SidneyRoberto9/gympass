import { GetUserProfileCase } from '@/use-cases/cases/get-user-profile/get-user-profile';
import { PrismaUserRepository } from '@/repositories/prisma/prisma-users-repository';

export function makeGetUserProfileUseCase(): GetUserProfileCase {
  const usersRepository = new PrismaUserRepository();
  const useCase = new GetUserProfileCase(usersRepository);

  return useCase;
}
