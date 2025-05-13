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

  const login = async (email, password) => {
    try {
      // Attempt to log in
      const res1 = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password
      }, {
        withCredentials: true
      });

      // Confirm login succeeded
      if (res1.status !== 200) {
        return { success: false, status: res1.status, message: "Login failed" };
      }

      // Attempt to fetch user data
      const res2 = await axios.get(`${API_BASE_URL}/auth/me`, {
        withCredentials: true
      });

      setUser(res2.data);
      return { success: true, status: 200 };

    } catch (err) {
      // Handle various error shapes
      if (err.response) {
        // Server responded with error
        return {
          success: false,
          status: err.response.status,
          message: err.response.data?.error || "Server error during login"
        };
      } else if (err.request) {
        // Request made but no response
        return {
          success: false,
          status: 503,
          message: "No response from server"
        };
      } else {
        // Something else triggered the error
        return {
          success: false,
          status: 500,
          message: "Unexpected error"
        };
      }
    }
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