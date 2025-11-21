import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  // Check session on app load
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const res = await axios.get('http://localhost:8001/api/auth/me');
      console.log('Session check response:', res.data);
      
      if (res.data.authenticated && res.data.user) {
        setUser(res.data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.log('Session check error:', err.response?.data || err.message);
      setUser(null);
    } finally {
      setReady(true);
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      // Login request
      const res = await axios.post('http://localhost:8001/api/auth/login', { 
        email, 
        password 
      });
      console.log('Login response:', res.data);

      if (!res.data.success) {
        throw new Error(res.data.message || 'Login failed');
      }

      // Fetch user session after login
      const me = await axios.get('http://localhost:8001/api/auth/me');
      console.log('User session after login:', me.data);
      
      if (me.data.authenticated && me.data.user) {
        setUser(me.data.user);
      }

      return res.data;
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      throw err;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      console.log('Logging out...');
      const res = await axios.post('http://localhost:8001/api/auth/logout');
      console.log('Logout response:', res.data);
      
      // Clear user immediately
      setUser(null);
      
      // Verify session is destroyed
      const check = await axios.get('http://localhost:8001/api/auth/me');
      console.log('Session after logout:', check.data);
      
    } catch (err) {
      console.error('Logout error:', err.response?.data || err.message);
      // Still clear user even if logout fails
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, ready, login, logout, checkSession }}>
      {children}
    </AuthContext.Provider>
  );
};