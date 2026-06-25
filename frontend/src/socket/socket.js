import { io } from "socket.io-client";
let socket = null;

export const initSocket = () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
        console.error("No token found, cannot connect socket");
        return null;
    }

    if (socket) {
        socket.disconnect();
    }

    socket = io(import.meta.env.VITE_SOCKET_URL, {
        auth: {
            token: token
        },
        autoConnect: true,
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5
    });

    socket.on("connect", () => {
        console.log(" Socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
        console.log(" Socket disconnected");
    });

    socket.on("connect_error", (error) => {
        console.error("Socket connection error:", error.message);
    });

    return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};