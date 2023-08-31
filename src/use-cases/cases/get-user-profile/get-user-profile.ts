import { User } from '@prisma/client';
import { ResourceNotFoundError } from '@/use-cases/erros/resource-not-found-error';
import { UsersRepository } from '@/repositories/users-repository';

interface GetUserProfileCaseRequest {
  userId: string;
}

interface GetUserProfileCaseResponse {
  user: User;
}

export class GetUserProfileCase {
  constructor(private userRepository: UsersRepository) {}

  async execute({ userId }: GetUserProfileCaseRequest): Promise<GetUserProfileCaseResponse> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new ResourceNotFoundError();
    }

    return {
      user,
    };
  }
}
