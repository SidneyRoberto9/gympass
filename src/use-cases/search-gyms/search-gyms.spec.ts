import { it, expect, describe, beforeEach } from 'vitest';

import { SearchGymUseCase } from '@/use-cases/search-gyms/search-gyms';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';

let gymRepository: InMemoryGymsRepository;
let sut: SearchGymUseCase;

describe('Search Gym Use Case', () => {
  beforeEach(() => {
    gymRepository = new InMemoryGymsRepository();
    sut = new SearchGymUseCase(gymRepository);
  });

  it('should be able to search for gyms', async () => {
    await gymRepository.create({
      title: 'JavaScript Gym',
      latitude: -7.1680282,
      longitude: -34.8734516,
      phone: '',
      description: '',
    });

    await gymRepository.create({
      title: 'TypeScript Gym',
      latitude: -7.1680282,
      longitude: -34.8734516,
      phone: '',
      description: '',
    });

    const { gyms } = await sut.execute({
      query: 'JavaScript',
      page: 1,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([
      expect.objectContaining({
        title: 'JavaScript Gym',
      }),
    ]);
  });

  it('should be able to search paginated gyms', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymRepository.create({
        title: `JavaScript Gym ${i}`,
        latitude: -7.1680282,
        longitude: -34.8734516,
        phone: null,
        description: null,
      });
    }

    const { gyms } = await sut.execute({
      query: 'JavaScript',
      page: 2,
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({
        title: 'JavaScript Gym 21',
      }),
      expect.objectContaining({
        title: 'JavaScript Gym 22',
      }),
    ]);
  });
});
