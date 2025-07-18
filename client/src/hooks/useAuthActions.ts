import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { AuthService } from '../services/authService';
import type { LoginRequest, SignupRequest } from '../types';

export const useAuthActions = () => {
  const { login, signup, logout, isLoading, error, clearError } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (credentials: LoginRequest) => {
    try {
      setIsSubmitting(true);
      await login(credentials);
    } catch (error) {
      // Error is handled by AuthContext
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignup = async (userData: SignupRequest) => {
    try {
      setIsSubmitting(true);
      await signup(userData);
    } catch (caughtError) {
      // Error is handled by AuthContext
      throw caughtError;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsSubmitting(true);
      await logout();
    } catch (error) {
      // Error is handled by AuthContext
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (email: string) => {
    try {
      setIsSubmitting(true);
      await AuthService.forgotPassword(email);
    } catch (error) {
      // This one doesn't go through AuthContext, so we need to handle it
      // For now, we'll just throw and let the component handle it
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

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
