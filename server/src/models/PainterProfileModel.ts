import { BaseModel } from './BaseModel';
import { PrismaClient } from '@prisma/client';

export class PainterProfileModel extends BaseModel {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  async findByUserId(userId: string) {
    return await this.prisma.painterProfile.findUnique({
      where: { userId },
      include: {
        user: true,
      },
    });
  }

  async findById(id: string) {
    return await this.prisma.painterProfile.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });
  }

  async create(profileData: {
    userId: string;
    rating?: number;
    totalRatings?: number;
    experience?: string;
    specialties?: string[];
    hourlyRate?: number;
    isActive?: boolean;
  }) {
    return await this.prisma.painterProfile.create({
      data: {
        ...profileData,
        rating: profileData.rating || 0.0,
        totalRatings: profileData.totalRatings || 0,
        specialties: profileData.specialties || [],
        isActive:
          profileData.isActive !== undefined ? profileData.isActive : true,
      },
      include: {
        user: true,
      },
    });
  }

  async update(
    id: string,
    profileData: Partial<{
      rating: number;
      totalRatings: number;
      experience: string;
      specialties: string[];
      hourlyRate: number;
      isActive: boolean;
    }>
  ) {
    return await this.prisma.painterProfile.update({
      where: { id },
      data: profileData,
      include: {
        user: true,
      },
    });
  }

  async findActive() {
    return await this.prisma.painterProfile.findMany({
      where: { isActive: true },
      include: {
        user: true,
      },
    });
  }

  async updateRating(id: string, newRating: number) {
    const profile = await this.prisma.painterProfile.findUnique({
      where: { id },
    });

    if (!profile) {
      throw new Error('Painter profile not found');
    }

    const totalRatings = profile.totalRatings + 1;
    const rating =
      (profile.rating * profile.totalRatings + newRating) / totalRatings;

    return await this.prisma.painterProfile.update({
      where: { id },
      data: {
        rating,
        totalRatings,
      },
    });
  }
}
