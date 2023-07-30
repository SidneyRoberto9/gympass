import { compare } from 'bcryptjs';

import { User } from '@prisma/client';
import { InvalidCredentialsError } from '@/use-cases/erros/invalid-credentials-error';
import { UsersRepository } from '@/repositories/users-repository';

interface AuthenticateUserCaseRequest {
  email: string;
  password: string;
}

interface AuthenticateUserCaseResponse {
  user: User;
}

export class AuthenticateUserCase {
  constructor(private userRepository: UsersRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateUserCaseRequest): Promise<AuthenticateUserCaseResponse> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const doesPasswordMatch = await compare(password, user.password_hash);

    if (!doesPasswordMatch) {
      throw new InvalidCredentialsError();
    }

    return {
      user,
    };
  }
}
