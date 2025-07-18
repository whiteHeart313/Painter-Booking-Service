import { Request, Response } from 'express';
import { BaseHandler } from './BaseHandler';
import { BookingService } from '../services/bookingService';
import { createBookingRequestSchema } from '../utils/validation';
import { CreateBookingRequest } from '../../types';

export class BookingHandler extends BaseHandler {
  constructor(private bookingService: BookingService) {
    super();
  }

  createBookingRequest = async (req: Request, res: Response): Promise<void> => {
    try {
      // Validate request body
      const { error } = createBookingRequestSchema.validate(req.body);
      if (error) {
        res.status(400).json({
          success: false,
          error: 'Validation error',
          message: error.details.map((detail) => detail.message).join(', '),
        });
        return;
      }

      // Check if user is authenticated
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'User not authenticated',
        });
        return;
      }

      const bookingData: CreateBookingRequest = req.body;
      const userId = req.user.id;

      const result = await this.bookingService.createBookingRequest(
        userId,
        bookingData
      );
      this.sendResponse(res, result);
    } catch (error) {
      this.handleError(res, error as Error);
    }
  };

  getMyBookings = async (req: Request, res: Response): Promise<void> => {
    try {
      // Check if user is authenticated
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'User not authenticated',
        });
        return;
      }

      const userId = req.user.id;
      const result = await this.bookingService.getUserBookings(userId);
      this.sendResponse(res, result);
    } catch (error) {
      this.handleError(res, error as Error);
    }
  };

  getMyAppointments = async (req: Request, res: Response): Promise<void> => {
    try {
      // Check if user is authenticated and has painter profile
      if (!req.user?.painterProfile) {
        res.status(403).json({
          success: false,
          error: 'Only painters can view appointments',
        });
        return;
      }

      const painterId = req.user.painterProfile.id;
      const result = await this.bookingService.getPainterAppointments(painterId);
      this.sendResponse(res, result);
    } catch (error) {
      this.handleError(res, error as Error);
    }
  };
}
