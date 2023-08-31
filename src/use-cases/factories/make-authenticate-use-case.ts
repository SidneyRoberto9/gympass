import { AuthenticateUserCase } from '@/use-cases/authenticate/authenticate';
import { PrismaUserRepository } from '@/repositories/prisma/prisma-users-repository';

export function makeAuthenticateUseCase(): AuthenticateUserCase {
  const usersRepository = new PrismaUserRepository();
  const authenticateUserCase = new AuthenticateUserCase(usersRepository);

  return authenticateUserCase;
}
