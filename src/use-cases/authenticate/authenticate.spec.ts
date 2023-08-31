import { it, expect, describe, beforeEach } from 'vitest';
import exp from 'constants';
import { hash } from 'bcryptjs';

import { InvalidCredentialsError } from '@/use-cases/erros/invalid-credentials-error';
import { AuthenticateUserCase } from '@/use-cases/authenticate/authenticate';
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-users-repository';

let usersRepository: InMemoryUserRepository;
let sut: AuthenticateUserCase;

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUserRepository();
    sut = new AuthenticateUserCase(usersRepository);
  });

  it('should be able to authenticate', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
    });

    const { user } = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it('should be able to authenticate with wrong email', async () => {
    await expect(() =>
      sut.execute({
        email: 'johndoe@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it('should be able to authenticate with wrong email', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
    });

    await expect(() =>
      sut.execute({
        email: 'johndoe@example.com',
        password: '123321',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
