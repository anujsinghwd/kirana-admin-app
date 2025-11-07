// src/api/api.ts
import axios from 'axios';
// import { navigate } from 'react-router-dom'; // only used in interceptor fallback (optional)

export const api = axios.create({
  baseURL: process.env.VITE_API_URL || 'https://kirana-admin-services.vercel.app/api',
  headers: { 'Content-Type': 'application/json' }
});

// helper to set token
export const setAuthToken = (token?: string | null) => {
  if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`;
  else delete api.defaults.headers.common.Authorization;
};

// Optional: global response interceptor for 401 (token expired/invalid)
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      // user must re-login - opportunistically clear token from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // don't do direct navigation here (causes issues outside react), instead return error
    }
    return Promise.reject(error);
  }
);
