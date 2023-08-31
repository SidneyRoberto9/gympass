import { it, expect, describe, beforeEach } from 'vitest';

import { FetchNearbyGymsUseCase } from '@/use-cases/cases/fetch-nearby-gyms/fetch-nearby-gyms';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';

let gymRepository: InMemoryGymsRepository;
let sut: FetchNearbyGymsUseCase;

describe('Fetch Nearby Gyms Use Case', () => {
  beforeEach(() => {
    gymRepository = new InMemoryGymsRepository();
    sut = new FetchNearbyGymsUseCase(gymRepository);
  });

  it('should be able to fetch nearby gyms', async () => {
    await gymRepository.create({
      title: 'Near Gym',
      latitude: -7.1680282,
      longitude: -34.8734516,
      phone: '',
      description: '',
    });

    await gymRepository.create({
      title: 'Far Gym',
      latitude: -7.2154544,
      longitude: -35.9021861,
      phone: '',
      description: '',
    });

    const { gyms } = await sut.execute({
      userLatitude: -7.1680282,
      userLongitude: -34.8734516,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([
      expect.objectContaining({
        title: 'Near Gym',
      }),
    ]);
  });
});
