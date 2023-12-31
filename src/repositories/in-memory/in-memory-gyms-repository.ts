import { randomUUID } from 'crypto';

import { GetResult } from '@prisma/client/runtime/library';
import { Prisma, Gym } from '@prisma/client';
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates';
import { GymsRepository, FindManyNearbyParams } from '@/repositories/gyms-repository';

export class InMemoryGymsRepository implements GymsRepository {
  public items: Gym[] = [];

  async create(data: Prisma.GymCreateInput) {
    const gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      phone: data.phone ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
      description: data.description ?? null,
    };

    this.items.push(gym);

    return gym;
  }

  async findManyNearby(params: FindManyNearbyParams) {
    return this.items.filter((gym) => {
      const distance = getDistanceBetweenCoordinates(
        {
          latitude: params.latitude,
          longitude: params.longitude,
        },
        {
          latitude: gym.latitude.toNumber(),
          longitude: gym.longitude.toNumber(),
        },
      );

      return distance <= 10;
    });
  }

  async findById(id: string) {
    const gym = this.items.find((gym) => gym.id === id);

    if (!gym) {
      return null;
    }

    return gym;
  }

  async searchMany(query: string, page: number) {
    return this.items.filter((gym) => gym.title.includes(query)).slice((page - 1) * 20, page * 20);
  }
}
