// src/components/ProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loading from "./common/Loading";

const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { user, authLoading } = useAuth();

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loading /></div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
