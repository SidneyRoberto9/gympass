import { ValidateCheckInUseCase } from '@/use-cases/cases/validate-check-in/validate-check-in';
import { PrismaCheckInRepository } from '@/repositories/prisma/prisma-check-in-repository';

export function makeValidateCheckInUseCase(): ValidateCheckInUseCase {
  const checkInRepository = new PrismaCheckInRepository();
  const useCase = new ValidateCheckInUseCase(checkInRepository);

  return useCase;
}
