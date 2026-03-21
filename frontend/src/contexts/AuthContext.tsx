import React, { createContext, useState, useEffect } from 'react';
import type { User } from '../services/api';
import { api, getToken, removeToken } from '../services/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (userName: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('🔍 [AuthProvider] MOUNTED');
    const token = getToken();
    console.log('📦 [AuthProvider] Token on mount:', token ? 'Present' : 'Missing');
    
    if (token) {
      console.log('🔄 [AuthProvider] Token found, checking user...');
      checkUser();
    } else {
      console.log('⏭️ [AuthProvider] No token, setting loading false');
      setLoading(false);
    }
  }, []);

  const checkUser = async () => {
    console.log('🔍 [AuthProvider] checkUser started');
    try {
      // FIXED: getCurrentUser now returns { user: userData }
      const response = await api.auth.getCurrentUser();
      console.log('✅ [AuthProvider] getCurrentUser response:', response);
      
      // Set the user from response.user
      if (response && response.user) {
        setUser(response.user);
        console.log('👤 [AuthProvider] User set:', response.user);
      } else {
        console.log('⚠️ [AuthProvider] No user in response');
        setUser(null);
      }
    } catch (error) {
      console.log('❌ [AuthProvider] getCurrentUser failed:', error);
      removeToken();
      setUser(null);
    } finally {
      console.log('🏁 [AuthProvider] checkUser complete');
      setLoading(false);
    }
  };

  const login = async (userName: string, password: string) => {
    console.log('🚀 [AuthProvider] login CALLED for:', userName);
    setError(null);
    
    try {
      const response = await api.auth.login({ userName, password });
      console.log('✅ [AuthProvider] login successful, setting user:', response.user);
      setUser(response.user);
    } catch (err) {
      console.error('❌ [AuthProvider] login failed:', err);
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    }
  };

  const logout = async () => {
    console.log('👋 [AuthProvider] logout called');
    try {
      await api.auth.logout();
      removeToken();
      setUser(null);
      console.log('✅ [AuthProvider] logout complete');
    } catch (err) {
      console.error('❌ Logout error:', err);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
  };

  console.log('📊 [AuthProvider] Current state:', { 
    hasUser: !!user, 
    loading, 
    hasError: !!error 
  });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};