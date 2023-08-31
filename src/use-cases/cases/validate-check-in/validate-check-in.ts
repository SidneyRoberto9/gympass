import dayjs from 'dayjs';

import { CheckIn } from '@prisma/client';
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates';
import { ResourceNotFoundError } from '@/use-cases/erros/resource-not-found-error';
import { MaxNumberOfCheckInsError } from '@/use-cases/erros/max-number-of-check-in-error';
import { MaxDistanceError } from '@/use-cases/erros/max-distance-error';
import { LateCheckInValidationError } from '@/use-cases/erros/late-check-invalidation-error';
import { GymsRepository } from '@/repositories/gyms-repository';
import { CheckInRepository } from '@/repositories/check-ins-repository';

interface ValidateCheckInUseCaseRequest {
  checkInId: string;
}

interface ValidateCheckInUseCaseResponse {
  checkIn: CheckIn;
}

export class ValidateCheckInUseCase {
  constructor(private checkInsRepository: CheckInRepository) {}

  async execute({
    checkInId,
  }: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseResponse> {
    const checkIn = await this.checkInsRepository.findById(checkInId);

    if (!checkIn) {
      throw new ResourceNotFoundError();
    }

    const actualDate = dayjs(new Date());
    const distanceInMinutesFromCheckInCreation = actualDate.diff(checkIn.created_at, 'minutes');

    if (distanceInMinutesFromCheckInCreation > 20) {
      throw new LateCheckInValidationError();
    }

    checkIn.validated_at = new Date();

    await this.checkInsRepository.save(checkIn);

    return {
      checkIn,
    };
  }
}
