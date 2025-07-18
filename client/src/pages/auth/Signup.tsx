import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { InputField, AuthButton } from '../../components/auth/FormComponents';
import { useAuthActions } from '../../hooks/useAuthActions';
import type { SignupRequest } from '../../types';
import { PaintBrushIcon } from '@heroicons/react/16/solid';

export default function Signup() {
  const navigate = useNavigate();
  const { handleSignup, error, clearError, isSubmitting } = useAuthActions();
  
  // Render counter
  const renderCount = useRef(0);
  renderCount.current += 1;
  
  console.log(`Signup component render #${renderCount.current}`);
  console.log('Error state in signup component:', error);
  console.log('isSubmitting state:', isSubmitting);
  
  const [formData, setFormData] = useState<SignupRequest>({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    phone: '',
    role: 'USER',
    address: '',
  });
  
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (!agreeToTerms) {
      // Show error if terms not agreed
      return;
    }
    
    try {
      const submitData = { ...formData };
      await handleSignup(submitData);
      // Only navigate on successful signup
      navigate('/', { replace: true });
    } catch (error) {
      // Error is handled by AuthContext and will be displayed
      console.log('Signup error:', error);
    }
  };

  const isFormValid = formData.firstname && formData.lastname && formData.email && formData.password && formData.role && agreeToTerms && formData.phone && formData.address;

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
            label="First Name"
            type="text"
            value={formData.firstname}
            onChange={(value) => setFormData(prev => ({ ...prev, firstname: value }))}
            placeholder="Ammar"
            required
          />
          <InputField
            label="Last Name"
            type="text"
            value={formData.lastname}
            onChange={(value) => setFormData(prev => ({ ...prev, lastname: value }))}
            placeholder="Hamed"
            required
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              APPLY AS 
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as 'USER' | 'PAINTER' }))}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            >
              <option value="USER">USER</option>
              <option value="PAINTER">PAINTER</option>
            </select>
          </div>

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
            label="Phone"
            type="tel"
            value={formData.phone || ''}
            onChange={(value) => setFormData(prev => ({ ...prev, phone: value }))}
            placeholder="+1 (555) 123-4567"
          />
          <InputField
              label="Address"
              type="text"
              value={formData.address}
              onChange={(value) => setFormData(prev => ({ ...prev, address: value }))}
              placeholder="123 Main St"
              required
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
