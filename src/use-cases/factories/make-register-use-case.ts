import { RegisterUseCase } from '@/use-cases/register/register';
import { PrismaUserRepository } from '@/repositories/prisma/prisma-users-repository';

export function makeRegisterUseCase(): RegisterUseCase {
  const prismaUserRepository = new PrismaUserRepository();
  const registerUseCase = new RegisterUseCase(prismaUserRepository);

  return registerUseCase;
}
