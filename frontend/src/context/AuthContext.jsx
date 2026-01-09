// src/auth/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  GoogleOAuthProvider,
  useGoogleLogin,
  googleLogout
} from '@react-oauth/google';
import jwtDecode from 'jwt-decode';

// ==================== CONTEXT ====================
const AuthContext = createContext(undefined);

// Replace with your actual Google Client ID
const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID_HERE.apps.googleusercontent.com";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('mockUser');
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setIsLoading(false);
  }, []);

  // ===================== LOCAL AUTH (Mock) =====================
  const register = async (email, password, name) => {
    const mockUser = {
      id: Date.now().toString(),
      email,
      name,
      authMethod: 'local'
    };

    localStorage.setItem('mockUser', JSON.stringify(mockUser));
    localStorage.setItem('mockCredentials', JSON.stringify({ email, password }));
    setUser(mockUser);
  };

  const login = async (email, password) => {
    const stored = localStorage.getItem('mockCredentials');
    if (!stored) throw new Error('No account found. Please register first.');

    const creds = JSON.parse(stored);
    if (creds.email !== email || creds.password !== password) {
      throw new Error('Invalid email or password');
    }

    const mockUser = JSON.parse(localStorage.getItem('mockUser'));
    setUser(mockUser);
  };

  // ===================== GOOGLE AUTH =====================
  const googleLoginHook = useGoogleLogin({
    onSuccess: (credentialResponse) => {
      try {
        const decoded = jwtDecode(credentialResponse.credential);
        const googleUser = {
          id: decoded.sub,
          email: decoded.email || '',
          name: decoded.name,
          photo: decoded.picture,
          authMethod: 'google'
        };

        setUser(googleUser);
        localStorage.setItem('mockUser', JSON.stringify(googleUser));
      } catch (err) {
        console.error('Failed to decode Google token:', err);
      }
    },
    onError: (error) => {
      console.error('Google login failed:', error);
    }
  });

  const loginWithGoogle = async () => {
    googleLoginHook();
  };

  // ===================== LOGOUT =====================
  const logout = async () => {
    if (user?.authMethod === 'google') {
      googleLogout();
    }
    localStorage.removeItem('mockUser');
    localStorage.removeItem('mockCredentials');
    setUser(null);
  };

  const value = {
    user,
    isLoading,
    register,
    login,
    loginWithGoogle,
    logout
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
    </GoogleOAuthProvider>
  );
}

// Hook to use auth anywhere
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
