import { useEffect, useState } from "react";
import { initSocket, getSocket, disconnectSocket } from "../socket/socket.js";

const useSocket = () => {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // Initialize socket
        let socketInstance = getSocket();
        if (!socketInstance) {
            socketInstance = initSocket();
        }

        if (!socketInstance) {
            console.error("Failed to initialize socket");
            return;
        }

        setSocket(socketInstance);

        // Connection events
        const onConnect = () => setIsConnected(true);
        const onDisconnect = () => setIsConnected(false);

        socketInstance.on("connect", onConnect);
        socketInstance.on("disconnect", onDisconnect);

        // Set initial connected state
        if (socketInstance.connected) {
            setIsConnected(true);
        }

        return () => {
            socketInstance.off("connect", onConnect);
            socketInstance.off("disconnect", onDisconnect);
        };
    }, []);

    return { socket, isConnected };
};

export default useSocket;