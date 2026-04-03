// Base URL - Use environment variable for Next.js
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5232';

// Types
export interface User {
  id: string;
  name: string;
  email?: string; // Keep optional, but won't be used
}

export interface LoginRequest {
  userName: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

export interface Trip {
  id: number;
  slug: string;
  title: string;
  duration: string;
  reviews: number;
  rating: number;
  badge: string;
  image: string;
  guaranteed: boolean;
}

// Token management - Only runs on client side
const TOKEN_KEY = 'trekking_app_token';

// Check if we're on the client side
const isClient = typeof window !== 'undefined';

export const setToken = (token: string) => {
  if (isClient) {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

export const getToken = (): string | null => {
  if (isClient) {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
};

export const removeToken = () => {
  if (isClient) {
    localStorage.removeItem(TOKEN_KEY);
  }
};

// Generic HTTP function for API calls with JWT
// Supports both client and server-side requests
async function http<T>(
  url: string, 
  options?: RequestInit,
  serverToken?: string | null
): Promise<T> {
  const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
  
  // Get token from localStorage (client) or from passed token (server)
  const token = serverToken || (isClient ? getToken() : null);
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`🌐 Making ${options?.method || 'GET'} request to: ${fullUrl}`);
    console.log(`🔑 Token present: ${!!token}`);
    if (token) {
      console.log(`🔑 Token preview: ${token.substring(0, 20)}...`);
    }
  }
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (options?.headers) {
    const existingHeaders = options.headers as Record<string, string>;
    Object.assign(headers, existingHeaders);
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    if (process.env.NODE_ENV === 'development') {
      console.log('🔑 Authorization header added');
    }
  }
  
  try {
    const response = await fetch(fullUrl, {
      ...options,
      headers,
      credentials: 'include', // Include cookies if needed
    });

    if (process.env.NODE_ENV === 'development') {
      console.log(`📥 Response status: ${response.status}`);
    }

    if (!response.ok) {
      const errorText = await response.text();
      
      let error;
      try {
        error = JSON.parse(errorText);
      } catch {
        error = { message: errorText };
      }
      
      // If unauthorized, clear token
      if (response.status === 401 && isClient) {
        console.log('🔑 Unauthorized, clearing token');
        removeToken();
      }
      
      throw new Error(error.message || error.title || 'Something went wrong');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('❌ Fetch error:', error);
    throw error;
  }
}

// Server-side API functions (for use in Server Components)
export const serverApi = {
  auth: {
    getCurrentUser: async (token: string) => {
      try {
        const userData = await http<User>('/api/Auth/me', undefined, token);
        return { user: userData };
      } catch (error) {
        console.error('Server-side auth error:', error);
        return null;
      }
    },
  },
  
  trips: {
    getAll: async () => {
      return http<Trip[]>('/api/Trips');
    },
    
    getBySlug: async (slug: string) => {
      return http<Trip>(`/api/Trips/${slug}`);
    },
  },
};

// Client-side API service object
export const api = {
  auth: {
    login: async (data: LoginRequest) => {
      if (process.env.NODE_ENV === 'development') {
        console.log('🔐 [API] login CALLED with data:', data);
      }
      
      const response = await http<LoginResponse>('/api/Auth/login', { 
        method: 'POST', 
        body: JSON.stringify(data) 
      });
      
      if (response.token) {
        if (process.env.NODE_ENV === 'development') {
          console.log('✅ [API] login successful, token saved');
        }
        setToken(response.token);
      }
      
      return response;
    },
    
    logout: () => {
      if (process.env.NODE_ENV === 'development') {
        console.log('👋 [API] logout called');
      }
      removeToken();
      return Promise.resolve();
    },
    
    // Returns the user directly from /me endpoint
    getCurrentUser: async () => {
      if (process.env.NODE_ENV === 'development') {
        console.log('🔍 [API] getCurrentUser called');
      }
      
      // The /me endpoint returns the user object directly
      const userData = await http<User>('/api/Auth/me');
      
      if (process.env.NODE_ENV === 'development') {
        console.log('📦 /me returned user data:', userData);
      }
      
      // Wrap it in the expected format for consistency with login response
      return { user: userData };
    },
  },
  
  trips: {
    getAll: () => 
      http<Trip[]>('/api/Trips'),
    
    getBySlug: (slug: string) => 
      http<Trip>(`/api/Trips/${slug}`),
  },
};

// Helper function to create authenticated fetch for server components
export const createAuthenticatedFetch = (token: string) => {
  return {
    get: async <T>(url: string): Promise<T> => {
      return http<T>(url, { method: 'GET' }, token);
    },
    post: async <T>(url: string, data?: any): Promise<T> => {
      return http<T>(url, { 
        method: 'POST', 
        body: data ? JSON.stringify(data) : undefined 
      }, token);
    },
    put: async <T>(url: string, data?: any): Promise<T> => {
      return http<T>(url, { 
        method: 'PUT', 
        body: data ? JSON.stringify(data) : undefined 
      }, token);
    },
    delete: async <T>(url: string): Promise<T> => {
      return http<T>(url, { method: 'DELETE' }, token);
    },
  };
};

// Types for API responses
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

// Error handling helper
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public errors?: any[]
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Revalidate helper for Next.js ISR
export const revalidate = (paths: string[]) => {
  if (process.env.NODE_ENV === 'production') {
    // This would be used with Next.js API routes for ISR
    // Example implementation would call your Next.js API endpoint
    console.log('Revalidate paths:', paths);
  }
};