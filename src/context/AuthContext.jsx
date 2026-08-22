import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('auth_token'));
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  const storeToken = useCallback((newToken) => {
    localStorage.setItem('auth_token', newToken);
    setToken(newToken);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    setToken(null);
    setUser(null);
  }, []);

  // Validate token on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('auth_token');
    if (!savedToken) { setIsLoading(false); return; }
    axios.get(`${API_BASE}/auth/me`, { headers: { Authorization: `Bearer ${savedToken}` } })
      .then(({ data }) => setUser(data))
      .catch(() => { localStorage.removeItem('auth_token'); setToken(null); })
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (email, password) => {
    const { data } = await axios.post(`${API_BASE}/auth/login`, { email, password });
    storeToken(data.access_token);
    setUser(data.user);
    return data.user;
  };

  const register = async (name, email, password) => {
    await axios.post(`${API_BASE}/auth/register`, { name, email, password });
    return login(email, password);
  };

  const loginWithGoogle = () => {
    window.location.href = `${API_BASE}/auth/google`;
  };

  // Called from AuthCallbackPage after Google redirect
  const handleGoogleCallback = async (callbackToken) => {
    storeToken(callbackToken);
    const { data } = await axios.get(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${callbackToken}` },
    });
    setUser(data);
    return data;
  };

  const refreshUser = async () => {
    const t = localStorage.getItem('auth_token');
    if (!t) return;
    const { data } = await axios.get(`${API_BASE}/auth/me`, { headers: { Authorization: `Bearer ${t}` } });
    setUser(data);
  };

  return (
    <AuthContext.Provider value={{
      user, token, isAuthenticated, isLoading,
      login, register, logout, loginWithGoogle, handleGoogleCallback, refreshUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = { children: PropTypes.node.isRequired };
