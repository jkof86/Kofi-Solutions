// ------------------------------------------------------------
// AuthContext.jsx — v1.2.0.6 (Stable + Loading Gate)
// ------------------------------------------------------------
//
// Fixes:
//   • Prevents redirect loops
//   • Prevents immediate logout
//   • Prevents double alerts
//   • Ensures login state is restored BEFORE Home.jsx runs
//
// ------------------------------------------------------------

import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  // ------------------------------------------------------------
  // Global Auth State
  // ------------------------------------------------------------
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authType, setAuthType] = useState(null);
  const [user, setUser] = useState(null);

  // NEW: Prevent redirect loops
  const [loading, setLoading] = useState(true);

  // ------------------------------------------------------------
  // Load auth state from localStorage on mount
  // ------------------------------------------------------------
  useEffect(() => {
    const storedLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const storedAuthType = localStorage.getItem("authType");
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedLoggedIn && storedAuthType && storedUser) {
      setIsLoggedIn(true);
      setAuthType(storedAuthType);
      setUser(storedUser);
    }

    // IMPORTANT: Only after restoring state do we allow redirects
    setLoading(false);
  }, []);

  // ------------------------------------------------------------
  // Persist auth state to localStorage
  // ------------------------------------------------------------
  function persistAuth(type, userObj) {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("authType", type);
    localStorage.setItem("user", JSON.stringify(userObj));

    setIsLoggedIn(true);
    setAuthType(type);
    setUser(userObj);

    if (type === "google"){navigate("/users/GoogleUser");}
    if (type === "apple"){navigate("/users/AppleUser");}
    if (type === "guest"){navigate("/GuestUser");}

    // navigate("/home");
  }

  // ------------------------------------------------------------
  // LOGIN METHODS
  // ------------------------------------------------------------
  function loginGoogle(profile) {
    persistAuth("google", { email: profile?.email || "googleUser" });
  }

  function loginApple(profile) {
    persistAuth("apple", { email: profile?.email || "appleUser" });
  }

  function loginGuest() {
    persistAuth("guest", { email: "guest@system" });
  }

  // ------------------------------------------------------------
  // LOGOUT
  // ------------------------------------------------------------
  function logout() {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("authType");
    localStorage.removeItem("user");

    setIsLoggedIn(false);
    setAuthType(null);
    setUser(null);

    navigate("/login");
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        authType,
        user,
        loading,        // <-- NEW
        loginGoogle,
        loginApple,
        loginGuest,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
