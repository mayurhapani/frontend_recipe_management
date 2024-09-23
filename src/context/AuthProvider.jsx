import { createContext, useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";

// Set axios to always send credentials
axios.defaults.withCredentials = true;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      console.log("Checking login status...");
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/getUser`);
      console.log("Login status response:", response.data);
      if (response.data.data) {
        setIsLoggedIn(true);
        setUserName(response.data.data.name);
      } else {
        setIsLoggedIn(false);
        setUserName("");
      }
    } catch (error) {
      console.log("Error checking login status:", error);
      setIsLoggedIn(false);
      setUserName("");
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      console.log("Attempting login...");
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`, {
        email,
        password,
      });
      console.log("Login response:", response.data);
      if (response.data.data) {
        setIsLoggedIn(true);
        setUserName(response.data.data.user.name);
        // Immediately check login status after successful login
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
      await axios.get(`${import.meta.env.VITE_BASE_URL}/users/logout`, { withCredentials: true });
      setIsLoggedIn(false);
      setUserName("");
      console.log("Logout successful");
    } catch (error) {
      console.error("Logout error:", error.response ? error.response.data : error.message);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>; // Or any loading indicator you prefer
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, userName, login, logout, checkLoginStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
