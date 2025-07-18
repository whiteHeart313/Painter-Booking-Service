import type { CleaningBookingRequest, CleaningBooking, BookingResponse, CreateBookingRequest } from '../types';
import { getCookie } from '../utils/cookies';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export class BookingService {
  /**
   * Get authentication headers
   */
  private static getAuthHeaders() {
    const token = getCookie('auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }
  /**
   * Submit a cleaning service booking
   */
  static async submitCleaningBooking(bookingData: CleaningBookingRequest): Promise<CleaningBooking> {
    try {
      const response = await fetch(`${API_BASE_URL}/booking/booking-request`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit booking');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error submitting booking:', error);
      throw error;
    }
  }

  /**
   * Get booking by ID
   */
  static async getBookingById(bookingId: string): Promise<CleaningBooking> {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch booking');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching booking:', error);
      throw error;
    }
  }

  /**
   * Get all bookings for a customer
   */
  static async getCustomerBookings(customerEmail: string): Promise<CleaningBooking[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/customer/${encodeURIComponent(customerEmail)}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch bookings');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching customer bookings:', error);
      throw error;
    }
  }

  /**
   * Update booking status
   */
  static async updateBookingStatus(
    bookingId: string, 
    status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled'
  ): Promise<CleaningBooking> {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update booking status');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  }

  /**
   * Cancel booking
   */
  static async cancelBooking(bookingId: string): Promise<CleaningBooking> {
    return this.updateBookingStatus(bookingId, 'cancelled');
  }

  /**
   * Check availability for a specific date and time
   */
  static async checkAvailability(
    startDate: string,
    startTime: string,
    endDate: string,
    endTime: string
  ): Promise<{ available: boolean; conflictingBookings?: CleaningBooking[] }> {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/availability`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startDate,
          startTime,
          endDate,
          endTime,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to check availability');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error checking availability:', error);
      throw error;
    }
  }

  /**
   * Create a booking request
   */
  static async createBookingRequest(bookingData: CreateBookingRequest): Promise<BookingResponse> {
    try {
      console.log('Creating booking request with data:', bookingData);
      
      const response = await fetch(`${API_BASE_URL}/api/booking/booking-request`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || 'Failed to create booking request');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Create booking request error:', error);
      throw error;
    }
  }

  /**
   * Get user's bookings
   */
  static async getUserBookings(): Promise<BookingResponse[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/booking/my-bookings`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || 'Failed to fetch bookings');
      }

      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Get user bookings error:', error);
      throw error;
    }
  }
}

export default BookingService;
