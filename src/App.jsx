import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/AuthProvider";
import axios from "axios";

import Header from "./components/Header";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import AddTask from "./pages/AddTask";
import Logout from "./components/Logout";
import OtherUserProfile from "./pages/OtherUserProfile";

import { requestPermission } from "./firebase.js"; // Firebase import for permissions
import { useEffect } from "react";

function App() {
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    // Register Service Worker
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/firebase-messaging-sw.js")
          .then((registration) => {
            console.log("Service Worker registered with scope:", registration.scope);
          })
          .catch((err) => {
            console.error("Service Worker registration failed:", err);
          });
      });
    }
  }, []);

  useEffect(() => {
    // Request Notification Permission and Fetch FCM Token
    const token = localStorage.getItem("token");

    const getTokenAndUpdate = async () => {
      const fcmToken = await requestPermission();
      if (fcmToken) {
        console.log("FCM token:", fcmToken);
        try {
          await axios.patch(
            `${BASE_URL}/users/updateFcmToken`,
            { fcmToken },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log("FCM token updated successfully");
        } catch (error) {
          console.error("Error updating FCM token:", error);
        }
      }
    };

    getTokenAndUpdate();
  }, []);

  useEffect(() => {
    const updateFCMToken = async () => {
      const fcmToken = await requestPermission();
      if (fcmToken) {
        // Send fcmToken to your backend
        try {
          await axios.patch(
            `${BASE_URL}/users/updateFcmToken`,
            { fcmToken },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          console.log("FCM token updated successfully");
        } catch (error) {
          console.error("Error updating FCM token:", error);
        }
      }
    };

    updateFCMToken();
  }, []);

  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/addTask" element={<AddTask />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/otherUserProfile/:id" element={<OtherUserProfile />} />
          </Routes>
          <ToastContainer />
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
