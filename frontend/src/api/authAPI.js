import axiosInstance from "./axios.js";
export const authAPI = {
    register: async (data) => {
        const response = await axiosInstance.post("/auth/register", data);
        return response.data;
    },

    verifyOTP: async (data) => {
        const response = await axiosInstance.post("/auth/verify-otp", data);
        return response.data;
    },

    // Resend OTP
    resendOTP: async (data) => {
        const response = await axiosInstance.post("/auth/resend-otp", data);
        return response.data;
    },

    // Login
    login: async (data) => {
        const response = await axiosInstance.post("/auth/login", data);
        return response.data;
    },

    // Logout
    logout: async () => {
        const response = await axiosInstance.post("/auth/logout");
        return response.data;
    },

    // Forgot password
    forgotPassword: async (data) => {
        const response = await axiosInstance.post("/auth/forgot-password", data);
        return response.data;
    },

    // Reset password
    resetPassword: async (token, data) => {
        const response = await axiosInstance.post(
            `/auth/reset-password/${token}`,
            data
        );
        return response.data;
    },

    // Get current user
    getCurrentUser: async () => {
        const response = await axiosInstance.get("/auth/me");
        return response.data;
    },

    // Update profile
    updateProfile: async (data) => {
        const response = await axiosInstance.patch("/auth/update-profile", data);
        return response.data;
    },

    // Change password
    changePassword: async (data) => {
        const response = await axiosInstance.post("/auth/change-password", data);
        return response.data;
    },
    //update avatar
     updateAvatar: async (formData) => {
        const response = await axiosInstance.patch("/users/update-avatar", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        return response.data;
    }
};