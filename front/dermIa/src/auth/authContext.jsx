import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // initial loading state

  // Check login status on first render
  useEffect(() => {
    axios.get(`${API_BASE_URL}/auth/me`, {
      withCredentials: true,
    })
      .then(res => {
        setUser(res.data); // or just user_id
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  // Login function
  const login = async (username, password) => {
    await axios.post(`${API_BASE_URL}/auth/login`, {
      username,
      password
    }, {
      withCredentials: true
    });

    // Fetch user info again after login
    const res = await axios.get(`${API_BASE_URL}/auth/me`, {
      withCredentials: true
    });

    setUser(res.data);
  };

  // Logout function
  const logout = async () => {
    await axios.post(`${API_BASE_URL}/auth/logout`, {}, {
      withCredentials: true
    });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to access auth context
export function useAuth() {
  return useContext(AuthContext);
}