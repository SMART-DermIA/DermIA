import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tokenExpiry, setTokenExpiry] = useState(null);

  const isLoggedIn = !!user;

  // Auto logout when token expires
  useEffect(() => {
    if (!tokenExpiry) return;

    const timeout = tokenExpiry * 1000 - Date.now();
    if (timeout <= 0) {
      logout();
      return;
    }

    const timer = setTimeout(() => {
      logout();
      alert("Session expired. Please log in again.");
    }, timeout);

    return () => clearTimeout(timer);
  }, [tokenExpiry]);

  const fetchTokenExpiry = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/auth/token-info`, {
        withCredentials: true
      });
      setTokenExpiry(res.data.exp);
    } catch {
      setTokenExpiry(null);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/auth/me`, {
          withCredentials: true
        });
        setUser(res.data);
        await fetchTokenExpiry();
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  const login = async (email, password) => {
    try {
      const res1 = await axios.post(`${API_BASE_URL}/auth/login`, { email, password }, {
        withCredentials: true
      });

      if (res1.status !== 200) {
        return { success: false, status: res1.status, message: "Login failed" };
      }

      const res2 = await axios.get(`${API_BASE_URL}/auth/me`, {
        withCredentials: true
      });
      setUser(res2.data);
      await fetchTokenExpiry();

      return { success: true, status: 200 };
    } catch (err) {
      if (err.response) {
        return {
          success: false,
          status: err.response.status,
          message: err.response.data?.error || "Server error during login"
        };
      } else if (err.request) {
        return { success: false, status: 503, message: "No response from server" };
      } else {
        return { success: false, status: 500, message: "Unexpected error" };
      }
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/auth/logout`, {}, {
        withCredentials: true
      });
    } catch { /* empty */ }
    setUser(null);
    setTokenExpiry(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isLoggedIn }}>
      {loading ? <div>Loading authentication...</div> : children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth must be used within an AuthProvider");
  return context;
}