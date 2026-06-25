import axiosInstance from "./axios.js";

export const codeAPI = {

    // Get supported languages
    getLanguages: async () => {
        const response = await axiosInstance.get("/code/languages");
        return response.data;
    },

    // Get daily usage
    getDailyUsage: async () => {
        const response = await axiosInstance.get("/code/usage");
        return response.data;
    },

    // Run code
    runCode: async (data) => {
        const response = await axiosInstance.post("/code/run", data);
        return response.data;
    }
};