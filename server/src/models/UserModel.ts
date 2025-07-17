import { BaseModel } from './BaseModel';
import { PrismaClient } from '@prisma/client';

export class UserModel extends BaseModel {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email },
      include: {
        role: true,
        painterProfile: true,
      },
    });
  }

  async findById(id: string) {
    return await this.prisma.user.findUnique({
      where: { id },
      include: {
        role: true,
        painterProfile: true,
      },
    });
  }

  async create(userData: {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    roleId: string;
    address?: string;
    phone?: string;
  }) {
    return await this.prisma.user.create({
      data: {
        ...userData,
        isVerified: false,
      },
      include: {
        role: true,
      },
    });
  }

  async update(
    id: string,
    userData: Partial<{
      firstname: string;
      lastname: string;
      email: string;
      password: string;
      address: string;
      phone: string;
      isVerified: boolean;
    }>
  ) {
    return await this.prisma.user.update({
      where: { id },
      data: userData,
      include: {
        role: true,
        painterProfile: true,
      },
    });
  }
}
