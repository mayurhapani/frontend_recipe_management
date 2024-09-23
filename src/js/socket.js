import { io } from "socket.io-client";

// const socket = io("http://localhost:8001");
const socket = io("http://localhost:8001");

export const subscribeToTaskUpdates = (callback) => {
  socket.on("task-updated", (data) => {
    console.log("Task updated: ", data);
    callback(data);
  });
};

export const notifyTaskUpdate = (task) => {
  socket.emit("update-task", task);
};
