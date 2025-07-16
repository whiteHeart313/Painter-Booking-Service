import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth';
import { container } from '../container';

const router = Router();

// Get handlers from container
const { auth: authHandler } = container.handlers;

// Routes
router.post('/login', authHandler.login);
router.post('/register', authHandler.register);
router.get('/profile', authMiddleware, authHandler.getProfile);

export default router;
