import { prismaClient } from './BaseModel';
import { UserModel } from './UserModel';
import { UserRoleModel } from './UserRoleModel';
import { AvailabilityModel } from './AvailabilityModel';
import { BookingModel } from './BookingModel';
import { PainterProfileModel } from './PainterProfileModel';

// Singleton instances of all models using dependency injection
export const userModel = new UserModel(prismaClient);
export const userRoleModel = new UserRoleModel(prismaClient);
export const availabilityModel = new AvailabilityModel(prismaClient);
export const bookingModel = new BookingModel(prismaClient);
export const painterProfileModel = new PainterProfileModel(prismaClient);

// Export models as a single object for easier injection
export const models = {
  user: userModel,
  userRole: userRoleModel,
  availability: availabilityModel,
  booking: bookingModel,
  painterProfile: painterProfileModel,
};

// Export model classes for type checking
export {
  UserModel,
  UserRoleModel,
  AvailabilityModel,
  BookingModel,
  PainterProfileModel,
};
export { prismaClient };
