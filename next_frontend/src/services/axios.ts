// // services/axios.ts
// import axios from 'axios';

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5232';

// // Create a single axios instance
// export const axiosInstance = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   validateStatus: function (status) {
//     return status >= 200 && status < 300;
//   },
// });

// // Helper function to get token with retry
// const getTokenWithRetry = (): string | null => {
//   const token = localStorage.getItem('token');
//   if (!token) {
//     // Wait a bit and try again (for race conditions)
//     const retryToken = localStorage.getItem('token');
//     return retryToken;
//   }
//   return token;
// };

// // Request interceptor
// axiosInstance.interceptors.request.use(
//   (config) => {
//     // Use direct access with a small delay to ensure storage is ready
//     let token = localStorage.getItem('token');
    
//     // If no token on first try, wait a bit and try again
//     if (!token) {
//       // Synchronous wait is not possible, so we'll use a Promise
//       // For now, just log and continue
//       console.log('⚠️ [Axios] No token found on first attempt');
//     }
    
//     console.log('🔑 [Axios] Token from localStorage:', token ? 'Present' : 'Missing');
//     console.log('🔑 [Axios] Request URL:', config.url);
//     console.log('🔑 [Axios] Request method:', config.method);
    
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//       console.log('✅ [Axios] Authorization header added');
//     } else {
//       console.log('⚠️ [Axios] No token found');
//     }
    
//     return config;
//   },
//   (error) => {
//     console.error('❌ [Axios] Request error:', error);
//     return Promise.reject(error);
//   }
// );

// // Response interceptor
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     // Check for redirect responses
//     if (error.response && error.response.status >= 300 && error.response.status < 400) {
//       const redirectUrl = error.response.headers.location;
//       if (redirectUrl && redirectUrl.includes('/Account/Login')) {
//         localStorage.removeItem('token');
//         localStorage.removeItem('user');
//         const currentUrl = encodeURIComponent(window.location.pathname + window.location.search);
//         if (!window.location.pathname.includes('/user-login')) {
//           window.location.href = `/user-login?redirect=${currentUrl}`;
//         }
//         return Promise.reject(new Error('Authentication required'));
//       }
//     }

//     // Handle 401 Unauthorized
//     if (error.response?.status === 401) {
//       console.log('🔑 [Axios] 401 Unauthorized, clearing token');
//       localStorage.removeItem('token');
//       localStorage.removeItem('user');
//       const currentUrl = encodeURIComponent(window.location.pathname + window.location.search);
//       if (!window.location.pathname.includes('/user-login')) {
//         window.location.href = `/user-login?redirect=${currentUrl}`;
//       }
//     }
    
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;

//---------------------------------------------------------end

// services/axios.ts
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5232';

// Create a single axios instance
export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  validateStatus: function (status) {
    return status >= 200 && status < 300;
  },
});

// Request interceptor - FIXED VERSION
axiosInstance.interceptors.request.use(
  (config) => {
    // Try to get token from localStorage
    let token = null;
    
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('token');
    }
    
    console.log('🔑 [Axios] Token present:', !!token);
    console.log('🔑 [Axios] Request URL:', config.url);
    console.log('🔑 [Axios] Request method:', config.method?.toUpperCase());
    
    if (token) {
      // Make sure to set the Authorization header correctly
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ [Axios] Authorization header added');
    } else {
      console.log('⚠️ [Axios] No token found, request may fail with 401');
    }
    
    return config;
  },
  (error) => {
    console.error('❌ [Axios] Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Check if it's a 401 Unauthorized
    if (error.response?.status === 401) {
      console.log('🔑 [Axios] 401 Unauthorized, clearing token');
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Don't auto-redirect for API calls - let the component handle it
        // Just return the error so the component can decide what to do
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;