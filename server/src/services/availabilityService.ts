import { CreateAvailabilityRequest, AvailabilityResponse, ServiceResult } from '../../types';
import { AvailabilityModel } from '../models';

export class AvailabilityService {
  constructor(private availabilityModel: AvailabilityModel) {}

  async createAvailability(painterId: string, data: CreateAvailabilityRequest): Promise<ServiceResult<AvailabilityResponse>> {
    try {
      const startTime = new Date(data.startTime);
      const endTime = new Date(data.endTime);

      // Validate time range
      if (startTime >= endTime) {
        return {
          success: false,
          error: 'Start time must be before end time',
        };
      }

      if (startTime < new Date()) {
        return {
          success: false,
          error: 'Cannot create availability in the past',
        };
      }

      // Check for overlapping availability
      const existingAvailability = await this.availabilityModel.findOverlapping(painterId, startTime, endTime);

      if (existingAvailability) {
        return {
          success: false,
          error: 'Availability overlaps with existing slot',
        };
      }

      const availability = await this.availabilityModel.create({
        painterId,
        startTime,
        endTime,
        isBooked: false,
      });

      return {
        success: true,
        data: this.formatAvailabilityResponse(availability),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create availability',
      };
    }
  }

  async getPainterAvailability(painterId: string): Promise<ServiceResult<AvailabilityResponse[]>> {
    try {
      const availabilities = await this.availabilityModel.findByPainterId(painterId);
      return {
        success: true,
        data: availabilities.map(this.formatAvailabilityResponse),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get painter availability',
      };
    }
  }

  async getAvailablePainters(startTime: Date, endTime: Date): Promise<ServiceResult<any[]>> {
    try {
      const availabilities = await this.availabilityModel.findAvailablePainters(startTime, endTime);
      return {
        success: true,
        data: availabilities,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get available painters',
      };
    }
  }

  async updateAvailabilityStatus(availabilityId: string, isBooked: boolean): Promise<ServiceResult<any>> {
    try {
      const availability = await this.availabilityModel.updateBookingStatus(availabilityId, isBooked);
      return {
        success: true,
        data: availability,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update availability status',
      };
    }
  }

  async deleteAvailability(availabilityId: string, painterId: string): Promise<ServiceResult<{ message: string }>> {
    try {
      const availability = await this.availabilityModel.findByIdAndPainterId(availabilityId, painterId);

      if (!availability) {
        return {
          success: false,
          error: 'Availability not found',
        };
      }

      if (availability.isBooked) {
        return {
          success: false,
          error: 'Cannot delete booked availability',
        };
      }

      await this.availabilityModel.delete(availabilityId);

      return {
        success: true,
        data: { message: 'Availability deleted successfully' },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete availability',
      };
    }
  }

  private formatAvailabilityResponse(availability: any): AvailabilityResponse {
    return {
      id: availability.id,
      startTime: availability.startTime.toISOString(),
      endTime: availability.endTime.toISOString(),
      isBooked: availability.isBooked,
    };
  }
}
