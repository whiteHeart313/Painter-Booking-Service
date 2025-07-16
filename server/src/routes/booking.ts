import { Router } from 'express';
import { authMiddleware, requireRole } from '../middlewares/auth';
import { container } from '../container';

const router = Router();

// Get handlers from container
const { booking: bookingHandler } = container.handlers;

// Routes
router.post(
  '/booking-request',
  authMiddleware,
  requireRole(['USER']),
  bookingHandler.createBookingRequest
);

router.get(
  '/my-bookings',
  authMiddleware,
  requireRole(['USER']),
  bookingHandler.getMyBookings
);

export default router;
