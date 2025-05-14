// plugins/socket.io.client.ts
import { io, type Socket } from "socket.io-client";

export default defineNuxtPlugin((nuxtApp) => {
  const socket: Socket = io("http://localhost:3001", {
    transports: ["websocket"], // or ['polling', 'websocket'] if needed
    withCredentials: true,
  });

  // Make it available globally
  nuxtApp.provide("socket", socket);
});
