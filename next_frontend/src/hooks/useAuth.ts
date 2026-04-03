'use client';

import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';

/**
 * Custom hook to access authentication context
 * Must be used within an AuthProvider
 * 
 * @returns {AuthContextType} Authentication context value
 * @throws {Error} If used outside of AuthProvider
 * 
 * @example
 * ```tsx
 * function Profile() {
 *   const { user, logout } = useAuth();
 *   return <div>Welcome {user?.name}</div>;
 * }
 * ```
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

// Optional: Export a safe version that returns null instead of throwing
export const useSafeAuth = () => {
  return useContext(AuthContext);
};