import { useState, useRef, useEffect } from "react";import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {User, Mail, Lock, Camera, Save,Eye, EyeOff, LogOut, BookMarked, Code2 } from "lucide-react";
import toast from "react-hot-toast";

import { authAPI } from "../api/authAPI.js";
import { updateUser, logout } from "../store/authSlice.js";
import { disconnectSocket } from "../socket/socket.js";
import Navbar from "../components/common/Navbar.jsx";
import Loader from "../components/common/Loader.jsx";
import { roomAPI } from "../api/roomAPI.js";
import { snippetAPI } from "../api/snippetAPI.js";

const Profile = () => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [activeTab, setActiveTab] = useState("info");

    // Profile info state
    const [profileForm, setProfileForm] = useState({
        fullName: user?.fullName || "",
        email: user?.email || ""
    });
    const [profileLoading, setProfileLoading] = useState(false);

    // Password state
    const [passwordForm, setPasswordForm] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);

    // Avatar state
    const [avatarLoading, setAvatarLoading] = useState(false);

    // Update profile info
    const handleProfileSubmit = async (e) => {
        e.preventDefault();

        if (!profileForm.fullName.trim()) {
            toast.error("Full name is required");
            return;
        }

        setProfileLoading(true);
        try {
            const response = await authAPI.updateProfile({
                fullName: profileForm.fullName.trim(),
                email: profileForm.email.trim()
            });

            dispatch(updateUser(response.data));
            toast.success("Profile updated successfully!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Update failed");
        } finally {
            setProfileLoading(false);
        }
    };
    // Stats state
const [stats, setStats] = useState({
    rooms: 0,
    snippets: 0
});

