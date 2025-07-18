import axios from 'axios';
import { getCookie } from '../utils/cookies';

const API_BASE_URL = import.meta.env.API_ENDPOINT || 'http://localhost:3000';

export interface AvailabilityData {
  id?: string;
  painterId: string;
  startTime: string; // ISO string
  endTime: string;   // ISO string
  isBooked?: boolean;
}

export interface CreateAvailabilityRequest {
  startTime: string; // ISO string
  endTime: string;   // ISO string
}

class AvailabilityService {
  private api = axios.create({
    baseURL: `${API_BASE_URL}/api/availability`,
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

  async getMyAvailabilities(): Promise<AvailabilityData[]> {
    try {
      const response = await this.api.get('/me');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching availabilities:', error);
      throw new Error('Failed to fetch availabilities');
    }
  }

  async createAvailability(data: CreateAvailabilityRequest): Promise<AvailabilityData> {
    try {
      const response = await this.api.post('/', data);
      return response.data.data;
    } catch (error) {
      // error may be any type, so use type assertion inside the block if needed
      console.error('Error creating availability:', (error as any)?.response?.data.error || error);
      throw new Error('Failed to create availability');
    }
  }

  async deleteAvailability(id: string): Promise<void> {
    try {
      await this.api.delete(`/${id}`);
    } catch (error) {
      console.error('Error deleting availability:', error);
      throw new Error('Failed to delete availability');
    }
  }
}

export default new AvailabilityService();
