import { it, expect, describe, beforeEach } from 'vitest';

import { CreateGymUseCase } from '@/use-cases/cases/create-gym/create-gym';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';

let gymRepository: InMemoryGymsRepository;
let sut: CreateGymUseCase;

describe('Create Gym Use Case', () => {
  beforeEach(() => {
    gymRepository = new InMemoryGymsRepository();
    sut = new CreateGymUseCase(gymRepository);
  });

  it('should be able to create gym', async () => {
    const { gym } = await sut.execute({
      title: 'JavaScript Gym',
      latitude: -7.1680282,
      longitude: -34.8734516,
      phone: '',
      description: '',
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
