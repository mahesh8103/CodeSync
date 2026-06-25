import axiosInstance from "./axios.js";

export const snippetAPI = {

    // Create snippet
    createSnippet: async (data) => {
        const response = await axiosInstance.post("/snippets/", data);
        return response.data;
    },

    // Get my snippets
    getMySnippets: async () => {
        const response = await axiosInstance.get("/snippets/my");
        return response.data;
    },

    // Get public snippets
    getPublicSnippets: async (language) => {
        const url = language
            ? `/snippets/public?language=${language}`
            : "/snippets/public";
        const response = await axiosInstance.get(url);
        return response.data;
    },

    // Get single snippet
    getSnippetById: async (id) => {
        const response = await axiosInstance.get(`/snippets/${id}`);
        return response.data;
    },

    // Update snippet
    updateSnippet: async (id, data) => {
        const response = await axiosInstance.patch(`/snippets/${id}`, data);
        return response.data;
    },

    // Delete snippet
    deleteSnippet: async (id) => {
        const response = await axiosInstance.delete(`/snippets/${id}`);
        return response.data;
    }
};