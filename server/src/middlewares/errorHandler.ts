import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.error('Error occurred:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
  });

  // Prisma errors
  if (error.name === 'PrismaClientKnownRequestError') {
    res.status(400).json({ message: 'Database error occurred' });
    return;
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    res.status(401).json({ message: 'Invalid token' });
    return;
  }

  if (error.name === 'TokenExpiredError') {
    res.status(401).json({ message: 'Token expired' });
    return;
  }

  // Validation errors
  if (error.name === 'ValidationError') {
    res.status(400).json({ message: error.message });
    return;
  }

  // Default error
  res.status(500).json({
    message:
      process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : error.message,
  });
};
