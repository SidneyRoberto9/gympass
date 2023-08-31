import { vi, it, expect, describe, beforeEach, afterEach } from 'vitest';

import { ResourceNotFoundError } from '@/use-cases/erros/resource-not-found-error';
import { LateCheckInValidationError } from '@/use-cases/erros/late-check-invalidation-error';
import { ValidateCheckInUseCase } from '@/use-cases/cases/validate-check-in/validate-check-in';
import { InMemoryCheckInRepository } from '@/repositories/in-memory/in-memory-check-in-repository';

let checkInRepository: InMemoryCheckInRepository;
let sut: ValidateCheckInUseCase;

describe('Validate CheckIn Use Case', () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInRepository();
    sut = new ValidateCheckInUseCase(checkInRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be able to validate check-in', async () => {
    const createCheckIn = await checkInRepository.create({
      gym_id: 'gym-01',
      user_id: 'useId',
    });

    const { checkIn } = await sut.execute({
      checkInId: createCheckIn.id,
    });

    expect(checkIn.validated_at).toEqual(expect.any(Date));
    expect(checkInRepository.items[0].validated_at).toEqual(expect.any(Date));
  });

  it('should not be able to validate an inexistent check-in', async () => {
    await expect(() =>
      sut.execute({
        checkInId: 'inexistent-check-in-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to validate the check-in after 20 minutes of its creation', async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 13, 40));

    const createCheckIn = await checkInRepository.create({
      gym_id: 'gym-01',
      user_id: 'useId',
    });

    const twentyOneMinutesInMs = 1000 * 60 * 21;

    vi.advanceTimersByTime(twentyOneMinutesInMs);

    await expect(() =>
      sut.execute({
        checkInId: createCheckIn.id,
      }),
    ).rejects.toBeInstanceOf(LateCheckInValidationError);
  });
});
