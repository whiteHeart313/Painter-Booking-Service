import { CreateBookingRequest, BookingResponse, BookingStatus, PainterSelectionResult, AlternativeSlot, ServiceResult } from '../../types';
import { AvailabilityService } from './availabilityService';
import { BookingModel, AvailabilityModel } from '../models';

export class BookingService {
  constructor(
    private bookingModel: BookingModel,
    private availabilityModel: AvailabilityModel,
    private availabilityService: AvailabilityService
  ) {}

  async createBookingRequest(userId: string, data: CreateBookingRequest): Promise<ServiceResult<any>> {
    try {
      const requestedStart = new Date(data.requestedStart);
      const requestedEnd = new Date(data.requestedEnd);

      // Validate time range
      if (requestedStart >= requestedEnd) {
        return {
          success: false,
          error: 'Start time must be before end time',
        };
      }

      if (requestedStart < new Date()) {
        return {
          success: false,
          error: 'Cannot book in the past',
        };
      }

      // Create booking request
      const bookingRequest = await this.bookingModel.createBookingRequest({
        userId,
        requestedStart,
        requestedEnd,
        description: data.description,
        address: data.address,
        estimatedHours: data.estimatedHours,
      });

      // Try to find and assign a painter
      const assignment = await this.findBestPainter(requestedStart, requestedEnd);

      if (assignment.success && assignment.data) {
        // Create booking with assigned painter
        const booking = await this.bookingModel.createBooking({
          bookingRequestId: bookingRequest.id,
          painterId: assignment.data.painter.id,
          scheduledStart: requestedStart,
          scheduledEnd: requestedEnd,
          status: BookingStatus.CONFIRMED,
        });

        // Mark availability as booked
        await this.availabilityService.updateAvailabilityStatus(
          assignment.data.availabilitySlot.id,
          true
        );

        // Update booking request status
        await this.bookingModel.updateBookingRequestStatus(bookingRequest.id, BookingStatus.CONFIRMED);

        return {
          success: true,
          data: this.formatBookingResponse(bookingRequest, booking),
        };
      } else {
        // No painter available, suggest alternatives
        const alternatives = await this.findAlternativeSlots(requestedStart, requestedEnd);
        
        return {
          success: false,
          error: 'No painters available for the requested time',
          data: {
            bookingRequest: this.formatBookingResponse(bookingRequest),
            alternatives: alternatives.data || [],
          },
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create booking request',
      };
    }
  }

  async getUserBookings(userId: string): Promise<ServiceResult<BookingResponse[]>> {
    try {
      const bookingRequests = await this.bookingModel.findBookingRequestsByUserId(userId);
      const bookings = bookingRequests.map(req => this.formatBookingResponse(req, req.booking));
      
      return {
        success: true,
        data: bookings,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get user bookings',
      };
    }
  }

  private async findBestPainter(startTime: Date, endTime: Date): Promise<ServiceResult<PainterSelectionResult>> {
    try {
      const availabilitiesResult = await this.availabilityService.getAvailablePainters(startTime, endTime);
      
      if (!availabilitiesResult.success || !availabilitiesResult.data || availabilitiesResult.data.length === 0) {
        return {
          success: false,
          error: 'No painters available',
        };
      }

      // Score painters based on rating and availability
      const scoredPainters = availabilitiesResult.data.map(availability => {
        const painter = availability.painter;
        const ratingScore = painter.rating * 20; // Rating out of 5, multiply by 20 for 100-point scale
        const experienceScore = painter.totalRatings > 0 ? Math.min(painter.totalRatings * 2, 40) : 0;
        const availabilityScore = 40; // Base score for being available

        const totalScore = ratingScore + experienceScore + availabilityScore;

        return {
          painter,
          availabilitySlot: availability,
          score: totalScore,
        };
      });

      // Sort by score descending and return the best painter
      scoredPainters.sort((a, b) => b.score - a.score);
      
      return {
        success: true,
        data: scoredPainters[0],
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to find best painter',
      };
    }
  }

  private async findAlternativeSlots(requestedStart: Date, requestedEnd: Date): Promise<ServiceResult<AlternativeSlot[]>> {
    try {
      const duration = requestedEnd.getTime() - requestedStart.getTime();
      const searchStart = new Date(requestedStart.getTime() - 24 * 60 * 60 * 1000); // 1 day before
      const searchEnd = new Date(requestedStart.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days after

      const availabilities = await this.availabilityModel.findForAlternatives(searchStart, searchEnd);
      const alternatives: AlternativeSlot[] = [];

      for (const availability of availabilities) {
        const availableDuration = availability.endTime.getTime() - availability.startTime.getTime();
        
        // Check if the availability slot is long enough
        if (availableDuration >= duration) {
          const timeDifference = Math.abs(availability.startTime.getTime() - requestedStart.getTime());
          
          alternatives.push({
            startTime: availability.startTime,
            endTime: new Date(availability.startTime.getTime() + duration),
            painter: availability.painter,
            timeDifference: Math.round(timeDifference / (1000 * 60)), // in minutes
          });
        }
      }

      // Sort by time difference (closest to requested time first)
      alternatives.sort((a, b) => a.timeDifference - b.timeDifference);
      
      return {
        success: true,
        data: alternatives.slice(0, 5), // Return top 5 alternatives
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to find alternative slots',
      };
    }
  }

  private formatBookingResponse(bookingRequest: any, booking?: any): BookingResponse {
    return {
      id: bookingRequest.id,
      requestedStart: bookingRequest.requestedStart.toISOString(),
      requestedEnd: bookingRequest.requestedEnd.toISOString(),
      scheduledStart: booking?.scheduledStart?.toISOString(),
      scheduledEnd: booking?.scheduledEnd?.toISOString(),
      status: bookingRequest.status,
      painter: booking?.painter ? {
        id: booking.painter.id,
        firstname: booking.painter.user.firstname,
        lastname: booking.painter.user.lastname,
        rating: booking.painter.rating,
      } : undefined,
      address: bookingRequest.address,
      description: bookingRequest.description,
      estimatedHours: bookingRequest.estimatedHours,
    };
  }
}
