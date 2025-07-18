import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { AuthService } from '../services/authService';
import type { User, LoginRequest, SignupRequest, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      console.log('🔍 AuthContext: Starting initializeAuth...');
      try {
        const storedToken = AuthService.getToken();
        console.log('🔍 AuthContext: Retrieved token from storage:', storedToken ? 'Token exists' : 'No token found');
        
        if (storedToken) {
          console.log('🔍 AuthContext: Setting token in state');
          setToken(storedToken);
          
          console.log('🔍 AuthContext: Fetching current user...');
          const currentUser = await AuthService.getCurrentUser();
          console.log('🔍 AuthContext: Current user fetched:', currentUser);
          
          setUser(currentUser);
          console.log('🔍 AuthContext: User set in state, authentication complete');
        } else {
          console.log('🔍 AuthContext: No stored token, user not authenticated');
        }
      } catch (error) {
        console.error('🔍 AuthContext: Failed to initialize auth:', error);
        // Clear invalid tokens
        await AuthService.logout();
      } finally {
        console.log('🔍 AuthContext: Setting loading to false');
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginRequest) => {
    console.log('🔍 AuthContext: Login attempt started');
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🔍 AuthContext: Calling AuthService.login');
      const response = await AuthService.login(credentials);
      console.log('🔍 AuthContext: Login response received:', response);
      
      console.log('🔍 AuthContext: Setting user and token in state');
      setUser(response.user);
      setToken(response.token);
      
      console.log('🔍 AuthContext: Login successful, user authenticated');
    } catch (error) {
      console.error('🔍 AuthContext: Login failed:', error);
      setError(error instanceof Error ? error.message : 'Login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: SignupRequest) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await AuthService.signup(userData);
      setUser(response?.user);
      setToken(response?.token);
    } catch (error) {
      console.error('Signup failed Here in Auth Provider:', error);
      setError(error instanceof Error ? error.message : 'Signup failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await AuthService.logout();
      setUser(null);
      setToken(null);
    } catch (error) {
      console.error('Logout failed:', error);
      setError(error instanceof Error ? error.message : 'Logout failed');
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    signup,
    logout,
    isAuthenticated: !!user && !!token,
    isLoading,
    error,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
