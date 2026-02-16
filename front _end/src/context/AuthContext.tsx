import React, { useEffect, useState, createContext, useContext } from 'react';
import { User } from '../types';
import api, { tokenManager } from '../services/api';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  register: (data: {
    username: string;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone?: string;
  }) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user on mount
  useEffect(() => {
    const loadUser = async () => {
      const token = tokenManager.getAccessToken();
      if (token) {
        try {
          const userData = await api.auth.getProfile() as User;
          setUser(userData);
        } catch (error) {
          console.error('Failed to load user:', error);
          tokenManager.clearTokens();
        }
      }
      setIsLoading(false);
    };

    loadUser();
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await api.auth.login(username, password);
      tokenManager.setTokens(response.access, response.refresh);
      setUser(response.user);
      localStorage.setItem('food_court_user', JSON.stringify(response.user));
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: {
    username: string;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone?: string;
  }) => {
    setIsLoading(true);
    try {
      const response: any = await api.auth.register({
        ...data,
        role: 'student' // Always register as student
      });
      tokenManager.setTokens(response.access, response.refresh);
      setUser(response.user);
      localStorage.setItem('food_court_user', JSON.stringify(response.user));
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    tokenManager.clearTokens();
  };

  const refreshUser = async () => {
    try {
      const userData = await api.auth.getProfile() as User;
      setUser(userData);
      localStorage.setItem('food_court_user', JSON.stringify(userData));
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isLoading,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}