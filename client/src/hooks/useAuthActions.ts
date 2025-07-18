import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { AuthService } from '../services/authService';
import type { LoginRequest, SignupRequest } from '../types';

export const useAuthActions = () => {
  const { login, signup, logout, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (credentials: LoginRequest) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await login(credentials);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Login failed');
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignup = async (userData: SignupRequest) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await signup(userData);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Signup failed');
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      await logout();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Logout failed');
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (email: string) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await AuthService.forgotPassword(email);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to send reset email');
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearError = () => setError(null);

  return {
    handleLogin,
    handleSignup,
    handleLogout,
    handleForgotPassword,
    error,
    clearError,
    isSubmitting: isSubmitting || isLoading,
  };
};
