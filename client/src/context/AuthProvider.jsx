import { useCallback, useMemo, useState } from "react";
import { AuthContext } from "./AuthContext";
import { getCurrentUser, loginUser } from "../api/authApi";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    return localStorage.getItem("digitalKrishiiToken");
  });

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("digitalKrishiiUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = useCallback(async (credentials) => {
    const response = await loginUser(credentials);

    const loggedInUser = response.data.user;
    const authToken = response.data.token;

    localStorage.setItem("digitalKrishiiToken", authToken);
    localStorage.setItem("digitalKrishiiUser", JSON.stringify(loggedInUser));

    setToken(authToken);
    setUser(loggedInUser);

    return loggedInUser;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("digitalKrishiiToken");
    localStorage.removeItem("digitalKrishiiUser");

    setToken(null);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const response = await getCurrentUser();

      const currentUser = response.user || response.data?.user || response.data;

      if (currentUser) {
        localStorage.setItem("digitalKrishiiUser", JSON.stringify(currentUser));
        setUser(currentUser);
      }

      return currentUser;
    } catch {
      logout();
      return null;
    }
  }, [logout]);

  const value = useMemo(() => {
    return {
      user,
      token,
      isAuthenticated: Boolean(token),
      login,
      logout,
      refreshUser,
    };
  }, [user, token, login, logout, refreshUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
