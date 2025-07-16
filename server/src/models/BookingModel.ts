import { BaseModel } from './BaseModel';
import { PrismaClient, BookingStatus } from '@prisma/client';

export class BookingModel extends BaseModel {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  async createBookingRequest(requestData: {
    userId: string;
    requestedStart: Date;
    requestedEnd: Date;
    description?: string;
    address: string;
    estimatedHours?: number;
  }) {
    return await this.prisma.bookingRequest.create({
      data: {
        ...requestData,
        status: BookingStatus.PENDING,
      },
    });
  }

  async createBooking(bookingData: {
    bookingRequestId: string;
    painterId: string;
    scheduledStart: Date;
    scheduledEnd: Date;
    status?: BookingStatus;
  }) {
    return await this.prisma.booking.create({
      data: {
        ...bookingData,
        status: bookingData.status || BookingStatus.CONFIRMED,
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

  async updateBookingRequestStatus(id: string, status: BookingStatus) {
    return await this.prisma.bookingRequest.update({
      where: { id },
      data: { status },
    });
  }

  async findBookingRequestsByUserId(userId: string) {
    return await this.prisma.bookingRequest.findMany({
      where: { userId },
      include: {
        booking: {
          include: {
            painter: {
              include: {
                user: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findBookingsByPainterId(painterId: string) {
    return await this.prisma.booking.findMany({
      where: { painterId },
      include: {
        bookingRequest: {
          include: {
            user: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findBookingRequestById(id: string) {
    return await this.prisma.bookingRequest.findUnique({
      where: { id },
      include: {
        booking: {
          include: {
            painter: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });
  }

  async updateBookingStatus(id: string, status: BookingStatus) {
    return await this.prisma.booking.update({
      where: { id },
      data: { status },
    });
  }
}
