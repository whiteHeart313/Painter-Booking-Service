import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { PaintBrushIcon } from '@heroicons/react/24/solid';
import { InputField, AuthButton } from '../../components/auth/FormComponents';
import { useAuthActions } from '../../hooks/useAuthActions';
import type { LoginRequest } from '../../types';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { handleLogin, handleForgotPassword, error, clearError, isSubmitting } = useAuthActions();
  
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: '',
  });
  
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordSent, setForgotPasswordSent] = useState(false);

  // Get the intended destination from location state, default to home
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    try {
      await handleLogin(formData);
      navigate(from, { replace: true });
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    try {
      await handleForgotPassword(forgotPasswordEmail);
      setForgotPasswordSent(true);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Link to="/" className="flex items-center justify-center space-x-2 mb-8 hover:opacity-80 transition-opacity">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
                <PaintBrushIcon className="h-5 w-5 text-white" />
              </div>
              <span className="text-4xl font-bold text-gray-900">Clëan</span>
            </Link>
            <h2 className="text-2xl font-semibold text-gray-900">
              Reset Password
            </h2>
          </div>

          {forgotPasswordSent ? (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-gray-600">
                  We've sent a password reset link to your email address.
                </p>
              </div>
              <button
                onClick={() => {
                  setShowForgotPassword(false);
                  setForgotPasswordSent(false);
                  setForgotPasswordEmail('');
                }}
                className="w-full text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Back to Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-6">
              <InputField
                label="Email"
                type="email"
                value={forgotPasswordEmail}
                onChange={setForgotPasswordEmail}
                placeholder="Enter your email address"
                required
                error={error || undefined}
              />

              <AuthButton
                type="submit"
                loading={isSubmitting}
                disabled={!forgotPasswordEmail}
              >
                Send Reset Link
              </AuthButton>

              <button
                type="button"
                onClick={() => setShowForgotPassword(false)}
                className="w-full text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Back to Login
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="flex items-center justify-center space-x-2 mb-8 hover:opacity-80 transition-opacity">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
              <PaintBrushIcon className="h-5 w-5 text-white" />
            </div>
            <span className="text-4xl font-bold text-gray-900">Paint</span>
          </Link>
          <h2 className="text-2xl font-semibold text-gray-900">
            Login
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            label="Email"
            type="email"
            value={formData.email}
            onChange={(value) => setFormData(prev => ({ ...prev, email: value }))}
            placeholder="reece08@gmail.com"
            required
          />

          <InputField
            label="Password"
            type="password"
            value={formData.password}
            onChange={(value) => setFormData(prev => ({ ...prev, password: value }))}
            placeholder="••••••••"
            required
          />

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <AuthButton
            type="submit"
            loading={isSubmitting}
            disabled={!formData.email || !formData.password}
          >
            Continue
          </AuthButton>
        </form>

        <div className="text-center space-y-4">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign up
            </Link>
          </p>
          <button
            onClick={() => setShowForgotPassword(true)}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Forgot password
          </button>
        </div>
      </div>
    </div>
  );
}
