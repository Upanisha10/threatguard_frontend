import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import React from 'react';

export function RequireAuth({
  children,
  role,
}: {
  children: React.ReactNode;
  role?: string;
}) {
  const auth = useAuth();

  if (!auth.token) {
    return <Navigate to="/login" replace />;
  }

  if (role && auth.role !== role) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
