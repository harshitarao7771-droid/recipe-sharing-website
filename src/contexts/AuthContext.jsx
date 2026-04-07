import { createContext, useContext, useState, useEffect } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const token = localStorage.getItem('fv_token');
    const stored = localStorage.getItem('fv_user');
    if (token && stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await authService.login({ email, password });
    const userData = res.data;
    localStorage.setItem('fv_token', userData.token);
    localStorage.setItem('fv_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const register = async (name, email, password) => {
    const res = await authService.register({ name, email, password });
    const userData = res.data;
    localStorage.setItem('fv_token', userData.token);
    localStorage.setItem('fv_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('fv_token');
    localStorage.removeItem('fv_user');
    setUser(null);
  };

  const updateUser = (data) => {
    const updated = { ...user, ...data };
    localStorage.setItem('fv_user', JSON.stringify(updated));
    setUser(updated);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
