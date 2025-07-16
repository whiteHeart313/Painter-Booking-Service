import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create user roles
  const userRole = await prisma.userRole.upsert({
    where: { name: 'USER' },
    update: {},
    create: {
      name: 'USER',
      description: 'Regular user who can book painting services',
    },
  });

  const painterRole = await prisma.userRole.upsert({
    where: { name: 'PAINTER' },
    update: {},
    create: {
      name: 'PAINTER',
      description: 'Painter who provides painting services',
    },
  });

  // Create sample users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const user1 = await prisma.user.upsert({
    where: { email: 'Ammar.Hamed@example.com' },
    update: {},
    create: {
      firstname: 'Ammar',
      lastname: 'Hamed',
      email: 'Ammar.Hamed@example.com',
      password: hashedPassword,
      roleId: userRole.id,
      address: '123 Main St, City, Country',
      phone: '+1234567890',
      isVerified: true,
    },
  });

  const painter1 = await prisma.user.upsert({
    where: { email: 'jane.painter@example.com' },
    update: {},
    create: {
      firstname: 'Jane',
      lastname: 'Smith',
      email: 'jane.painter@example.com',
      password: hashedPassword,
      roleId: painterRole.id,
      address: '456 Artist Ave, City, Country',
      phone: '+1234567891',
      isVerified: true,
    },
  });

  const painter2 = await prisma.user.upsert({
    where: { email: 'bob.painter@example.com' },
    update: {},
    create: {
      firstname: 'Bob',
      lastname: 'Wilson',
      email: 'bob.painter@example.com',
      password: hashedPassword,
      roleId: painterRole.id,
      address: '789 Brush Blvd, City, Country',
      phone: '+1234567892',
      isVerified: true,
    },
  });

  // Create painter profiles
  const painterProfile1 = await prisma.painterProfile.upsert({
    where: { userId: painter1.id },
    update: {},
    create: {
      userId: painter1.id,
      rating: 4.5,
      totalRatings: 25,
      experience: '5 years of professional painting',
      specialties: ['Interior', 'Exterior', 'Commercial'],
      hourlyRate: 35.0,
      isActive: true,
    },
  });

  const painterProfile2 = await prisma.painterProfile.upsert({
    where: { userId: painter2.id },
    update: {},
    create: {
      userId: painter2.id,
      rating: 4.8,
      totalRatings: 40,
      experience: '8 years of professional painting',
      specialties: ['Interior', 'Decorative', 'Restoration'],
      hourlyRate: 45.0,
      isActive: true,
    },
  });

  // Create sample availability slots
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(9, 0, 0, 0);

  const tomorrowEnd = new Date(tomorrow);
  tomorrowEnd.setHours(17, 0, 0, 0);

  await prisma.availability.createMany({
    data: [
      {
        painterId: painterProfile1.id,
        startTime: tomorrow,
        endTime: tomorrowEnd,
        isBooked: false,
      },
      {
        painterId: painterProfile2.id,
        startTime: tomorrow,
        endTime: tomorrowEnd,
        isBooked: false,
      },
    ],
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
