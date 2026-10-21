"use client";

import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

const SOCKET_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/api(\/v1)?\/?$/, "") ||
  "http://localhost:4000";

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      withCredentials: true,
      autoConnect: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      // Socket connected
    });
  }

  return socket;
};

export const joinRideRoom = (rideId: string) => {
  const s = getSocket();
  s.emit("ride:join", { rideId });
};

export const leaveRideRoom = (rideId: string) => {
  const s = getSocket();
  s.emit("ride:leave", { rideId });
};

export const joinUserChannel = (userId: string, role?: string) => {
  const s = getSocket();
  s.emit("join:user", { userId, role });
};

export default getSocket;

