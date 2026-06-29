import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {  Code2,  LogOut,  User,  BookMarked,  LayoutDashboard } from "lucide-react";
import toast from "react-hot-toast";

import { authAPI } from "../../api/authAPI.js";
import { logout } from "../../store/authSlice.js";
import { disconnectSocket } from "../../socket/socket.js";

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const [dropdownOpen, setDropdownOpen] = useState(false);

   
    const handleLogout = async () => {
        try {
            await authAPI.logout();
        } catch (error) {
            // Even if API fails, logout locally
        } finally {
            disconnectSocket();
            dispatch(logout());
            toast.success("Logged out successfully");
            navigate("/login");
        }
    };

    return (
        <nav className="bg-dark-card border-b border-dark-border px-6 py-4 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex justify-between items-center">

                {/* Logo */}
                <Link to="/dashboard" className="flex items-center gap-2">
                    <Code2 className="w-7 h-7 text-primary" />
                    <span className="text-xl font-bold text-white">
                        CodeSync
                    </span>
                </Link>

                {/* Nav Links - Desktop */}
                <div className="hidden md:flex items-center gap-6">
                    <Link
                        to="/dashboard"
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition"
                    >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                    </Link>
                    <Link
                        to="/snippets"
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition"
                    >
                        <BookMarked className="w-4 h-4" />
                        Snippets
                    </Link>
                </div>

                {/* User Menu */}
                <div className="relative">
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center gap-2 hover:opacity-80 transition"
                    >
                        {/* Avatar - image OR first letter */}
                        {user?.avatar ? (
                            <img
                                src={user.avatar}
                                alt={user.fullName}
                                className="w-9 h-9 rounded-full object-cover border-2 border-primary"
                            />
                        ) : (
                            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                                {user?.fullName?.charAt(0)?.toUpperCase()}
                            </div>
                        )}
                        <span className="hidden md:block text-white text-sm">
                            {user?.fullName}
                        </span>
                    </button>

                    {/* Dropdown Menu */}
                    {dropdownOpen && (
                        <>
                            {/* Backdrop to close dropdown */}
                            <div
                                className="fixed inset-0 z-40"
                                onClick={() => setDropdownOpen(false)}
                            />

                            <div className="absolute right-0 top-12 w-56 bg-dark-card border border-dark-border rounded-lg shadow-xl z-50">
                                {/* User info */}
                                <div className="p-3 border-b border-dark-border">
                                    <p className="text-white font-medium text-sm">
                                        {user?.fullName}
                                    </p>
                                    <p className="text-gray-400 text-xs truncate">
                                        {user?.email}
                                    </p>
                                </div>

                                {/* Menu Items */}
                                <div className="p-1">
                                    <button
                                        onClick={() => {
                                            setDropdownOpen(false);
                                            navigate("/profile");
                                        }}
                                        className="w-full flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white hover:bg-dark-bg rounded-lg transition text-sm"
                                    >
                                        <User className="w-4 h-4" />
                                        Profile
                                    </button>

                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-2 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-dark-bg rounded-lg transition text-sm"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>

            </div>
        </nav>
    );
};

export default Navbar;