import { createContext, useContext, useEffect, useState } from 'react';
import { decodeToken, JwtPayload } from './jwt';

interface AuthState {
  token: string | null;
  role: string | null;
  userId: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('auth_token');
    if (stored) applyToken(stored);
  }, []);

  const applyToken = (token: string) => {
    const decoded: JwtPayload = decodeToken(token);
    setToken(token);
    setRole(decoded.role);
    setUserId(decoded.sub);
    localStorage.setItem('auth_token', token);
  };

  const login = (token: string) => applyToken(token);

  const logout = () => {
    setToken(null);
    setRole(null);
    setUserId(null);
    localStorage.removeItem('auth_token');
  };

  return (
    <AuthContext.Provider value={{ token, role, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};
