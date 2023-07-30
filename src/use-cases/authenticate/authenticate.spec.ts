import { it, expect, describe } from 'vitest';
import exp from 'constants';
import { hash } from 'bcryptjs';

import { InvalidCredentialsError } from '@/use-cases/erros/invalid-credentials-error';
import { AuthenticateUserCase } from '@/use-cases/authenticate/authenticate';
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-users-repository';

describe('Authenticate Use Case', () => {
  it('should be able to authenticate', async () => {
    const usersRepository = new InMemoryUserRepository();
    const sut = new AuthenticateUserCase(usersRepository);

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
    const usersRepository = new InMemoryUserRepository();
    const sut = new AuthenticateUserCase(usersRepository);

    expect(() =>
      sut.execute({
        email: 'johndoe@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it('should be able to authenticate with wrong email', async () => {
    const usersRepository = new InMemoryUserRepository();
    const sut = new AuthenticateUserCase(usersRepository);

    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
    });

    expect(() =>
      sut.execute({
        email: 'johndoe@example.com',
        password: '123321',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
