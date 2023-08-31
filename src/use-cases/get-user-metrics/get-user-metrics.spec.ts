import { it, expect, describe, beforeEach } from 'vitest';

import { GetUserMetricsUseCase } from '@/use-cases/get-user-metrics/get-user-metrics';
import { InMemoryCheckInRepository } from '@/repositories/in-memory/in-memory-check-in-repository';

let checkInRepository: InMemoryCheckInRepository;
let sut: GetUserMetricsUseCase;

describe('Get User Metrics Use Case', () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInRepository();
    sut = new GetUserMetricsUseCase(checkInRepository);
  });

  it('should be able to get check-ins count from metrics', async () => {
    await checkInRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    });

    await checkInRepository.create({
      gym_id: 'gym-02',
      user_id: 'user-01',
    });

    const { checkInsCount } = await sut.execute({
      userId: 'user-01',
    });

    expect(checkInsCount).toEqual(2);
  });
});
