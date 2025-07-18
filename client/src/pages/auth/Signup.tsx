import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { InputField, AuthButton } from '../../components/auth/FormComponents';
import { useAuthActions } from '../../hooks/useAuthActions';
import type { SignupRequest } from '../../types';
import { PaintBrushIcon } from '@heroicons/react/16/solid';

export default function Signup() {
  const navigate = useNavigate();
  const { handleSignup, error, clearError, isSubmitting } = useAuthActions();
  
  const [formData, setFormData] = useState<SignupRequest>({
    name: '',
    email: '',
    password: '',
    phone: '',
  });
  
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (!agreeToTerms) {
      return;
    }
    
    try {
      // Remove phone if empty
      const submitData = { ...formData };
      if (!submitData.phone) {
        delete submitData.phone;
      }
      
      await handleSignup(submitData);
      navigate('/', { replace: true });
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const isFormValid = formData.name && formData.email && formData.password && agreeToTerms;

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
            Sign up
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            label="Name"
            type="text"
            value={formData.name}
            onChange={(value) => setFormData(prev => ({ ...prev, name: value }))}
            placeholder="Reece Shearer"
            required
          />

          <InputField
            label="Email"
            type="email"
            value={formData.email}
            onChange={(value) => setFormData(prev => ({ ...prev, email: value }))}
            placeholder="reece08@gmail.com"
            required
          />

          <InputField
            label="Enter New Password"
            type="password"
            value={formData.password}
            onChange={(value) => setFormData(prev => ({ ...prev, password: value }))}
            placeholder="••••••••"
            required
          />

          <InputField
            label="Phone (Optional)"
            type="tel"
            value={formData.phone || ''}
            onChange={(value) => setFormData(prev => ({ ...prev, phone: value }))}
            placeholder="+1 (555) 123-4567"
          />

          <div className="flex items-start space-x-3">
            <input
              id="terms"
              type="checkbox"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="terms" className="text-sm text-gray-600">
              I agree to the{' '}
              <Link to="/terms" className="text-blue-600 hover:text-blue-700">
                Terms of Service
              </Link>
              {' '}and{' '}
              <Link to="/privacy" className="text-blue-600 hover:text-blue-700">
                Privacy Policy
              </Link>
            </label>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <AuthButton
            type="submit"
            loading={isSubmitting}
            disabled={!isFormValid}
          >
            Continue
          </AuthButton>
        </form>

        <div className="text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
