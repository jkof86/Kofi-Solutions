// src/auth/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { GoogleOAuthProvider, GoogleLogin, useGoogleLogin, googleLogout } from '@react-oauth/google';
import jwtDecode from 'jwt-decode'; // for decoding Google ID token

// ==================== TYPES ====================
interface GoogleUser {
  sub: string;          // Google ID
  name: string | null;
  email: string | null;
  picture: string | null;
}

interface User {
  id: string;
  email: string;
  name: string | null;
  photo?: string | null;
  authMethod: 'local' | 'google';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  register: (email: string, password: string, name: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>; // Now using hook for custom button
  logout: () => Promise<void>;
}

// ==================== CONTEXT ====================
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Google Client ID - replace with your own from Google Cloud Console
// Get it here: https://console.cloud.google.com/apis/credentials
// Authorized JS origins: http://localhost:3000 (or your port)
const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID_HERE.apps.googleusercontent.com";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount (for local auth)
  useEffect(() => {
    const stored = localStorage.getItem('mockUser');
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setIsLoading(false);
  }, []);

  // ===================== LOCAL AUTH (Mock – replace later with API + JWT) =====================
  const register = async (email: string, password: string, name: string) => {
    const mockUser: User = {
      id: Date.now().toString(),
      email,
      name,
      authMethod: 'local',
    };
    localStorage.setItem('mockUser', JSON.stringify(mockUser));
    localStorage.setItem('mockCredentials', JSON.stringify({ email, password })); // simple check
    setUser(mockUser);
  };

  const login = async (email: string, password: string) => {
    const stored = localStorage.getItem('mockCredentials');
    if (!stored) throw new Error('No account found. Please register first.');

    const creds = JSON.parse(stored);
    if (creds.email !== email || creds.password !== password) {
      throw new Error('Invalid email or password');
    }

    const mockUser = JSON.parse(localStorage.getItem('mockUser')!);
    setUser(mockUser);
  };

  // ===================== GOOGLE AUTH with @react-oauth/google =====================
  // Use the hook for custom button control (recommended over <GoogleLogin /> for flexibility)
  const googleLoginHook = useGoogleLogin({
    onSuccess: (credentialResponse) => {
      // credentialResponse has .credential (ID token)
      try {
        const decoded = jwtDecode<GoogleUser>(credentialResponse.credential!);
        const googleUser: User = {
          id: decoded.sub,
          email: decoded.email || '',
          name: decoded.name,
          photo: decoded.picture,
          authMethod: 'google',
        };
        setUser(googleUser);
        localStorage.setItem('mockUser', JSON.stringify(googleUser));
      } catch (err) {
        console.error('Failed to decode Google token:', err);
      }
    },
    onError: (error) => {
      console.error('Google login failed:', error);
    },
    // flow: 'implicit' (default) - returns ID token
    // For auth-code flow (backend needed): flow: 'auth-code'
  });

  const loginWithGoogle = async () => {
    googleLoginHook();
  };

  // ===================== LOGOUT =====================
  const logout = async () => {
    if (user?.authMethod === 'google') {
      googleLogout(); // Clears Google session
    }
    localStorage.removeItem('mockUser');
    localStorage.removeItem('mockCredentials');
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    register,
    login,
    loginWithGoogle,
    logout,
  };

  return (
    // Wrap the entire app with GoogleOAuthProvider
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    </GoogleOAuthProvider>
  );
}

// Hook to use auth anywhere
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}