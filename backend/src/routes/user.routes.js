import { Router } from "express";
import {
    registerUser,
    verifyOTP,
    resendOTP,
    loginUser,
    logoutUser,
    refreshAccessToken,
    forgotPassword,
    resetPassword,
    changeCurrentPassword,
    getCurrentUser,
    updateProfile,
    updateUserAvatar
} from "../controllers/user.controller.js";
import {upload} from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";


const router=Router();

// Public routes
router.route("/register").post(registerUser)
router.route("/verify-otp").post(verifyOTP);
router.route("/resend-otp").post(resendOTP);

// Login route
router.route("/login").post(loginUser)

// Password Reset
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password/:token").post(resetPassword);

// Refresh Token
router.route("/refresh-token").post(refreshAccessToken);

// protected routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/me").get(verifyJWT, getCurrentUser);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/update-profile").patch(verifyJWT, updateProfile);
router.route("/update-avatar").patch(
    verifyJWT,
    upload.single("avatar"),
    updateUserAvatar
);

export default router