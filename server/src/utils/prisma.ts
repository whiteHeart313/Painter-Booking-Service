import { prismaClient } from '../models/BaseModel';

export const prisma = prismaClient;

// Connection health check
export const checkDatabaseConnection = async () => {
  try {
    await prismaClient.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
};
