import { BaseModel } from './BaseModel';
import { PrismaClient } from '@prisma/client';

export class AvailabilityModel extends BaseModel {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  async create(availabilityData: {
    painterId: string;
    startTime: Date;
    endTime: Date;
    isBooked?: boolean;
  }) {
    return await this.prisma.availability.create({
      data: {
        ...availabilityData,
        isBooked: availabilityData.isBooked || false,
      },
    });
  }

  async findOverlapping(painterId: string, startTime: Date, endTime: Date) {
    return await this.prisma.availability.findFirst({
      where: {
        painterId,
        AND: [
          { startTime: { lt: endTime } },
          { endTime: { gt: startTime } },
        ],
      },
    });
  }

  async findByPainterId(painterId: string) {
    return await this.prisma.availability.findMany({
      where: {
        painterId,
        startTime: { gte: new Date() },
      },
      orderBy: { startTime: 'asc' },
    });
  }

  async findAvailablePainters(startTime: Date, endTime: Date) {
    return await this.prisma.availability.findMany({
      where: {
        isBooked: false,
        startTime: { lte: startTime },
        endTime: { gte: endTime },
      },
      include: {
        painter: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async updateBookingStatus(id: string, isBooked: boolean) {
    return await this.prisma.availability.update({
      where: { id },
      data: { isBooked },
    });
  }

  async findById(id: string) {
    return await this.prisma.availability.findUnique({
      where: { id },
    });
  }

  async findByIdAndPainterId(id: string, painterId: string) {
    return await this.prisma.availability.findFirst({
      where: {
        id,
        painterId,
      },
    });
  }

  async delete(id: string) {
    return await this.prisma.availability.delete({
      where: { id },
    });
  }

  async findForAlternatives(searchStart: Date, searchEnd: Date) {
    return await this.prisma.availability.findMany({
      where: {
        isBooked: false,
        startTime: { gte: searchStart, lte: searchEnd },
      },
      include: {
        painter: {
          include: {
            user: true,
          },
        },
      },
      orderBy: { startTime: 'asc' },
    });
  }
}
