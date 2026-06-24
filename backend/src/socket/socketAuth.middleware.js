import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
const socketAuthMiddleware = async (socket, next) => {
    try {
        const token = socket.handshake.auth?.token ||
                      socket.handshake.headers?.token;
        if (!token) {
            return next(new Error("Authentication required: No token provided"));
        }
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded._id).select(
            "-password -refreshToken -otp -otpExpire"
        );
        if (!user) {
            return next(new Error("Authentication failed: User not found"));
        }
        if (!user.isVerified) {
            return next(new Error("Authentication failed: Email not verified"));
        }
        socket.user = user;
        socket.userId = user._id.toString();
        socket.userName = user.fullName;
        next();
    } catch (error) {
        console.error("Socket auth error:", error.message);
        if (error.name === "JsonWebTokenError") {
            return next(new Error("Authentication failed: Invalid token"));
        }
        if (error.name === "TokenExpiredError") {
            return next(new Error("Authentication failed: Token expired"));
        }
        next(new Error("Authentication failed"));
    }
};

export { socketAuthMiddleware };