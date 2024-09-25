import { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import GlobalLoader from "../components/GlobalLoader";
import PropTypes from "prop-types";

// Set axios to always send credentials
axios.defaults.withCredentials = true;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const checkLoginStatus = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      console.log("Checking login status, token:", token); // Add this log
      if (token) {
        const response = await axios.get(`${BASE_URL}/users/getUser`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("User data from server:", response.data.data); // Add this log
        setUser(response.data.data);
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    } catch (error) {
      console.error("Error checking login status:", error);
      setIsLoggedIn(false);
      setUser(null);
      localStorage.removeItem("token"); // Clear the token if there's an error
    } finally {
      setLoading(false);
    }
  }, [BASE_URL]);

  useEffect(() => {
    checkLoginStatus();
  }, [checkLoginStatus]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const login = async (email, password) => {
    try {
      console.log("Attempting login...");
      const response = await axios.post(`${BASE_URL}/users/login`, {
        email,
        password,
      });
      console.log("Login response:", response.data);
      if (response.data.success) {
        console.log("Setting user:", response.data.data.user); // Add this log
        setUser(response.data.data.user);
        localStorage.setItem("token", response.data.data.token);
        setIsLoggedIn(true);
        await checkLoginStatus();
      }
      return response.data;
    } catch (error) {
      console.error("Login error:", error.response ? error.response.data : error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log("Attempting logout...");
      await axios.get(`${BASE_URL}/users/logout`, { withCredentials: true });
      localStorage.removeItem("token"); // Clear the token
      setIsLoggedIn(false);
      setUser(null);
      console.log("Logout successful");
    } catch (error) {
      console.error("Logout error:", error.response ? error.response.data : error.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, user, loading, setLoading, login, logout, checkLoginStatus }}
    >
      {loading && <GlobalLoader />}
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
