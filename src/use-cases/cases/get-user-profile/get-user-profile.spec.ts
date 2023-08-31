import { it, expect, describe, beforeEach } from 'vitest';
import { hash } from 'bcryptjs';

import { GetUserProfileCase } from '@/use-cases/get-user-profile/get-user-profile';
import { ResourceNotFoundError } from '@/use-cases/erros/resource-not-found-error';
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-users-repository';

let usersRepository: InMemoryUserRepository;
let sut: GetUserProfileCase;

describe('Get User Profile Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUserRepository();
    sut = new GetUserProfileCase(usersRepository);
  });

  it('should be able to get user profile', async () => {
    const createdUser = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
    });

    const { user } = await sut.execute({
      userId: createdUser.id,
    });

    expect(user.name).toEqual('John Doe');
  });

  it('should not be able to get user profile', async () => {
    await expect(() =>
      sut.execute({
        userId: 'no-existing-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
