import axiosInstance from "./axios.js";

export const roomAPI = {

    // Create new room
    createRoom: async (data) => {
        const response = await axiosInstance.post("/rooms/create", data);
        return response.data;
    },

    // Get my rooms
    getMyRooms: async () => {
        const response = await axiosInstance.get("/rooms/my-rooms");
        return response.data;
    },

    // Get single room
    getRoomById: async (roomId) => {
        const response = await axiosInstance.get(`/rooms/${roomId}`);
        return response.data;
    },

    // Join room
    joinRoom: async (roomId, data = {}) => {
        const response = await axiosInstance.post(`/rooms/${roomId}/join`, data);
        return response.data;
    },

    // Leave room
    leaveRoom: async (roomId) => {
        const response = await axiosInstance.post(`/rooms/${roomId}/leave`);
        return response.data;
    },

    // Update room
    updateRoom: async (roomId, data) => {
        const response = await axiosInstance.patch(`/rooms/${roomId}`, data);
        return response.data;
    },

    // Lock/Unlock room
    toggleLock: async (roomId) => {
        const response = await axiosInstance.patch(`/rooms/${roomId}/lock`);
        return response.data;
    },

    // Delete room
    deleteRoom: async (roomId) => {
        const response = await axiosInstance.delete(`/rooms/${roomId}`);
        return response.data;
    }
};