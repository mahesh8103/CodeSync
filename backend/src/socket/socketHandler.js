import { Room } from "../models/room.model.js";
import { User } from "../models/user.model.js";

const initializeSocket = (io) => {
    io.on("connection", (socket) => {

        console.log(` User connected: ${socket.id}`);
        socket.on("join-room", async (data) => {
            try {
                const { roomId, userId, userName } = data;
                if (!roomId || !userId) {
                    socket.emit("error", {
                        message: "Room ID and User ID required"
                    });
                    return;
                }
                const room = await Room.findOne({
                    roomId,
                    isActive: true
                });
                if (!room) {
                    socket.emit("error", {
                        message: "Room not found"
                    });
                    return;
                }
                socket.join(roomId);
                socket.userId = userId;
                socket.roomId = roomId;
                socket.userName = userName;
                socket.emit("room-joined", {
                    roomId: room.roomId,
                    name: room.name,
                    code: room.code,
                    language: room.language,
                    participants: room.participants
                });
                socket.to(roomId).emit("user-joined", {
                    userId,
                    userName,
                    message: `${userName} joined the room`
                });
                console.log(` ${userName} joined room: ${roomId}`);
            } catch (error) {
                console.error("Join room error:", error);
                socket.emit("error", {
                    message: "Failed to join room"
                });
            }
        });
        socket.on("code-change", async (data) => {
            try {
                const { roomId, code } = data;
                if (!roomId) {
                    return;
                }
                socket.to(roomId).emit("code-updated", {
                    code,
                    updatedBy: socket.userId,
                    userName: socket.userName
                });
            } catch (error) {
                console.error("Code change error:", error);
            }
        });
        socket.on("language-change", async (data) => {
            try {
                const { roomId, language } = data;
                if (!roomId || !language) {
                    return;
                }
                await Room.findOneAndUpdate(
                    { roomId },
                    { language }
                );
                io.to(roomId).emit("language-updated", {
                    language,
                    updatedBy: socket.userId,
                    userName: socket.userName
                });
                console.log(`Language changed to ${language} in room ${roomId}`);
            } catch (error) {
                console.error("Language change error:", error);
            }
        });
        socket.on("send-message", (data) => {
            const { roomId, message } = data;
            if (!roomId || !message) {
                return;
            }
            io.to(roomId).emit("receive-message", {
                message,
                userId: socket.userId,
                userName: socket.userName,
                timestamp: new Date()
            });
        });
        socket.on("leave-room", async (data) => {
            try {
                const { roomId } = data;
                if (!roomId) return;
                socket.leave(roomId);
                socket.to(roomId).emit("user-left", {
                    userId: socket.userId,
                    userName: socket.userName,
                    message: `${socket.userName} left the room`
                });

                console.log(` ${socket.userName} left room: ${roomId}`);

            } catch (error) {
                console.error("Leave room error:", error);
            }
        });
        socket.on("disconnect", async () => {
            try {
                console.log(` User disconnected: ${socket.id}`);
                if (socket.roomId) {
                    socket.to(socket.roomId).emit("user-left", {
                        userId: socket.userId,
                        userName: socket.userName,
                        message: `${socket.userName} disconnected`
                    });
                }
            } catch (error) {
                console.error("Disconnect error:", error);
            }
        });

    });
};


export { initializeSocket };