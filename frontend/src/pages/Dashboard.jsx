import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    Plus, LogIn, Trash2, Users,
    Clock, Code2, Lock, Globe,
    ArrowRight, X, Hash
} from "lucide-react";
import toast from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";

import { roomAPI } from "../api/roomAPI.js";
import Navbar from "../components/common/Navbar.jsx";
import Loader from "../components/common/Loader.jsx";

// SUPPORTED LANGUAGES
const LANGUAGES = [
    { label: "JavaScript", value: "javascript" },
    { label: "Python",     value: "python"     },
    { label: "Java",       value: "java"       },
    { label: "C++",        value: "cpp"        },
    { label: "C",          value: "c"          },
    { label: "TypeScript", value: "typescript" },
    { label: "Go",         value: "go"         },
    { label: "Rust",       value: "rust"       },
    { label: "PHP",        value: "php"        },
    { label: "Ruby",       value: "ruby"       },
];

// CREATE ROOM MODAL 
const createRoomSchema = z.object({
    name: z.string().min(3, "Room name must be at least 3 characters"),
    language: z.string(),
    maxParticipants: z.number().min(2).max(10),
    password: z.string().optional()
});

const CreateRoomModal = ({ onClose, onRoomCreated }) => {
    const [loading, setLoading] = useState(false);
    const [isPrivate, setIsPrivate] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(createRoomSchema),
        defaultValues: {
            language: "javascript",
            maxParticipants: 10
        }
    });

    const onSubmit = async (data) => {
        if (isPrivate && (!data.password || data.password.trim() === "")) {
            toast.error("Password is required for private room");
            return;
        }

        setLoading(true);
        try {
            const payload = {
                name: data.name.trim(),
                language: data.language,
                maxParticipants: Number(data.maxParticipants),
                isPrivate,
                ...(isPrivate && { password: data.password })
            };

            const response = await roomAPI.createRoom(payload);
            toast.success("Room created successfully!");
            onRoomCreated(response.data);
            onClose();
        } catch (error) {
            const message = error.response?.data?.message || "Failed to create room";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
            onClick={onClose}
        >
            <div
                className="bg-dark-card border border-dark-border rounded-xl p-6 w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">
                        Create New Room
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                    {/* Room Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Room Name
                        </label>
                        <input
                            {...register("name")}
                            type="text"
                            placeholder="My Coding Room"
                            className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg focus:border-primary focus:outline-none text-white"
                        />
                        {errors.name && (
                            <p className="text-red-400 text-sm mt-1">
                                {errors.name.message}
                            </p>
                        )}
                    </div>

                    {/* Language */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Language
                        </label>
                        <select
                            {...register("language")}
                            className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg focus:border-primary focus:outline-none text-white"
                        >
                            {LANGUAGES.map((lang) => (
                                <option key={lang.value} value={lang.value}>
                                    {lang.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Max Participants */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Max Participants
                        </label>
                        <select
                            {...register("maxParticipants", { valueAsNumber: true })}
                            className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg focus:border-primary focus:outline-none text-white"
                        >
                            {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                                <option key={n} value={n}>{n} people</option>
                            ))}
                        </select>
                    </div>

                    {/* Private Toggle */}
                   <div className="p-4 bg-dark-bg rounded-lg border border-dark-border">
    <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
            {isPrivate ? (
                <Lock className="w-5 h-5 text-yellow-400" />
            ) : (
                <Globe className="w-5 h-5 text-green-400" />
            )}
            <span className="text-white font-semibold">
                {isPrivate ? "Private Room" : "Public Room"}
            </span>
        </div>

        <button
            type="button"
            onClick={() => setIsPrivate(!isPrivate)}
            className={`w-14 h-7 rounded-full transition-colors relative ${
                isPrivate ? "bg-yellow-500" : "bg-green-500"
            }`}
        >
            <span className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform shadow-md ${
                isPrivate ? "translate-x-7" : "translate-x-0"
            }`} />
        </button>
    </div>

    <p className={`text-xs ${isPrivate ? "text-yellow-400" : "text-green-400"}`}>
        {isPrivate
            ? "🔒 Only users with password can join this room"
            : "✓ Anyone with room ID can join this room"}
    </p>
</div>

                    {/* Password (if private) */}
                    {isPrivate && (
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Room Password
                            </label>
                            <input
                                {...register("password")}
                                type="password"
                                placeholder="Enter room password"
                                className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg focus:border-primary focus:outline-none text-white"
                            />
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 border border-dark-border rounded-lg text-gray-400 hover:text-white transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3 bg-primary hover:bg-primary-dark rounded-lg font-semibold text-white transition disabled:opacity-50 flex items-center justify-center"
                        >
                            {loading ? <Loader size="sm" /> : "Create Room"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// JOIN ROOM MODAL 
const joinRoomSchema = z.object({
    roomId: z.string().length(6, "Room ID must be 6 characters"),
    password: z.string().optional()
});

const JoinRoomModal = ({ onClose }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [needsPassword, setNeedsPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(joinRoomSchema)
    });

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const payload = data.password ? { password: data.password } : {};
            const roomIdLower = data.roomId.toLowerCase();
            const response = await roomAPI.joinRoom(roomIdLower, payload);

            if (response.data?.requiresPassword && !data.password) {
                setNeedsPassword(true);
                setLoading(false);
                return;
            }

            toast.success("Joined room successfully!");
            navigate(`/room/${roomIdLower}`);
            onClose();
        } catch (error) {
            const message = error.response?.data?.message || "Failed to join room";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
            onClick={onClose}
        >
            <div
                className="bg-dark-card border border-dark-border rounded-xl p-6 w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">Join a Room</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                    {/* Room ID */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Room ID
                        </label>
                        <div className="relative">
                            <Hash className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <input
                                {...register("roomId")}
                                type="text"
                                placeholder="abc123"
                                maxLength={6}
                                className="w-full pl-11 pr-4 py-3 bg-dark-bg border border-dark-border rounded-lg focus:border-primary focus:outline-none text-white uppercase tracking-widest"
                            />
                        </div>
                        {errors.roomId && (
                            <p className="text-red-400 text-sm mt-1">
                                {errors.roomId.message}
                            </p>
                        )}
                    </div>

                    {/* Password (if needed) */}
                    {needsPassword && (
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Room Password
                            </label>
                            <input
                                {...register("password")}
                                type="password"
                                placeholder="Enter room password"
                                className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg focus:border-primary focus:outline-none text-white"
                            />
                            <p className="text-yellow-400 text-sm mt-1">
                                🔒 This room requires a password
                            </p>
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 border border-dark-border rounded-lg text-gray-400 hover:text-white transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3 bg-primary hover:bg-primary-dark rounded-lg font-semibold text-white transition disabled:opacity-50 flex items-center justify-center"
                        >
                            {loading ? <Loader size="sm" /> : "Join Room"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// DASHBOARD PAGE 
const Dashboard = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    // Fetch rooms on mount
    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            const response = await roomAPI.getMyRooms();
            setRooms(response.data || []);
        } catch (error) {
            toast.error("Failed to fetch rooms");
        } finally {
            setLoading(false);
        }
    };

    // Add new room to list 
    const handleRoomCreated = (newRoom) => {
        setRooms((prev) => [newRoom, ...prev]);
    };

    // Delete room
    const handleDelete = async (roomId, e) => {
        e.stopPropagation();

        if (!window.confirm("Are you sure you want to delete this room?")) {
            return;
        }

        setDeletingId(roomId);
        try {
            await roomAPI.deleteRoom(roomId);
            setRooms((prev) => prev.filter((r) => r.roomId !== roomId));
            toast.success("Room deleted");
        } catch (error) {
            toast.error("Failed to delete room");
        } finally {
            setDeletingId(null);
        }
    };

    // Language badge color
    const getLangColor = (lang) => {
        const colors = {
            javascript: "bg-yellow-500/20 text-yellow-400",
            python:     "bg-blue-500/20 text-blue-400",
            java:       "bg-orange-500/20 text-orange-400",
            cpp:        "bg-purple-500/20 text-purple-400",
            c:          "bg-gray-500/20 text-gray-400",
            typescript: "bg-blue-600/20 text-blue-300",
            go:         "bg-cyan-500/20 text-cyan-400",
            rust:       "bg-red-500/20 text-red-400",
            php:        "bg-indigo-500/20 text-indigo-400",
            ruby:       "bg-pink-500/20 text-pink-400",
        };
        return colors[lang] || "bg-gray-500/20 text-gray-400";
    };

    return (
        <div className="min-h-screen bg-dark-bg text-white">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">
                            Welcome back, {user?.fullName?.split(" ")[0]}! 👋
                        </h1>
                        <p className="text-gray-400 mt-1">
                            Manage your coding rooms and collaborate with your team
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowJoinModal(true)}
                            className="flex items-center gap-2 px-4 py-2 border border-dark-border hover:border-primary rounded-lg transition text-gray-300 hover:text-white"
                        >
                            <LogIn className="w-4 h-4" />
                            Join Room
                        </button>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark rounded-lg transition font-semibold"
                        >
                            <Plus className="w-4 h-4" />
                            Create Room
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-dark-card border border-dark-border rounded-lg p-4">
                        <p className="text-gray-400 text-sm">Total Rooms</p>
                        <p className="text-2xl font-bold text-white mt-1">
                            {rooms.length}
                        </p>
                    </div>
                    <div className="bg-dark-card border border-dark-border rounded-lg p-4">
                        <p className="text-gray-400 text-sm">Active Rooms</p>
                        <p className="text-2xl font-bold text-green-400 mt-1">
                            {rooms.filter((r) => r.isActive).length}
                        </p>
                    </div>
                    <div className="bg-dark-card border border-dark-border rounded-lg p-4">
                        <p className="text-gray-400 text-sm">Created by You</p>
                        <p className="text-2xl font-bold text-primary mt-1">
                            {rooms.filter((r) => r.createdBy?._id === user?._id).length}
                        </p>
                    </div>
                </div>

                {/* Rooms */}
                <div>
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Code2 className="w-5 h-5 text-primary" />
                        My Rooms
                    </h2>

                    {/* Loading */}
                    {loading && (
                        <div className="flex justify-center py-20">
                            <Loader size="lg" text="Loading rooms..." />
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && rooms.length === 0 && (
                        <div className="text-center py-20 border border-dashed border-dark-border rounded-xl">
                            <Code2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-400 mb-2">
                                No rooms yet
                            </h3>
                            <p className="text-gray-500 mb-6">
                                Create a room or join an existing one to start coding
                            </p>
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="px-6 py-2 bg-primary hover:bg-primary-dark rounded-lg transition"
                            >
                                Create Your First Room
                            </button>
                        </div>
                    )}

                    {/* Rooms Grid */}
                    {!loading && rooms.length > 0 && (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {rooms.map((room) => (
                                <div
                                    key={room._id}
                                    onClick={() => navigate(`/room/${room.roomId}`)}
                                    className="bg-dark-card border border-dark-border rounded-xl p-5 cursor-pointer hover:border-primary transition group"
                                >
                                    {/* Room Header */}
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-2 flex-1 min-w-0">
                                            {room.isPrivate ? (
                                                <Lock className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                                            ) : (
                                                <Globe className="w-4 h-4 text-green-400 flex-shrink-0" />
                                            )}
                                            <h3 className="font-semibold text-white truncate">
                                                {room.name}
                                            </h3>
                                        </div>

                                        {/* Delete (only owner) */}
                                        {room.createdBy?._id === user?._id && (
                                            <button
                                                onClick={(e) => handleDelete(room.roomId, e)}
                                                disabled={deletingId === room.roomId}
                                                className="text-gray-600 hover:text-red-400 transition ml-2"
                                            >
                                                {deletingId === room.roomId ? (
                                                    <Loader size="sm" />
                                                ) : (
                                                    <Trash2 className="w-4 h-4" />
                                                )}
                                            </button>
                                        )}
                                    </div>

                                    {/* Room ID */}
                                    <p className="text-gray-500 text-xs mb-3 font-mono">
                                        ID: {room.roomId}
                                    </p>

                                    {/* Language Badge */}
                                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium mb-3 ${getLangColor(room.language)}`}>
                                        {room.language}
                                    </span>

                                    {/* Footer */}
                                    <div className="flex justify-between items-center text-xs text-gray-500 mt-2">
                                        <div className="flex items-center gap-1">
                                            <Users className="w-3 h-3" />
                                            {room.participants?.length || 0}/{room.maxParticipants}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {formatDistanceToNow(new Date(room.updatedAt), { addSuffix: true })}
                                        </div>
                                    </div>

                                    {/* Enter button (hover) */}
                                    <div className="mt-4 flex items-center justify-end text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition">
                                        Enter Room
                                        <ArrowRight className="w-4 h-4 ml-1" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            {showCreateModal && (
                <CreateRoomModal
                    onClose={() => setShowCreateModal(false)}
                    onRoomCreated={handleRoomCreated}
                />
            )}
            {showJoinModal && (
                <JoinRoomModal onClose={() => setShowJoinModal(false)} />
            )}
        </div>
    );
};

export default Dashboard;