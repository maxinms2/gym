
// front/AuthContext.js
import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from './api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [userToken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Al iniciar, cargar sesión guardada
    const loadToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const user = await AsyncStorage.getItem('user');

        if (token) {
          setUserToken(token);
          setUserInfo(user ? JSON.parse(user) : null);
        }
      } catch (err) {
        console.error('Error loading token', err);
      } finally {
        setLoading(false);
      }
    };

    loadToken();
  }, []);

  const signIn = async ({ email, password }) => {
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');

      // Guardar token + usuario en el dispositivo
      await AsyncStorage.setItem('token', data.token);
      await AsyncStorage.setItem('user', JSON.stringify(data.user));

      setUserToken(data.token);
      setUserInfo(data.user);

      return { ok: true };

    } catch (err) {
      console.error('signIn error', err);
      return { ok: false, message: err.message };
    }
  };

  const signUp = async ({ name, email, password }) => {
    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Register failed');

      await AsyncStorage.setItem('token', data.token);
      await AsyncStorage.setItem('user', JSON.stringify(data.user));

      setUserToken(data.token);
      setUserInfo(data.user);

      return { ok: true };

    } catch (err) {
      console.error('signUp error', err);
      return { ok: false, message: err.message };
    }
  };

  const signOut = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');

    setUserToken(null);
    setUserInfo(null);
  };

  return (
    <AuthContext.Provider value={{ 
      userToken, 
      userInfo, 
      loading, 
      signIn, 
      signOut, 
      signUp 
    }}>
      {children}
    </AuthContext.Provider>
  );
}
