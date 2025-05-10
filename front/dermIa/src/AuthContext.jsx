import React, { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

// 1. Création du contexte d'authentification
const AuthContext = createContext(null);

// 2. AuthProvider : wrapper autour de l'app pour fournir user, login, logout
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Au démarrage, on récupère l'utilisateur stocké en localStorage (s'il existe)
  useEffect(() => {
    const storedUser = localStorage.getItem("userProfile");
    if (storedUser && storedUser !== "undefined") {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parsing userProfile from localStorage:", e);
        localStorage.removeItem("userProfile");
      }
    }
  }, []);

  // Fonction de login : stocke user et token
  const login = (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userProfile", JSON.stringify(userData));
    setUser(userData);
  };

  // Fonction de logout : nettoie le contexte et le localStorage
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userProfile");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// 3. Hook personnalisé pour accéder au contexte
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
