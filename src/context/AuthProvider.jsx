import { createContext, useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { getToken, setToken, removeToken } from "../utils/tokenUtils.js";
import GlobalLoader from "../components/GlobalLoader.jsx";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkLoginStatus = useCallback(async () => {
    try {
      setLoading(true);
      const token = getToken();
      if (token) {
        const response = await axios.get(`${BASE_URL}/users/getUser`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data.data);
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error("Error checking login status:", error);
      removeToken();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkLoginStatus();
  }, [checkLoginStatus]);

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/users/login`,
        { email, password },
        { withCredentials: true }
      );
      if (response.data.success && response.data.data && response.data.data.token) {
        setToken(response.data.data.token);
        setIsLoggedIn(true);
        setUser(response.data.data.user);
        return response.data;
      }
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  };

  const logout = () => {
    removeToken();
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        loading,
        setLoading,
        login,
        logout,
        checkLoginStatus,
      }}
    >
      {loading && <GlobalLoader />}
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};