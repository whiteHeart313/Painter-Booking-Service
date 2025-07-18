import axios from 'axios';
import { getCookie } from '../utils/cookies';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface Appointment {
  id: string;
  bookingId: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  scheduledStart: string;
  scheduledEnd: string;
  address: string;
  description?: string;
  status: 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  estimatedHours?: number;
  notes?: string;
}

class AppointmentService {
  private api = axios.create({
    baseURL: `${API_BASE_URL}/api/booking`,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  constructor() {
    // Add token to requests if available
    this.api.interceptors.request.use((config) => {
      const token = getCookie('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  async getMyAppointments(): Promise<Appointment[]> {
    try {
      const response = await this.api.get('/my-appointments');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching appointments:', error);
      throw new Error('Failed to fetch appointments');
    }
  }

  async updateAppointmentStatus(id: string, status: string): Promise<Appointment> {
    try {
      const response = await this.api.patch(`/appointment/${id}/status`, { status });
      return response.data.data;
    } catch (error) {
      console.error('Error updating appointment status:', error);
      throw new Error('Failed to update appointment status');
    }
  }
}

export default new AppointmentService();
