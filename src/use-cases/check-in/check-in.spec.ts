import { vi, it, expect, describe, beforeEach, afterEach } from 'vitest';

import { Decimal } from '@prisma/client/runtime/library';
import { CheckInUseCase } from '@/use-cases/check-in/check-in';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { InMemoryCheckInRepository } from '@/repositories/in-memory/in-memory-check-in-repository';

let checkInRepository: InMemoryCheckInRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe('CheckIn Use Case', () => {
  beforeEach(() => {
    checkInRepository = new InMemoryCheckInRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(checkInRepository, gymsRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be able to check in', async () => {
    gymsRepository.items.push({
      id: 'gym-01',
      title: 'JavaScript Gym',
      latitude: new Decimal(-7.1680282),
      longitude: new Decimal(-34.8734516),
      phone: '',
      description: '',
    });

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'useId',
      userLatitude: -7.1680282,
      userLongitude: -34.8734516,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('should not be able to check in twice in the same day', async () => {
    gymsRepository.items.push({
      id: 'gym-01',
      title: 'JavaScript Gym',
      latitude: new Decimal(-7.1680282),
      longitude: new Decimal(-34.8734516),
      phone: '',
      description: '',
    });

    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.execute({
      gymId: 'gym-01',
      userId: 'useId',
      userLatitude: -7.1680282,
      userLongitude: -34.8734516,
    });

    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'useId',
        userLatitude: -7.1680282,
        userLongitude: -34.8734516,
      }),
    ).rejects.toBeInstanceOf(Error);
  });

  it('should not be able to check in twice but in different day', async () => {
    gymsRepository.items.push({
      id: 'gym-01',
      title: 'JavaScript Gym',
      latitude: new Decimal(-7.1680282),
      longitude: new Decimal(-34.8734516),
      phone: '',
      description: '',
    });

    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.execute({
      gymId: 'gym-01',
      userId: 'useId',
      userLatitude: -7.1680282,
      userLongitude: -34.8734516,
    });

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'useId',
      userLatitude: -7.1680282,
      userLongitude: -34.8734516,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('should not be able to check in ont distant gym', async () => {
    gymsRepository.items.push({
      id: 'gym-02',
      title: 'JavaScript Gym',
      phone: '',
      description: '',
      latitude: new Decimal(-7.118237),
      longitude: new Decimal(-34.8245258),
    });

    await expect(() =>
      sut.execute({
        gymId: 'gym-02',
        userId: 'useId',
        userLatitude: -7.1680282,
        userLongitude: -34.8734516,
      }),
    ).rejects.toBeInstanceOf(Error);
  });
});
