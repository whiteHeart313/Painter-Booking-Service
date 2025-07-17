import { Request, Response } from 'express';
import { BaseHandler } from './BaseHandler';
import { AuthService } from '../services/authService';
import { authSchema, registerSchema } from '../utils/validation';
import { AuthRequest, RegisterRequest } from '../../types';

export class AuthHandler extends BaseHandler {
  constructor(private authService: AuthService) {
    super();
  }

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      // Validate request body
      const { error } = authSchema.validate(req.body);
      if (error) {
        res.status(400).json({
          success: false,
          error: 'Validation error',
          message: error.details.map((detail) => detail.message).join(', '),
        });
        return;
      }

      const authData: AuthRequest = req.body;
      const result = await this.authService.login(authData);
      this.sendResponse(res, result);
    } catch (error) {
      this.handleError(res, error as Error);
    }
  };

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      // Validate request body
      const { error } = registerSchema.validate(req.body);
      if (error) {
        res.status(400).json({
          success: false,
          error: 'Validation error',
          message: error.details.map((detail) => detail.message).join(', '),
        });
        return;
      }

      const registerData: RegisterRequest = req.body;
      const result = await this.authService.register(registerData);
      this.sendResponse(res, result);
    } catch (error) {
      this.handleError(res, error as Error);
    }
  };

  getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'User not authenticated',
        });
        return;
      }

      const result = await this.authService.getUserProfile(req.user.id);
      this.sendResponse(res, result);
    } catch (error) {
      this.handleError(res, error as Error);
    }
  };
}
