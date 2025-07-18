import type { LoginRequest, SignupRequest, AuthResponse, User } from '../types';
import { getCookie, setCookie, removeCookie } from '../utils/cookies';

const API_BASE_URL = import.meta.env.API_ENDPOINT || 'http://localhost:3000/api';

export class AuthService {
  private static TOKEN_KEY = 'auth_token';
  private static REFRESH_TOKEN_KEY = 'refresh_token';

  /**
   * Login user with email and password
   */
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    console.log('🔍 AuthService: Login attempt for:', credentials.email);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      console.log('🔍 AuthService: Login response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.log('🔍 AuthService: Login failed with error:', errorData);
        throw new Error(errorData.message || 'Login failed');
      }

      const {data} = await response.json();
      console.log('🔍 AuthService: Login successful, data received:', data);
      
      // Store tokens in cookies
      console.log('🔍 AuthService: Storing token in cookies');
      setCookie(this.TOKEN_KEY, data.token, 7);
      
      console.log('🔍 AuthService: Token stored, returning data');
      return data;
    } catch (error) {
      console.error('🔍 AuthService: Login error:', error);
      throw error;
    }
  }

  /**
   * Register new user
   */
  static async signup(userData: SignupRequest): Promise<AuthResponse > {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
          const errorData = await response.json();
          console.log('ERROR IN SIGNUP:', errorData);
        throw new Error(errorData.message || 'Registration failed');
      }

      const {data} = await response.json();
      console.log('SIGNUP RESPONSE:', data);            
      
      // Store tokens in cookies
      setCookie(this.TOKEN_KEY, data.token, 7);
      setCookie(this.REFRESH_TOKEN_KEY, data.refreshToken, 30);
      
      return data;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  }

  /**
   * Logout user
   */
  static async logout(): Promise<void> {
    try {
      const token = this.getToken();
      if (token) {
        console.log('Logging out user with token:', token);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always remove tokens from cookies
      removeCookie(this.TOKEN_KEY);
      removeCookie(this.REFRESH_TOKEN_KEY);
    }
  }

  /**
   * Get current user profile
   */
  static async getCurrentUser(): Promise<User> {
    console.log('🔍 AuthService: getCurrentUser called');
    try {
      const token = this.getToken();
      if (!token) {
        console.log('🔍 AuthService: No token found in getCurrentUser');
        throw new Error('No authentication token found');
      }
      
      console.log('🔍 AuthService: Making request to', `${API_BASE_URL}/auth/profile`);
      console.log('🔍 AuthService: Using token:', token.substring(0, 20) + '...');
      
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('🔍 AuthService: getCurrentUser response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.log('🔍 AuthService: getCurrentUser failed with error:', errorData);
        throw new Error(errorData.message || 'Failed to fetch user');
      }

      const {data} = await response.json();
      console.log('🔍 AuthService: getCurrentUser success, full response:', data);
      
      // Backend returns user data directly in 'data', not 'data.user'
      return data;
    } catch (error) {
      console.error('🔍 AuthService: getCurrentUser error:', error);
      throw error;
    }
  }

  /**
   * Refresh authentication token
   */
  static async refreshToken(): Promise<AuthResponse> {
    try {
      const refreshToken = getCookie(this.REFRESH_TOKEN_KEY);
      if (!refreshToken) {
        throw new Error('No refresh token found');
      }

      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Token refresh failed');
      }

      const {data} = await response.json();
      
      // Update tokens in cookies
      setCookie(this.TOKEN_KEY, data.token, 7);
      setCookie(this.REFRESH_TOKEN_KEY, data.refreshToken, 30);

      return data;
    } catch (error) {
      console.error('Token refresh error:', error);
      // If refresh fails, clear tokens
      removeCookie(this.TOKEN_KEY);
      removeCookie(this.REFRESH_TOKEN_KEY);
      throw error;
    }
  }

  /**
   * Get stored authentication token
   */
  static getToken(): string | null {
    const token = getCookie(this.TOKEN_KEY) || null;
    console.log('🔍 AuthService: getToken called, token found:', token ? 'Yes' : 'No');
    return token;
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Forgot password
   */
  static async forgotPassword(email: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send reset email');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  }

  /**
   * Reset password
   */
  static async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }
}
