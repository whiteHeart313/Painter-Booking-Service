import { Router } from 'express';
import { authMiddleware, requireRole } from '../middlewares/auth';
import { container } from '../container';

const router = Router();

// Get handlers from container
const { availability: availabilityHandler } = container.handlers;

// Routes
router.post(
  '/',
  authMiddleware,
  requireRole(['PAINTER']),
  availabilityHandler.createAvailability
);

router.get(
  '/me',
  authMiddleware,
  requireRole(['PAINTER']),
  availabilityHandler.getMyAvailability
);

router.delete(
  '/:id',
  authMiddleware,
  requireRole(['PAINTER']),
  availabilityHandler.deleteAvailability
);

export default router;
