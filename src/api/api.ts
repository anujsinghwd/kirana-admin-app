// src/api/api.ts
import axios from 'axios';

// const baseURL: string = import.meta.env.VITE_API_URL || "";
// http://localhost:5001/api
// https://kirana-admin-services.vercel.app/api
// export const baseURL: string = import.meta.env.VITE_API_URL as string;

export const api = axios.create({
  baseURL: 'http://kirana-admin-services.vercel.app/api',
  headers: { 'Content-Type': 'application/json' }
});

// call to set/remove Authorization header
export function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("accesstoken", token); // keep storage consistent
  } else {
    delete api.defaults.headers.common["Authorization"];
    localStorage.removeItem("accesstoken");
  }
}

// Optional: global response interceptor for 401 (token expired/invalid)
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      // user must re-login - opportunistically clear token from localStorage
      localStorage.removeItem('accesstoken');
      localStorage.removeItem('user');
      // don't do direct navigation here (causes issues outside react), instead return error
    }
    return Promise.reject(error);
  }
);
