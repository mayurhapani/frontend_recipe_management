import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAWk0pfI3SaUFnZo5vZoUVN8qC9Iq_gl1g",
  authDomain: "task-management-app-507ed.firebaseapp.com",
  projectId: "task-management-app-507ed",
  storageBucket: "task-management-app-507ed.appspot.com",
  messagingSenderId: "71925330979",
  appId: "1:71925330979:web:28c17983033c00013d6d96",
  measurementId: "G-N4H06N05TN",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestPermission = async () => {
  if (!("serviceWorker" in navigator)) {
    console.warn(
      "Service workers are not supported by this browser. FCM notifications won't be available."
    );
    return;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      try {
        const token = await getToken(messaging, {
          vapidKey:
            "BAE07LR0f5clAa9CW3KAbb03wrqL7fgMrR4PP9BegR-Cv-DxW5rWjiH-9X7sJPwgYrJcKyEOldkkhIdKqtlSWQ4",
        });
        if (token) {
          console.log("FCM Token:", token);
          return token;
        } else {
          console.warn("No registration token available.");
        }
      } catch (tokenError) {
        console.error("An error occurred while retrieving token. ", tokenError);
      }
    } else {
      console.log("Permission not granted for Notification");
    }
  } catch (err) {
    console.error("Error getting FCM token:", err);
  }
};

// Listen for messages when the app is open
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });

// Export the messaging object
export { messaging };
