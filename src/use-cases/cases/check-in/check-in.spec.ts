import { vi, it, expect, describe, beforeEach, afterEach } from 'vitest';

import { Decimal } from '@prisma/client/runtime/library';
import { MaxNumberOfCheckInsError } from '@/use-cases/erros/max-number-of-check-in-error';
import { MaxDistanceError } from '@/use-cases/erros/max-distance-error';
import { CheckInUseCase } from '@/use-cases/cases/check-in/check-in';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { InMemoryCheckInRepository } from '@/repositories/in-memory/in-memory-check-in-repository';

let checkInRepository: InMemoryCheckInRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe('CheckIn Use Case', () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(checkInRepository, gymsRepository);

    await gymsRepository.create({
      id: 'gym-01',
      title: 'JavaScript Gym',
      latitude: -7.1680282,
      longitude: -34.8734516,
      phone: '',
      description: '',
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'useId',
      userLatitude: -7.1680282,
      userLongitude: -34.8734516,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('should not be able to check in twice in the same day', async () => {
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
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
  });

  it('should not be able to check in twice but in different day', async () => {
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
    ).rejects.toBeInstanceOf(MaxDistanceError);
  });
});
