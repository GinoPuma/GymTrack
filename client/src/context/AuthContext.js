import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(() => {
    const storedUserInfo = localStorage.getItem("userInfo");
    return storedUserInfo ? JSON.parse(storedUserInfo) : null;
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadSession = () => {
      const storedUserInfo = localStorage.getItem("userInfo");
      if (storedUserInfo) {
        try {
          const parsedUserInfo = JSON.parse(storedUserInfo);
          setUserInfo(parsedUserInfo);
          if (parsedUserInfo && parsedUserInfo.token) {
            axios.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${parsedUserInfo.token}`;
          }
        } catch (e) {
          console.error(
            "AuthContext: Error parseando userInfo de localStorage:",
            e
          );
          localStorage.removeItem("userInfo");
          setUserInfo(null);
        }
      }
      setLoading(false);
    };

    loadSession();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const { data } = await axios.post("/auth/login", { email, password });

      setUserInfo(data);
      localStorage.setItem("userInfo", JSON.stringify(data));

      if (data && data.token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
      }

      if (data.role === "trainer") {
        navigate("/trainer-dashboard");
      } else if (data.role === "client") {
        navigate("/client-dashboard");
      } else if (data.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error(
        "AuthContext: Login fallido:",
        error.response?.data?.message || error.message || error
      );
      setUserInfo(null);
      localStorage.removeItem("userInfo");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    username,
    email,
    password,
    role,
    trainerId = null,
    adminAccessKey = undefined 
  ) => {
    try {
      setLoading(true);
      const { data } = await axios.post("/auth/register", {
        username,
        email,
        password,
        role,
        trainerId,
        adminAccessKey,
      });

      setUserInfo(data);
      localStorage.setItem("userInfo", JSON.stringify(data));

      if (data && data.token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
      }

      if (data.role === "trainer") {
        navigate("/trainer-dashboard");
      } else if (data.role === "client") {
        navigate("/client-dashboard");
      } else if (data.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error(
        "AuthContext: Registro fallido:",
        error.response?.data?.message || error.message || error
      );
      setUserInfo(null);
      localStorage.removeItem("userInfo");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUserInfo(null);
    localStorage.removeItem("userInfo");
    delete axios.defaults.headers.common["Authorization"];
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{ userInfo, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
