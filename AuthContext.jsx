import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { getMe, loginLocal, loginSso } from "./authService.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await getMe();
        setUser(response.data.data);
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("demo_user");
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  useEffect(() => {
    // Simulate session timeout for security demo.
    if (!user) return;
    const timeout = setTimeout(() => {
      toast.info("Session expired for security. Please sign in again.");
      logout();
    }, 30 * 60 * 1000);

    return () => clearTimeout(timeout);
  }, [user]);

  const login = async (email, password) => {
    const response = await loginLocal({ email, password });
    localStorage.setItem("token", response.data.data.token);
    localStorage.setItem("demo_user", JSON.stringify(response.data.data.user));
    setUser(response.data.data.user);
    toast.success("Login successful");
  };

  const loginWithProvider = async (email, provider) => {
    const response = await loginSso({ email, provider });
    localStorage.setItem("token", response.data.data.token);
    localStorage.setItem("demo_user", JSON.stringify(response.data.data.user));
    setUser(response.data.data.user);
    toast.success(`${provider} SSO successful`);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("demo_user");
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, loading, login, loginWithProvider, logout, setUser }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
