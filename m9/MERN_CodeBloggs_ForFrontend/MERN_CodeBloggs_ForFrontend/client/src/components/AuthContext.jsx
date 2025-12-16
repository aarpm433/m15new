import React, { createContext, useContext, useState, useEffect } from "react";
import { useCookies } from "react-cookie";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [cookies,setCookie,removeCookie] = useCookies(["session_token"]);



  useEffect(() => {
    const validateToken = async () => {
      const token = cookies.session_token;
      if (!token) {
        setIsLoggedIn(false);
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch(`http://localhost:5050/validate_token?token=${token}`);
        const data = await res.json();

        if (data.data?.valid) {
          setIsLoggedIn(true);
          setUser(data.data.user); // store user info to display in navbar
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      } catch (err) {
        setIsLoggedIn(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    validateToken();
  }, [cookies]);

  const login = () => setIsLoggedIn(true);
  const logout = () => {
    removeCookie("session_token", { path: "/" });
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isLoading, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
