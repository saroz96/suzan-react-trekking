
// Base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5232';

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

// Token management
const TOKEN_KEY = 'trekking_app_token';

export const setToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

// Generic HTTP function for API calls with JWT
async function http<T>(url: string, options?: RequestInit): Promise<T> {
  const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
  
  // Get token from localStorage
  const token = getToken();
  
  console.log(`🌐 Making ${options?.method || 'GET'} request to: ${fullUrl}`);
  console.log(`🔑 Token present: ${!!token}`);
  if (token) {
    console.log(`🔑 Token preview: ${token.substring(0, 20)}...`);
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
    console.log('🔑 Authorization header added');
  }
  
  try {
    console.log('📤 Sending request with headers:', headers);
    
    const response = await fetch(fullUrl, {
      ...options,
      headers,
    });

    console.log(`📥 Response status: ${response.status}`);
    console.log(`📥 Response headers:`, Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ Error response text:', errorText);
      
      let error;
      try {
        error = JSON.parse(errorText);
      } catch {
        error = { message: errorText };
      }
      
      // If unauthorized, clear token
      if (response.status === 401) {
        console.log('🔑 Unauthorized, clearing token');
        removeToken();
      }
      
      throw new Error(error.message || error.title || 'Something went wrong');
    }

    const data = await response.json();
    console.log('✅ Response data:', data);
    return data;
  } catch (error) {
    console.error('❌ Fetch error:', error);
    throw error;
  }
}

// API service object
export const api = {
  auth: {
    login: async (data: LoginRequest) => {
      console.log('🔐 [API] login CALLED with data:', data);
      console.trace('🔐 [API] login stack trace:');
      
      const response = await http<LoginResponse>('/api/Auth/login', { 
        method: 'POST', 
        body: JSON.stringify(data) 
      });
      
      if (response.token) {
        console.log('✅ [API] login successful, token saved');
        setToken(response.token);
      }
      
      return response;
    },
    
    logout: () => {
      console.log('👋 [API] logout called');
      removeToken();
      return Promise.resolve();
    },
    
    // FIXED: /me returns the user directly, not wrapped in a user property
    getCurrentUser: async () => {
      console.log('🔍 [API] getCurrentUser called');
      // The /me endpoint returns the user object directly
      const userData = await http<User>('/api/Auth/me');
      console.log('📦 /me returned user data:', userData);
      
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