import { Prisma, CheckIn } from '@prisma/client';

export interface CheckInRepository {
  save(checkIn: CheckIn): Promise<CheckIn>;
  findById(id: string): Promise<CheckIn | null>;
  countByUserId(userId: string): Promise<number>;
  findManyByUserId(userId: string, page: number): Promise<CheckIn[]>;
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>;
  findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>;
}
