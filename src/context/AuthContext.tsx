// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { api, setAuthToken } from "../api/api";
import toast from "react-hot-toast";

type User = { _id: string; name: string; email: string; role?: string } | null;

type AuthContextType = {
  user: User;
  token: string | null;
  authLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => {
    // prefer the common key used by Axios/helpers
    return localStorage.getItem("accesstoken") || null;
  });
  const [user, setUser] = useState<User>(() => {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
  });
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  // hydrate axios header & validate token on mount
  useEffect(() => {
    const init = async () => {
      const t = localStorage.getItem("accesstoken");
      if (t) {
        setAuthToken(t);
        setToken(t);
        // optional: validate token & fetch user profile
        try {
          const res = await api.get("/admin/users/me"); // adjust to your endpoint
          const u = res.data;
          setUser(u || null);
          if (u) localStorage.setItem("user", JSON.stringify(u));
        } catch (err) {
          // token invalid or expired -> clear it
          console.warn("Auth token validation failed:", err);
          setAuthToken(null);
          setToken(null);
          setUser(null);
          localStorage.removeItem("user");
        }
      }
      setAuthLoading(false);
    };
    init();
  }, []);

  // login implementation
  const login = async (email: string, password: string) => {
    setAuthLoading(true);
    try {
      const res = await api.post("/admin/users/login", { email, password }); // adjust
      const t = res.data?.data?.accessToken || res.data?.token;
      const u = res.data?.data?.user || res.data?.user;
      if (t) {
        setAuthToken(t);
        setToken(t);
      }
      if (u) {
        setUser(u);
        localStorage.setItem("user", JSON.stringify(u));
      }
      setAuthLoading(false);
      toast.success("Logged in");
    } catch (err: any) {
      setAuthLoading(false);
      toast.error(err?.response?.data?.message || "Login failed");
      throw err;
    }
  };

  const logout = () => {
    setAuthToken(null);
    setToken(null);
    setUser(null);
    localStorage.removeItem("user");
    // if you store refresh token, remove it too
    localStorage.removeItem("refreshToken");
  };

  return (
    <AuthContext.Provider value={{ user, token, authLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
