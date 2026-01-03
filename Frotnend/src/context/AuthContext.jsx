import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await api.get("/auth/refresh");
        setUser(data.user);

        setupAxiosInterceptor(data.accessToken);
      } catch (error) {
        console.log("Not logged in");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const setupAxiosInterceptor = (token) => {
    api.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  };

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    setUser(data.user);
    setupAxiosInterceptor(data.accessToken);
    return data;
  };

  const register = async (username, email, password) => {
    const { data } = await api.post("/auth/", {
      username,
      email,
      password,
    });
    return data;
  };

  const logout = async () => {
    await api.post("/auth/logout");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
