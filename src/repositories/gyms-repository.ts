import { Prisma, Gym } from '@prisma/client';

export interface GymsRepository {
  findById(id: string): Promise<Gym | null>;
  findManyNearby(params: FindManyNearbyParams): Promise<Gym[]>;
  create(gym: Prisma.GymCreateInput): Promise<Gym>;
  searchMany(query: string, page: number): Promise<Gym[]>;
}

export interface FindManyNearbyParams {
  latitude: number;
  longitude: number;
}
