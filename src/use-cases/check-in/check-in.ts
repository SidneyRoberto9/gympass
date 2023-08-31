import { CheckIn } from '@prisma/client';
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates';
import { ResourceNotFoundError } from '@/use-cases/erros/resource-not-found-error';
import { MaxNumberOfCheckInsError } from '@/use-cases/erros/max-number-of-check-in-error';
import { MaxDistanceError } from '@/use-cases/erros/max-distance-error';
import { GymsRepository } from '@/repositories/gyms-repository';
import { CheckInRepository } from '@/repositories/check-ins-repository';

interface CheckInUseCaseRequest {
  userId: string;
  gymId: string;
  userLatitude: number;
  userLongitude: number;
}

interface CheckInUseCaseResponse {
  checkIn: CheckIn;
}

export class CheckInUseCase {
  constructor(
    private checkInsRepository: CheckInRepository,
    private gymRepository: GymsRepository,
  ) {}

  async execute({
    gymId,
    userId,
    userLatitude,
    userLongitude,
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    const MAX_DISTANCE_IN_KILOMETERS = 0.1;

    const gym = await this.gymRepository.findById(gymId);

    if (!gym) {
      throw new ResourceNotFoundError();
    }

    const distance = getDistanceBetweenCoordinates(
      {
        latitude: userLatitude,
        longitude: userLongitude,
      },
      {
        latitude: gym.latitude.toNumber(),
        longitude: gym.longitude.toNumber(),
      },
    );

    if (distance > MAX_DISTANCE_IN_KILOMETERS) {
      throw new MaxDistanceError();
    }

    const checkInOnSameDate = await this.checkInsRepository.findByUserIdOnDate(userId, new Date());

    if (checkInOnSameDate) {
      throw new MaxNumberOfCheckInsError();
    }

    const checkIn = await this.checkInsRepository.create({
      gym_id: gymId,
      user_id: userId,
      created_at: new Date(),
    });

    return {
      checkIn,
    };
  }
}
