import { models } from './models';
import { AuthService } from './services/authService';
import { AvailabilityService } from './services/availabilityService';
import { BookingService } from './services/bookingService';
import { AuthHandler } from './handlers/AuthHandler';
import { AvailabilityHandler } from './handlers/AvailabilityHandler';
import { BookingHandler } from './handlers/BookingHandler';

// Services with dependency injection
export const authService = new AuthService(models.user, models.userRole);
export const availabilityService = new AvailabilityService(models.availability);
export const bookingService = new BookingService(
  models.booking,
  models.availability,
  availabilityService
);

// Handlers with dependency injection
export const authHandler = new AuthHandler(authService);
export const availabilityHandler = new AvailabilityHandler(availabilityService);
export const bookingHandler = new BookingHandler(bookingService);

// Container object for easy access
export const container = {
  services: {
    auth: authService,
    availability: availabilityService,
    booking: bookingService,
  },
  handlers: {
    auth: authHandler,
    availability: availabilityHandler,
    booking: bookingHandler,
  },
  models,
};