useEffect(() => {
    let isCancelled = false;

    const fetchStats = async () => {
        try {
            const [roomsRes, snippetsRes] = await Promise.all([
                roomAPI.getMyRooms(),
                snippetAPI.getMySnippets()
            ]);

            if (!isCancelled) {
                setStats({
                    rooms: roomsRes.data?.length || 0,
                    snippets: snippetsRes.data?.length || 0
                });
            }
        } catch (error) {
            console.error("Failed to fetch stats:", error);
        }
    };

    fetchStats();

    return () => {
        isCancelled = true;
    };
}, []);

    // Change password
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        if (!passwordForm.oldPassword || !passwordForm.newPassword) {
            toast.error("All password fields are required");
            return;
        }

        if (passwordForm.newPassword.length < 6) {
            toast.error("New password must be at least 6 characters");
            return;
        }

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setPasswordLoading(true);
        try {
            await authAPI.changePassword({
                oldPassword: passwordForm.oldPassword,
                newPassword: passwordForm.newPassword
            });

            toast.success("Password changed successfully!");
            setPasswordForm({
                oldPassword: "",
                newPassword: "",
                confirmPassword: ""
            });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to change password");
        } finally {
            setPasswordLoading(false);
        }
    };

    // Avatar upload
    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image must be less than 5MB");
            return;
        }

        const formData = new FormData();
        formData.append("avatar", file);

        setAvatarLoading(true);
        try {
            const response = await authAPI.updateAvatar(formData);
            dispatch(updateUser(response.data));
            toast.success("Avatar updated!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to upload avatar");
        } finally {
            setAvatarLoading(false);
        }
    };

    // Logout
    const handleLogout = async () => {
        if (!window.confirm("Are you sure you want to logout?")) return;

        try {
            await authAPI.logout();
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            disconnectSocket();
            dispatch(logout());
            toast.success("Logged out successfully");
            navigate("/login");
        }
    };

    return (
        <div className="min-h-screen bg-dark-bg text-white">
            <Navbar />

            <div className="max-w-4xl mx-auto px-6 py-8">

                {/* Header Card */}
                <div className="bg-dark-card border border-dark-border rounded-xl p-6 mb-6">
                    <div className="flex flex-col md:flex-row items-center gap-6">

                        {/* Avatar */}
                        <div className="relative">
                            <div
                                onClick={handleAvatarClick}
                                className="w-28 h-28 rounded-full overflow-hidden cursor-pointer group relative border-4 border-primary"
                            >
                                {user?.avatar ? (
                                    <img
                                        src={user.avatar}
                                        alt={user.fullName}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-primary flex items-center justify-center text-white text-4xl font-bold">
                                        {user?.fullName?.charAt(0)?.toUpperCase()}
                                    </div>
                                )}

                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                    {avatarLoading ? (
                                        <Loader size="sm" />
                                    ) : (
                                        <Camera className="w-6 h-6 text-white" />
                                    )}
                                </div>
                            </div>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                className="hidden"
                            />
                        </div>

                        {/* Info */}
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-2xl font-bold text-white">
                                {user?.fullName}
                            </h1>
                            <p className="text-gray-400 flex items-center gap-2 justify-center md:justify-start mt-1">
                                <Mail className="w-4 h-4" />
                                {user?.email}
                            </p>

                            <div className="flex gap-4 mt-3 justify-center md:justify-start">
    <div className="flex items-center gap-1 text-sm text-gray-400">
        <Code2 className="w-4 h-4 text-primary" />
        {stats.rooms} {stats.rooms === 1 ? "Room" : "Rooms"}
    </div>
    <div className="flex items-center gap-1 text-sm text-gray-400">
        <BookMarked className="w-4 h-4 text-primary" />
        {stats.snippets} {stats.snippets === 1 ? "Snippet" : "Snippets"}
    </div>
</div>
                        </div>

                        {/* Logout */}
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 border-b border-dark-border mb-6">
                    <button
                        onClick={() => setActiveTab("info")}
                        className={`px-4 py-2 font-medium transition ${
                            activeTab === "info"
                                ? "text-primary border-b-2 border-primary"
                                : "text-gray-400 hover:text-white"
                        }`}
                    >
                        Profile Info
                    </button>
                    <button
                        onClick={() => setActiveTab("password")}
                        className={`px-4 py-2 font-medium transition ${
                            activeTab === "password"
                                ? "text-primary border-b-2 border-primary"
                                : "text-gray-400 hover:text-white"
                        }`}
                    >
                        Change Password
                    </button>
                </div>

                {/* Profile Info Tab */}
                {activeTab === "info" && (
                    <div className="bg-dark-card border border-dark-border rounded-xl p-6">
                        <h2 className="text-xl font-bold text-white mb-4">
                            Update Profile
                        </h2>

                        <form onSubmit={handleProfileSubmit} className="space-y-4">

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={profileForm.fullName}
                                        onChange={(e) => setProfileForm({
                                            ...profileForm,
                                            fullName: e.target.value
                                        })}
                                        className="w-full pl-11 pr-4 py-3 bg-dark-bg border border-dark-border rounded-lg focus:border-primary focus:outline-none text-white"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        value={profileForm.email}
                                        onChange={(e) => setProfileForm({
                                            ...profileForm,
                                            email: e.target.value
                                        })}
                                        className="w-full pl-11 pr-4 py-3 bg-dark-bg border border-dark-border rounded-lg focus:border-primary focus:outline-none text-white"
                                    />
                                </div>
                                <p className="text-xs text-yellow-400 mt-1">
                                    Changing email may require re-verification
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={profileLoading}
                                className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark rounded-lg font-semibold text-white transition disabled:opacity-50"
                            >
                                {profileLoading ? (
                                    <Loader size="sm" />
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                )}

                {/* Password Tab */}
                {activeTab === "password" && (
                    <div className="bg-dark-card border border-dark-border rounded-xl p-6">
                        <h2 className="text-xl font-bold text-white mb-4">
                            Change Password
                        </h2>

                        <form onSubmit={handlePasswordSubmit} className="space-y-4">

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Current Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                    <input
                                        type={showOldPassword ? "text" : "password"}
                                        value={passwordForm.oldPassword}
                                        onChange={(e) => setPasswordForm({
                                            ...passwordForm,
                                            oldPassword: e.target.value
                                        })}
                                        placeholder="Enter current password"
                                        className="w-full pl-11 pr-12 py-3 bg-dark-bg border border-dark-border rounded-lg focus:border-primary focus:outline-none text-white"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowOldPassword(!showOldPassword)}
                                        className="absolute right-3 top-3 text-gray-400 hover:text-white"
                                    >
                                        {showOldPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    New Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        value={passwordForm.newPassword}
                                        onChange={(e) => setPasswordForm({
                                            ...passwordForm,
                                            newPassword: e.target.value
                                        })}
                                        placeholder="Enter new password"
                                        className="w-full pl-11 pr-12 py-3 bg-dark-bg border border-dark-border rounded-lg focus:border-primary focus:outline-none text-white"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-3 top-3 text-gray-400 hover:text-white"
                                    >
                                        {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    At least 6 characters
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Confirm New Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        value={passwordForm.confirmPassword}
                                        onChange={(e) => setPasswordForm({
                                            ...passwordForm,
                                            confirmPassword: e.target.value
                                        })}
                                        placeholder="Re-enter new password"
                                        className="w-full pl-11 pr-4 py-3 bg-dark-bg border border-dark-border rounded-lg focus:border-primary focus:outline-none text-white"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={passwordLoading}
                                className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark rounded-lg font-semibold text-white transition disabled:opacity-50"
                            >
                                {passwordLoading ? (
                                    <Loader size="sm" />
                                ) : (
                                    <>
                                        <Lock className="w-4 h-4" />
                                        Change Password
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;