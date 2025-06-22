import React, { createContext, useContext, useState, useEffect } from 'react';

// URL base del backend según variable de entorno o localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Crear el contexto
const AuthContext = createContext();

// Hook para usar el contexto fácilmente
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setCargando(false);
      return;
    }

    fetch(`${API_URL}/api/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error('No autorizado');
        return res.json();
      })
      .then(data => {
        setUsuario(data);
      })
      .catch(() => {
        localStorage.removeItem('token'); // Token inválido
        setUsuario(null);
      })
      .finally(() => setCargando(false));
  }, []);

  const login = async (email, contraseña) => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, contraseña }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Error al iniciar sesión');
    }

    const data = await res.json();
    localStorage.setItem('token', data.token);

    const userRes = await fetch(`${API_URL}/api/auth/me`, {
      headers: { 'Authorization': `Bearer ${data.token}` },
    });

    if (!userRes.ok) throw new Error('Error al obtener usuario');
    const userData = await userRes.json();
    setUsuario(userData);

    return { token: data.token, user: userData };
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUsuario(null);
  };

  const register = async ({ nombre, email, contraseña }) => {
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, email, contraseña }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Error al registrarse');
    }

    const data = await res.json();
    localStorage.setItem('token', data.token);

    const userRes = await fetch(`${API_URL}/api/auth/me`, {
      headers: { 'Authorization': `Bearer ${data.token}` },
    });

    if (!userRes.ok) throw new Error('Error al obtener usuario');
    const userData = await userRes.json();
    setUsuario(userData);

    return { token: data.token, user: userData };
  };

  return (
    <AuthContext.Provider value={{ usuario, cargando, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}
