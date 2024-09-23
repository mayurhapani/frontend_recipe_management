import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import TaskCard from "../components/TaskCard";
import { AuthContext } from "../context/AuthProvider";
import Cookies from "universal-cookie";
import { subscribeToTaskUpdates } from "../js/socket.js";
import { messaging, requestPermission, onMessageListener } from "../firebase";
import { onMessage } from "firebase/messaging";

const cookies = new Cookies();

export default function Home() {
  const [user, setUser] = useState({});
  const [tasks, setTasks] = useState([]);

  const { isRefresh } = useContext(AuthContext);
  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const token = localStorage.getItem("token") || cookies.get("token");

    if (!token) {
      navigate("/signin");
      return;
    }

    const setupNotifications = async () => {
      const fcmToken = await requestPermission();
      if (fcmToken) {
        // Send fcmToken to your backend
        try {
          await axios.patch(
            `${BASE_URL}/users/updateFcmToken`,
            { fcmToken },
            {
              headers: {
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

    setupNotifications();

    // Fetch tasks when component mounts
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/tasks/getTasks`, {
          withCredentials: true,
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        const tasks = response.data.data;

        const categoryOrder = { high: 1, medium: 2, low: 3 };

        const sortedTasks = tasks.sort((a, b) => {
          if (a.isCompleted !== b.isCompleted) {
            return a.isCompleted - b.isCompleted;
          }
          return categoryOrder[a.category] - categoryOrder[b.category];
        });

        setTasks(sortedTasks);
      } catch (error) {
        if (error.response) {
          toast.error(error.response.data.message);
        } else {
          toast.error(error.message);
        }
      }
    };

    const fetchUser = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/users/getUser`, {
          withCredentials: true,
          headers: {
            Authorization: "Bearer " + token,
          },
        });

        setUser(response.data.data);
      } catch (error) {
        if (error.response) {
          toast.error(error.response.data.message);
        } else {
          toast.error(error.message);
        }
      }
    };

    fetchUser();
    fetchTasks();

    // Subscribe to real-time updates
    subscribeToTaskUpdates((updatedTask) => {
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task._id === updatedTask._id ? updatedTask : task))
      );
      toast.info("Task updated in real-time!");
    });

    // Handle foreground messages
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("Received foreground message:", payload);
      toast.info(payload.notification.title, {
        body: payload.notification.body,
      });
      // Optionally, you can update the tasks list here
      fetchTasks();
    });

    return () => {
      if (unsubscribe && typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, [BASE_URL, navigate, isRefresh]);

  const sendTestNotification = async () => {
    const token = localStorage.getItem("token") || cookies.get("token");
    try {
      const response = await axios.post(
        `${BASE_URL}/users/sendTestNotification`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Test notification sent", response.data);
    } catch (error) {
      console.error("Error sending test notification:", error.response?.data || error.message);
      if (error.response?.data?.details) {
        console.error("Detailed error:", error.response.data.details);
      }
    }
  };

  return (
    <div className="bg-red-200 min-h-screen">
      <div className="container mx-auto ">
        <div className="pt-28 flex flex-col items-center">
          <div className="w-2/3 rounded-sm">
            <div className="mb-4">
              <h1 className="text-grey-darkest text-3xl font-bold text-center">
                Welcome {user?.name}
              </h1>
            </div>
            <div className="mb-4">
              <h1 className="text-grey-darkest text-xl font-bold">Todo List</h1>
            </div>
            {tasks.length > 0 ? (
              tasks.map((task, index) => {
                return <TaskCard task={task} key={index} user={user} />;
              })
            ) : (
              <p>No posts available</p>
            )}
            <button onClick={sendTestNotification}>Send Test Notification</button>
          </div>
        </div>
      </div>
    </div>
  );
}
