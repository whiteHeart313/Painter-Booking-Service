import { BaseModel } from './BaseModel';
import { PrismaClient } from '@prisma/client';

export class UserRoleModel extends BaseModel {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  async findByName(name: string) {
    return await this.prisma.userRole.findUnique({
      where: { name },
    });
  }

  async findById(id: string) {
    return await this.prisma.userRole.findUnique({
      where: { id },
    });
  }

  async findAll() {
    return await this.prisma.userRole.findMany();
  }

  async create(roleData: { name: string; description?: string }) {
    return await this.prisma.userRole.create({
      data: roleData,
    });
  }
}
