import { Request, Response } from 'express';
import { BaseHandler } from './BaseHandler';
import { AvailabilityService } from '../services/availabilityService';
import { createAvailabilitySchema } from '../utils/validation';
import { CreateAvailabilityRequest } from '../../types';

export class AvailabilityHandler extends BaseHandler {
  constructor(private availabilityService: AvailabilityService) {
    super();
  }

  createAvailability = async (req: Request, res: Response): Promise<void> => {
    try {
      // Validate request body
      const { error } = createAvailabilitySchema.validate(req.body);
      if (error) {
        res.status(400).json({
          success: false,
          error: 'Validation error',
          message: error.details.map(detail => detail.message).join(', '),
        });
        return;
      }

      // Check if user is authenticated and has painter profile
      if (!req.user?.painterProfile) {
        res.status(403).json({
          success: false,
          error: 'Only painters can create availability',
        });
        return;
      }

      const availabilityData: CreateAvailabilityRequest = req.body;
      const painterId = req.user.painterProfile.id;
      
      const result = await this.availabilityService.createAvailability(painterId, availabilityData);
      this.sendResponse(res, result);
    } catch (error) {
      this.handleError(res, error as Error);
    }
  };

  getMyAvailability = async (req: Request, res: Response): Promise<void> => {
    try {
      // Check if user is authenticated and has painter profile
      if (!req.user?.painterProfile) {
        res.status(403).json({
          success: false,
          error: 'Only painters can view availability',
        });
        return;
      }

      const painterId = req.user.painterProfile.id;
      const result = await this.availabilityService.getPainterAvailability(painterId);
      this.sendResponse(res, result);
    } catch (error) {
      this.handleError(res, error as Error);
    }
  };

  deleteAvailability = async (req: Request, res: Response): Promise<void> => {
    try {
      // Check if user is authenticated and has painter profile
      if (!req.user?.painterProfile) {
        res.status(403).json({
          success: false,
          error: 'Only painters can delete availability',
        });
        return;
      }

      const { id } = req.params;
      if (!id) {
        res.status(400).json({
          success: false,
          error: 'Availability ID is required',
        });
        return;
      }

      const painterId = req.user.painterProfile.id;
      const result = await this.availabilityService.deleteAvailability(id, painterId);
      this.sendResponse(res, result);
    } catch (error) {
      this.handleError(res, error as Error);
    }
  };
}
