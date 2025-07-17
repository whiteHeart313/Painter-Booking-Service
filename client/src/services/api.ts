import axios from 'axios';
import type {
  PaintingService,
  BookingRequest,
  Booking,
  ContactForm,
} from '../types';

const API_BASE_URL = 'http://localhost:3000/api'; // Adjust based on your backend

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const paintingAPI = {
  // Services
  getServices: async (): Promise<PaintingService[]> => {
    const response = await api.get('/services');
    return response.data;
  },

  getService: async (id: string): Promise<PaintingService> => {
    const response = await api.get(`/services/${id}`);
    return response.data;
  },

  // Bookings
  createBooking: async (booking: BookingRequest): Promise<Booking> => {
    const response = await api.post('/bookings', booking);
    return response.data;
  },

  getBookings: async (): Promise<Booking[]> => {
    const response = await api.get('/bookings');
    return response.data;
  },

  getBooking: async (id: string): Promise<Booking> => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  updateBookingStatus: async (
    id: string,
    status: Booking['status']
  ): Promise<Booking> => {
    const response = await api.patch(`/bookings/${id}`, { status });
    return response.data;
  },

  // Contact
  sendContactMessage: async (
    contact: ContactForm
  ): Promise<{ success: boolean; message: string }> => {
    const response = await api.post('/contact', contact);
    return response.data;
  },
};

export default api;
