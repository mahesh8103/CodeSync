import { createSlice } from "@reduxjs/toolkit";
const getInitialState = () => {
    try {
        const user = localStorage.getItem("user");
        const accessToken = localStorage.getItem("accessToken");
        return {
            user: user ? JSON.parse(user) : null,
            accessToken: accessToken || null,
            isAuthenticated: !!accessToken,
            loading: false
        };
    } catch (error) {
        return {
            user: null,
            accessToken: null,
            isAuthenticated: false,
            loading: false
        };
    }
};

const authSlice = createSlice({
    name: "auth",
    initialState: getInitialState(),
    reducers: {
        loginSuccess: (state, action) => {
            const { user, accessToken } = action.payload;
            state.user = user;
            state.accessToken = accessToken;
            state.isAuthenticated = true;

            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("accessToken", accessToken);
        },

        logout: (state) => {
            state.user = null;
            state.accessToken = null;
            state.isAuthenticated = false;

            localStorage.removeItem("user");
            localStorage.removeItem("accessToken");
        },

        // Update user (profile update)
        updateUser: (state, action) => {
            state.user = { ...state.user, ...action.payload };
            localStorage.setItem("user", JSON.stringify(state.user));
        },

        setLoading: (state, action) => {
            state.loading = action.payload;
        }
    }
});

export const { loginSuccess, logout, updateUser, setLoading } = authSlice.actions;
export default authSlice.reducer;