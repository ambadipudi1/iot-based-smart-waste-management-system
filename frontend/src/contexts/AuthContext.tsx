import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  userEmail: string | null;
  login: (email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_KEY = 'iot_waste_auth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem(AUTH_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [userEmail, setUserEmail] = useState<string | null>(() => {
    try {
      return localStorage.getItem('iot_waste_email');
    } catch {
      return null;
    }
  });

  const login = (email: string) => {
    setIsAuthenticated(true);
    setUserEmail(email);
    try {
      localStorage.setItem(AUTH_KEY, 'true');
      localStorage.setItem('iot_waste_email', email);
    } catch {
      // ignore
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserEmail(null);
    try {
      localStorage.removeItem(AUTH_KEY);
      localStorage.removeItem('iot_waste_email');
    } catch {
      // ignore
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userEmail, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
