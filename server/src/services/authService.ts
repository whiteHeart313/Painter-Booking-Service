import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt';
import { AuthRequest, RegisterRequest, ServiceResult } from '../../types';
import { UserModel, UserRoleModel } from '../models';

export class AuthService {
  constructor(
    private userModel: UserModel,
    private userRoleModel: UserRoleModel
  ) {}

  async login(data: AuthRequest): Promise<ServiceResult<{ user: any; token: string }>> {
    try {
      const user = await this.userModel.findByEmail(data.email);

      if (!user) {
        return {
          success: false,
          error: 'Invalid credentials',
        };
      }

      const isPasswordValid = await bcrypt.compare(data.password, user.password);
      if (!isPasswordValid) {
        return {
          success: false,
          error: 'Invalid credentials',
        };
      }

      const token = generateToken(user);
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      
      return {
        success: true,
        data: {
          user: userWithoutPassword,
          token,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Login failed',
      };
    }
  }

  async register(data: RegisterRequest): Promise<ServiceResult<{ user: any; token: string }>> {
    try {
      const existingUser = await this.userModel.findByEmail(data.email);

      if (existingUser) {
        return {
          success: false,
          error: 'User already exists',
        };
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);

      const user = await this.userModel.create({
        ...data,
        password: hashedPassword,
      });

      const token = generateToken(user);
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      
      return {
        success: true,
        data: {
          user: userWithoutPassword,
          token,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Registration failed',
      };
    }
  }

  async getUserProfile(userId: string): Promise<ServiceResult<any>> {
    try {
      const user = await this.userModel.findById(userId);

      if (!user) {
        return {
          success: false,
          error: 'User not found',
        };
      }

      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      
      return {
        success: true,
        data: userWithoutPassword,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get user profile',
      };
    }
  }
}
